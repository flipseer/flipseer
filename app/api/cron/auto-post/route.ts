// app/api/cron/auto-post/route.ts
// Called by match processor after each match completes — posts result to X + Facebook
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
    || request.headers.get('user-agent')?.includes('vercel')
  const isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`
    || secretParam === process.env.CRON_SECRET
    || isVercelCron
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Env var check
  const xApiKey = process.env.X_API_KEY || ''
  const xApiSecret = process.env.X_API_SECRET || ''
  const xAccessToken = process.env.X_ACCESS_TOKEN || ''
  const xAccessSecret = process.env.X_ACCESS_SECRET || ''
  const hasX = !!(xApiKey && xApiSecret && xAccessToken && xAccessSecret)

  const envCheck = {
    has_api_key: !!xApiKey,
    has_api_secret: !!xApiSecret,
    has_access_token: !!xAccessToken,
    has_access_secret: !!xAccessSecret,
    api_key_prefix: xApiKey.substring(0, 6),
    access_token_prefix: xAccessToken.substring(0, 6),
  }

  try {
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
      return NextResponse.json({ posted: 0, message: 'No new matches to post', env_check: envCheck })
    }

    const posted = []

    for (const match of matches) {
      const { data: topPred } = await supabase
        .from('predictions')
        .select('user_id, points_earned')
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

      const { count: predCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('match_id', match.id)

      const emoji = COMP_EMOJI[match.competition] || '⚽'
      const hashtags = COMP_HASHTAGS[match.competition] || '#Flipseer'
      const score = `${match.home_score}-${match.away_score}`
      const upset = match.is_upset ? '\n🚨 UPSET RESULT!' : ''

      const postText = `${emoji} FULL TIME\n${match.home_team} ${score} ${match.away_team}${upset}\n\n${topUsername ? `🎯 Top predictor: @${topUsername} (+${topPred?.points_earned} pts)\n` : ''}👥 ${predCount || 0} predictions made\n\nPredict next → flipseer.com/predict\n${hashtags}`

      let xPosted = false
      let xError = ''
      let fbPosted = false

      // POST TO X using OAuth 2.0 user access token
      if (hasX) {
        try {
          const token = xOauth2Token || xAccessToken
          const xRes = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: postText }),
          })
          const xResponseText = await xRes.text()
          xPosted = xRes.ok
          if (!xRes.ok) {
            xError = `${xRes.status}: ${xResponseText}`
          }
        } catch (e: any) {
          xError = `Exception: ${e.message}`
        }
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
        } catch (e) {}
      }

      await supabase.from('matches').update({ social_posted: true }).eq('id', match.id)

      posted.push({
        match: `${match.home_team} ${score} ${match.away_team}`,
        x: xPosted,
        x_error: xError || undefined,
        facebook: fbPosted,
      })
    }

    return NextResponse.json({ posted: posted.length, results: posted, env_check: envCheck })

  } catch (err: any) {
    return NextResponse.json({ error: err.message, env_check: envCheck }, { status: 500 })
  }
}
