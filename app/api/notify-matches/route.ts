// app/api/notify-matches/route.ts
// Fires every 10 min — finds matches kicking off in ~2hrs
// Posts matchday preview to X + Facebook only (no email)
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
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

async function postToX(text: string): Promise<boolean> {
  if (!process.env.X_API_KEY || !process.env.X_API_SECRET ||
      !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_SECRET) return false
  try {
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
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('X post error:', res.status, err)
    }
    return res.ok
  } catch (e) {
    console.error('X post exception:', e)
    return false
  }
}

async function postToFacebook(text: string): Promise<boolean> {
  if (!process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_PAGE_TOKEN) return false
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, access_token: process.env.FACEBOOK_PAGE_TOKEN }),
      }
    )
    return res.ok
  } catch (e) {
    console.error('Facebook post exception:', e)
    return false
  }
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

  try {
    // Find matches kicking off in ~4 hours not yet posted
    const in2h = new Date(Date.now() + 4 * 60 * 60 * 1000)
    const in2h10 = new Date(Date.now() + 4 * 60 * 60 * 1000 + 10 * 60 * 1000)

    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, kickoff, competition, round')
      .eq('status', 'upcoming')
      .eq('matchday_posted', false)
      .gte('kickoff', in2h.toISOString())
      .lte('kickoff', in2h10.toISOString())

    if (!matches?.length) {
      return NextResponse.json({ posted: 0, message: 'No matches in 4hr window' })
    }

    // Group matches by competition + kickoff hour → one post per group
    const groups: Record<string, typeof matches> = {}
    for (const match of matches) {
      const kickoffHour = match.kickoff.slice(0, 13) // 'YYYY-MM-DD HH'
      const key = `${match.competition}__${kickoffHour}`
      if (!groups[key]) groups[key] = []
      groups[key].push(match)
    }

    const results = []

    for (const [, groupMatches] of Object.entries(groups)) {
      const first = groupMatches[0]
      const emoji = COMP_EMOJI[first.competition] || '⚽'
      const hashtags = COMP_HASHTAGS[first.competition] || '#Flipseer'
      const kickoffLocal = new Date(first.kickoff.endsWith('Z')
        ? first.kickoff : first.kickoff.replace(' ', 'T') + 'Z')
      const timeStr = kickoffLocal.toLocaleTimeString('en-GB', {
        timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true,
      }) + ' UTC'

      let postText: string
      if (groupMatches.length === 1) {
        // Single match — individual post
        postText = `${emoji} MATCHDAY

${first.home_team} vs ${first.away_team}
Kickoff: ${timeStr} · 4 hours to go

Who wins? Predict before kickoff 👇
🔗 flipseer.com/predict

${hashtags}`
      } else {
        // Multiple matches same competition + time — one batched post
        const fixtures = groupMatches
          .map(m => `• ${m.home_team} vs ${m.away_team}`)
          .join('\n')
        postText = `${emoji} MATCHDAY · ${groupMatches.length} fixtures

${fixtures}

Kickoff: ${timeStr} · 4 hours to go
Predict before kickoff 👇
🔗 flipseer.com/predict

${hashtags}`
      }

      const [x, facebook] = await Promise.all([
        postToX(postText),
        postToFacebook(postText),
      ])

      // Mark all matches in group as posted
      const ids = groupMatches.map(m => m.id)
      await supabase.from('matches').update({ matchday_posted: true }).in('id', ids)

      // Email admin
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const subject = groupMatches.length === 1
          ? `⚽ Matchday: ${first.home_team} vs ${first.away_team} — Share Now`
          : `⚽ Matchday: ${groupMatches.length} ${first.competition} fixtures — Share Now`
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: 'contact@flipseer.com',
          subject,
          html: `<div style="font-family:Arial;padding:24px;background:#0D1F0F;color:white;max-width:600px">
            <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin-bottom:8px">FLIPSEER · MATCHDAY</p>
            <div style="background:#0D2B14;padding:18px;border-radius:10px;white-space:pre-wrap;font-size:14px;color:white;border:1px solid #2E9E5E;line-height:1.7">
              ${postText.split('\n').join('<br/>')}
            </div>
            <p style="color:#4B5563;font-size:11px;margin-top:16px;text-align:center">flipseer.com · contact@flipseer.com</p>
          </div>`,
        })
      } catch (emailErr) {}

      results.push({
        matches: groupMatches.map(m => `${m.home_team} vs ${m.away_team}`),
        count: groupMatches.length,
        x,
        facebook,
      })
    }

    return NextResponse.json({ posted: results.length, results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
