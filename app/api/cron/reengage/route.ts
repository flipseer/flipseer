// app/api/cron/weekly-reengage/route.ts
// Every Monday 10:00 UTC — emails users who did NOT predict last matchweek
// Different from one-time reengage — this runs every week all season
// vercel.json: { "path": "/api/cron/weekly-reengage", "schedule": "0 10 * * 1" }
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','ZA':'🇿🇦','SN':'🇸🇳',
}
const COUNTRY: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'South Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','ZA':'South Africa','SN':'Senegal',
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // Get last week's completed matches
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: lastWeekMatches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, round, kickoff')
      .eq('status', 'completed')
      .eq('competition', 'EPL 2026/27')
      .gte('kickoff', weekAgo)

    if (!lastWeekMatches || lastWeekMatches.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No matches last week to reference' })
    }

    const matchweek = lastWeekMatches[0]?.round?.replace('Regular Season - ', '') || '1'
    const nextMatchweek = (parseInt(matchweek) + 1).toString()
    const lastMatchIds = lastWeekMatches.map((m: any) => m.id)

    // Get next matchweek fixtures
    const { data: nextMatches } = await supabase
      .from('matches')
      .select('home_team, away_team, kickoff')
      .eq('competition', 'EPL 2026/27')
      .eq('round', `Regular Season - ${nextMatchweek}`)
      .in('status', ['upcoming', 'locked'])
      .order('kickoff', { ascending: true })
      .limit(4)

    // Users who DID predict last week
    const { data: activePredictors } = await supabase
      .from('predictions')
      .select('user_id')
      .in('match_id', lastMatchIds)
    const activeIds = new Set((activePredictors || []).map((p: any) => p.user_id))

    // All registered users
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, country, total_points, prediction_count')
    
    // Users who did NOT predict last week but are registered
    const inactiveProfiles = (profiles || []).filter(
      (p: any) => !activeIds.has(p.id)
    )

    if (inactiveProfiles.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Everyone predicted this week!' })
    }

    // Get emails
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authUsers?.users?.forEach((u: any) => { if (u.email) emailMap[u.id] = u.email })

    // Nation leaderboard for context
    const nationMap: Record<string, number> = {}
    profiles?.forEach((p: any) => {
      if (!p.country) return
      nationMap[p.country] = (nationMap[p.country] || 0) + (p.total_points || 0)
    })
    const topNation = Object.entries(nationMap).sort((a, b) => b[1] - a[1])[0]
    const topNationName = topNation ? (COUNTRY[topNation[0]] || topNation[0]) : 'Indonesia'
    const topNationFlag = topNation ? (FLAG[topNation[0]] || '🌍') : '🇮🇩'
    const topNationPts = topNation?.[1] || 0

    // Next fixtures preview HTML
    const fixturesHtml = (nextMatches || []).map((m: any) => {
      const kickoff = new Date(m.kickoff.endsWith('Z') ? m.kickoff : m.kickoff.replace(' ', 'T') + 'Z')
      const dateStr = kickoff.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1A3A1A">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;font-weight:bold;color:white">${m.home_team} vs ${m.away_team}</td>
              <td style="font-size:11px;color:#6B7280;text-align:right">${dateStr}</td>
            </tr></table>
          </td>
        </tr>`
    }).join('')

    let sent = 0
    const results = []

    for (const profile of inactiveProfiles) {
      const email = emailMap[profile.id]
      if (!email) continue

      const flag = FLAG[profile.country] || '🌍'
      const nationName = COUNTRY[profile.country] || 'your nation'
      const hasNation = !!profile.country && !!FLAG[profile.country]

      // Personalise message based on whether they've ever predicted
      const isNewUser = (profile.prediction_count || 0) === 0
      const subject = isNewUser
        ? `🏴󠁧󠁢󠁥󠁮󠁧󠁿 @${profile.username} — Matchweek ${nextMatchweek} is open. Your record is still empty.`
        : `🏴󠁧󠁢󠁥󠁮󠁧󠁿 @${profile.username} — You missed Matchweek ${matchweek}. Matchweek ${nextMatchweek} is open now.`

      const heroMessage = isNewUser
        ? `You signed up for Flipseer but haven't made your first prediction yet. <strong style="color:white">Matchweek ${nextMatchweek} is open right now.</strong>`
        : `You didn't predict in Matchweek ${matchweek}. Those matches are locked forever — but <strong style="color:white">Matchweek ${nextMatchweek} is open right now.</strong>`

      try {
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: email,
          subject,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0D1F0F;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#0D1F0F;color:white">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#4C1D95,#1A0B2E);padding:28px 32px;text-align:center">
    <div style="font-size:11px;color:#C4B5FD;font-weight:bold;letter-spacing:3px;margin-bottom:8px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER · EPL 2026/27</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0;color:white">
      Matchweek ${nextMatchweek} is open.
    </h1>
    <p style="font-size:14px;color:#C4B5FD;margin:8px 0 0">Predictions lock at kick-off. No second chances.</p>
  </div>

  <!-- HERO -->
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 20px">
      Hi @${profile.username} 👋<br/><br/>
      ${heroMessage}
    </p>
    ${hasNation ? `
    <div style="background:rgba(139,92,246,0.1);border:1px solid #8B5CF6;border-radius:10px;padding:14px 16px;margin-bottom:20px">
      <p style="font-size:13px;color:#C4B5FD;margin:0">
        ${flag} <strong>${nationName}</strong> needs your predictions to climb the Nation Battle.
        ${topNationFlag} <strong>${topNationName}</strong> leads with ${topNationPts} pts.
      </p>
    </div>` : ''}
    <div style="text-align:center">
      <a href="https://flipseer.com/predict?utm_source=email&utm_medium=weekly_reengage&utm_campaign=mw${nextMatchweek}"
        style="display:inline-block;background:#8B5CF6;color:white;padding:16px 40px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;box-shadow:0 0 24px rgba(139,92,246,0.3)">
        🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict Matchweek ${nextMatchweek} Now →
      </a>
      <p style="font-size:11px;color:#4B5563;margin-top:10px">Free forever · No betting · No card required</p>
    </div>
  </div>

  <!-- NEXT FIXTURES -->
  ${nextMatches && nextMatches.length > 0 ? `
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin:0 0 16px">MATCHWEEK ${nextMatchweek} — UPCOMING FIXTURES</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${fixturesHtml}
    </table>
    <div style="text-align:center;margin-top:16px">
      <a href="https://flipseer.com/predict" style="font-size:13px;color:#8B5CF6;text-decoration:none;font-weight:bold">View all fixtures →</a>
    </div>
  </div>` : ''}

  <!-- PERMANENT RECORD REMINDER -->
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69;text-align:center">
    <div style="font-size:32px;margin-bottom:12px">📖</div>
    <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 10px">Every match is permanent.</h2>
    <p style="font-size:14px;color:#9CA3AF;line-height:1.7;margin:0">
      Flipseer builds your permanent Football Reputation — every prediction you make stays on your record forever.
      Miss a matchweek and those calls are gone from your record permanently.
    </p>
  </div>

  <!-- FOOTER -->
  <div style="padding:24px 32px;text-align:center">
    <div style="font-size:18px;font-weight:bold;color:#8B5CF6;margin-bottom:12px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER</div>
    <p style="font-size:12px;color:#4B5563;margin:0 0 8px">Free forever · No betting · Pure football intelligence</p>
    <p style="font-size:11px;color:#2E4A2E;margin:0">
      © 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a>
    </p>
  </div>

</div></body></html>`,
        })
        sent++
        results.push({ username: profile.username, isNewUser, status: 'sent' })
      } catch (err: any) {
        results.push({ username: profile.username, status: 'failed', error: err.message })
      }
    }

    return NextResponse.json({
      sent,
      total_inactive: inactiveProfiles.length,
      matchweek,
      next_matchweek: nextMatchweek,
      results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
