// app/api/cron/auto-post/route.ts
// Runs every 30 min — finds recently completed matches and posts to X + Facebook
// Posts once per match — tracks posted matches in a simple DB flag
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const COMP_HASHTAGS: Record<string, string> = {
  'EPL 2026/27':      '#PremierLeague #EPL2027 #Flipseer',
  'UCL 2026/27':      '#ChampionsLeague #UCL #Flipseer',
  'Liga 1 2026/27':   '#Liga1 #LigaIndonesia #Flipseer',
  'Ghana PL 2026/27': '#GhanaFootball #GPL2027 #Flipseer',
  'World Cup 2026':   '#WorldCup2026 #Flipseer',
}

const COMP_EMOJI: Record<string, string> = {
  'EPL 2026/27':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UCL 2026/27':      '⭐',
  'Liga 1 2026/27':   '🇮🇩',
  'Ghana PL 2026/27': '🇬🇭',
  'World Cup 2026':   '🏆',
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secretParam = request.nextUrl.searchParams.get('secret')
  const isVercelCron = request.headers.get('x-vercel-cron-signature') !== null
  const isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`
    || secretParam === process.env.CRON_SECRET
    || isVercelCron
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Accept specific match_id from match processor OR find recent unposted matches
    const matchId = request.nextUrl.searchParams.get('match_id')
    let query = supabase
      .from('matches')
      .select('id, home_team, away_team, home_score, away_score, competition, round, is_upset')
      .eq('status', 'completed')
      .eq('results_processed', true)
      .eq('social_posted', false)

    if (matchId) {
      query = query.eq('id', matchId)
    } else {
      query = query.gte('kickoff', new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()).limit(3)
    }

    const { data: matches } = await query

    if (!matches || matches.length === 0) {
      return NextResponse.json({ posted: 0, message: 'No new matches to post' })
    }

    const posted = []

    for (const match of matches) {
      // Get top predictor for this match
      const { data: topPred } = await supabase
        .from('predictions')
        .select('user_id, points_earned, predicted_home_score, predicted_away_score')
        .eq('match_id', match.id)
        .eq('prediction_processed', true)
        .order('points_earned', { ascending: false })
        .limit(1)
        .single()

      let topUsername = ''
      if (topPred?.user_id && topPred.points_earned > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', topPred.user_id)
          .single()
        topUsername = profile?.username || ''
      }

      // Get total predictions for this match
      const { count: predCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('match_id', match.id)

      const emoji = COMP_EMOJI[match.competition] || '⚽'
      const hashtags = COMP_HASHTAGS[match.competition] || '#Flipseer'
      const score = `${match.home_score}-${match.away_score}`
      const upset = match.is_upset ? '\n🚨 UPSET RESULT!' : ''

      // Build post text
      const postText = `${emoji} FULL TIME
${match.home_team} ${score} ${match.away_team}${upset}

${topUsername ? `🎯 Top predictor: @${topUsername} (+${topPred?.points_earned} pts)` : ''}
👥 ${predCount || 0} predictions made

Predict next → flipseer.com/predict
${hashtags}`

      let xPosted = false
      let fbPosted = false

      // POST TO X (Twitter)
      if (process.env.X_BEARER_TOKEN && process.env.X_API_KEY && process.env.X_API_SECRET && process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_SECRET) {
        try {
          // Twitter OAuth 1.0a signing
          const crypto = await import('crypto')
          const timestamp = Math.floor(Date.now() / 1000).toString()
          const nonce = crypto.randomBytes(16).toString('hex')

          const oauthParams: Record<string, string> = {
            oauth_consumer_key: process.env.X_API_KEY,
            oauth_nonce: nonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: timestamp,
            oauth_token: process.env.X_ACCESS_TOKEN,
            oauth_version: '1.0',
          }

          const body = JSON.stringify({ text: postText })
          const baseUrl = 'https://api.twitter.com/2/tweets'
          const paramStr = Object.keys(oauthParams).sort()
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
            .join('&')
          const sigBase = `POST&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramStr)}`
          const sigKey = `${encodeURIComponent(process.env.X_API_SECRET)}&${encodeURIComponent(process.env.X_ACCESS_SECRET)}`
          const signature = crypto.createHmac('sha1', sigKey).update(sigBase).digest('base64')

          oauthParams['oauth_signature'] = signature
          const authHeader = 'OAuth ' + Object.keys(oauthParams).sort()
            .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
            .join(', ')

          const xRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body,
          })
          xPosted = xRes.ok
        } catch (e) { console.error('X post failed:', e) }
      }

      // POST TO FACEBOOK
      if (process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN) {
        try {
          const fbRes = await fetch(
            `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: postText,
                access_token: process.env.FACEBOOK_PAGE_TOKEN,
              }),
            }
          )
          fbPosted = fbRes.ok
        } catch (e) { console.error('Facebook post failed:', e) }
      }

      // Mark as posted
      await supabase
        .from('matches')
        .update({ social_posted: true })
        .eq('id', match.id)

      posted.push({
        match: `${match.home_team} ${score} ${match.away_team}`,
        x: xPosted,
        facebook: fbPosted,
      })
    }

    return NextResponse.json({ posted: posted.length, results: posted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
