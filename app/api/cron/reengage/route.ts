// app/api/cron/weekly-report/route.ts
// Sends personalised weekly matchweek report to all active users
// Run every Monday at 09:00 UTC after matchweek results are processed
// vercel.json: { "path": "/api/cron/weekly-report", "schedule": "0 9 * * 1" }
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

function buildNationRows(nations: any[]) {
  return nations.slice(0, 5).map((n: any, i: number) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #1A3A1A;font-size:13px;color:#6B7280;width:30px">${medals[i]}</td>
        <td style="padding:8px 0;border-bottom:1px solid #1A3A1A;font-size:18px;width:30px">${n.flag}</td>
        <td style="padding:8px 0;border-bottom:1px solid #1A3A1A;font-size:14px;color:white;font-weight:bold">${n.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #1A3A1A;font-size:14px;color:#8B5CF6;font-weight:bold;text-align:right">${n.points} pts</td>
      </tr>`;
  }).join('');
}

const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','ZA':'🇿🇦','SN':'🇸🇳','NG':'🇳🇬',
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
    // Determine last matchweek (matches completed in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recentMatches } = await supabase
      .from('matches').select('id, home_team, away_team, home_score, away_score, round, kickoff')
      .eq('status', 'completed').eq('competition', 'EPL 2026/27')
      .gte('kickoff', weekAgo).order('kickoff', { ascending: true })

    if (!recentMatches || recentMatches.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No completed matches this week' })
    }

    // Get matchweek number from round string
    const matchweek = recentMatches[0]?.round?.replace('Regular Season - ', 'MW') || 'MW1'
    const nextMatchweek = (parseInt(matchweek.replace('MW', '')) + 1).toString()
    const weekDates = new Date(recentMatches[0].kickoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      + ' – ' + new Date(recentMatches[recentMatches.length - 1].kickoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    // Nation leaderboard
    const { data: allProfiles } = await supabase.from('profiles').select('country, total_points')
    const nationMap: Record<string, number> = {}
    allProfiles?.forEach((p: any) => {
      if (!p.country) return
      nationMap[p.country] = (nationMap[p.country] || 0) + (p.total_points || 0)
    })
    const nationLeaderboard = Object.entries(nationMap)
      .map(([code, points]) => ({ code, name: COUNTRY[code] || code, flag: FLAG[code] || '🌍', points }))
      .sort((a, b) => b.points - a.points)

    // All users with predictions this week
    const matchIds = recentMatches.map((m: any) => m.id)
    const { data: weekPredictions } = await supabase
      .from('predictions').select('user_id, match_id, points_earned, base_points, exact_bonus, upset_bonus, predicted_outcome, confidence_pct, prediction_processed')
      .in('match_id', matchIds).eq('prediction_processed', true)

    // All profiles
    const { data: profiles } = await supabase.from('profiles')
      .select('id, username, country, total_points, prediction_count, correct_count')
      .gt('prediction_count', 0).order('total_points', { ascending: false })

    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authUsers?.users?.forEach((u: any) => { if (u.email) emailMap[u.id] = u.email })

    let sent = 0
    const results = []

    for (const profile of (profiles || [])) {
      const email = emailMap[profile.id]
      if (!email) continue

      // User's week stats
      const userPreds = (weekPredictions || []).filter((p: any) => p.user_id === profile.id)
      if (userPreds.length === 0) continue // Skip if didn't predict this week

      const weekPoints = userPreds.reduce((sum: number, p: any) => sum + (p.points_earned || 0), 0)
      const weekCorrect = userPreds.filter((p: any) => (p.base_points || 0) > 0).length
      const globalRank = (profiles || []).findIndex((p: any) => p.id === profile.id) + 1

      // Best prediction this week
      const bestPred = userPreds.sort((a: any, b: any) => (b.points_earned || 0) - (a.points_earned || 0))[0]
      const bestMatch = recentMatches.find((m: any) => m.id === bestPred?.match_id)
      const bestMatchName = bestMatch ? `${bestMatch.home_team} vs ${bestMatch.away_team}` : 'N/A'
      const bestPick = bestPred?.predicted_outcome === 'home' ? bestMatch?.home_team
        : bestPred?.predicted_outcome === 'away' ? bestMatch?.away_team : 'Draw'
      const bestBadges = [
        bestPred?.exact_bonus > 0 ? '<span style="font-size:11px;background:rgba(245,158,11,0.2);color:#F59E0B;padding:2px 8px;border-radius:999px;margin-left:8px">EXACT SCORE</span>' : '',
        bestPred?.upset_bonus > 0 ? '<span style="font-size:11px;background:rgba(139,92,246,0.2);color:#8B5CF6;padding:2px 8px;border-radius:999px;margin-left:4px">UPSET</span>' : '',
      ].join('')

      // Nation message
      const userNationRank = nationLeaderboard.findIndex(n => n.code === profile.country) + 1
      const userNationName = COUNTRY[profile.country] || profile.country
      const nationMsg = userNationRank > 0
        ? `${FLAG[profile.country] || '🌍'} ${userNationName} is ranked #${userNationRank} in the Nation Battle. Your predictions this week earned ${weekPoints} pts for your nation.`
        : 'Set your country on your profile to represent your nation in the Nation Battle.'

      // Next matchweek fixtures count
      const { count: nextFixtures } = await supabase.from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('competition', 'EPL 2026/27')
        .eq('round', `Regular Season - ${nextMatchweek}`)
        .in('status', ['upcoming', 'locked'])

      try {
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: email,
          subject: `🏴󠁧󠁢󠁥󠁮󠁧󠁿 @${profile.username} — Your Matchweek ${matchweek.replace('MW', '')} Report`,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0D1F0F;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#0D1F0F;color:white">
  <div style="background:linear-gradient(135deg,#4C1D95,#1A0B2E);padding:28px 32px;text-align:center">
    <div style="font-size:11px;color:#C4B5FD;font-weight:bold;letter-spacing:3px;margin-bottom:8px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER · WEEKLY REPORT</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0;color:white">Matchweek ${matchweek.replace('MW', '')} — Your Report</h1>
    <p style="font-size:13px;color:#C4B5FD;margin:8px 0 0">${weekDates}</p>
  </div>
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin:0 0 16px">YOUR WEEK · @${profile.username}</p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="text-align:center;padding:16px;background:#0D2B14;border-radius:12px;border:1px solid #2D1B69">
        <div style="font-size:28px;font-weight:bold;color:#8B5CF6;font-family:Georgia,serif">${weekPoints}</div>
        <div style="font-size:10px;color:#6B7280;margin-top:4px">PTS THIS WEEK</div>
      </td>
      <td style="width:8px"></td>
      <td style="text-align:center;padding:16px;background:#0D2B14;border-radius:12px;border:1px solid #2D1B69">
        <div style="font-size:28px;font-weight:bold;color:#F59E0B;font-family:Georgia,serif">${weekCorrect}/${userPreds.length}</div>
        <div style="font-size:10px;color:#6B7280;margin-top:4px">CORRECT</div>
      </td>
      <td style="width:8px"></td>
      <td style="text-align:center;padding:16px;background:#0D2B14;border-radius:12px;border:1px solid #2D1B69">
        <div style="font-size:28px;font-weight:bold;color:#2E9E5E;font-family:Georgia,serif">${profile.total_points}</div>
        <div style="font-size:10px;color:#6B7280;margin-top:4px">TOTAL PTS</div>
      </td>
      <td style="width:8px"></td>
      <td style="text-align:center;padding:16px;background:#0D2B14;border-radius:12px;border:1px solid #2D1B69">
        <div style="font-size:28px;font-weight:bold;color:#EF4444;font-family:Georgia,serif">#${globalRank}</div>
        <div style="font-size:10px;color:#6B7280;margin-top:4px">GLOBAL RANK</div>
      </td>
    </tr></table>
  </div>
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin:0 0 16px">NATION BATTLE</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
      ${buildNationRows(nationLeaderboard)}
    </table>
    <div style="padding:12px 16px;background:rgba(139,92,246,0.1);border:1px solid #8B5CF6;border-radius:10px">
      <p style="font-size:13px;color:#C4B5FD;margin:0">${nationMsg}</p>
    </div>
  </div>
  ${bestPred && bestPred.points_earned > 0 ? `
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#F59E0B;font-weight:bold;letter-spacing:3px;margin:0 0 16px">YOUR BEST CALL THIS WEEK</p>
    <div style="background:#0D2B14;border:1px solid #2D1B69;border-radius:12px;padding:20px">
      <div style="font-size:16px;font-weight:bold;color:white;margin-bottom:8px">${bestMatchName}</div>
      <div style="font-size:13px;color:#9CA3AF;margin-bottom:10px">Pick: <strong style="color:#8B5CF6">${bestPick}</strong> · Confidence: <strong style="color:#8B5CF6">${bestPred.confidence_pct}%</strong></div>
      <div style="text-align:center;padding:10px;background:rgba(139,92,246,0.15);border-radius:8px">
        <span style="font-size:18px;font-weight:bold;color:#8B5CF6">+${bestPred.points_earned} pts</span>${bestBadges}
      </div>
    </div>
  </div>` : ''}
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69;text-align:center">
    <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin:0 0 12px">MATCHWEEK ${nextMatchweek} — OPEN NOW</p>
    <p style="font-size:14px;color:#9CA3AF;margin:0 0 20px">${nextFixtures || 10} fixtures open. Predict before kick-off.</p>
    <a href="https://flipseer.com/predict?utm_source=email&utm_medium=weekly&utm_campaign=mw${nextMatchweek}"
      style="display:inline-block;background:#8B5CF6;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:bold">
      🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict Matchweek ${nextMatchweek} →
    </a>
  </div>
  <div style="padding:24px 32px;text-align:center">
    <div style="font-size:18px;font-weight:bold;color:#8B5CF6;margin-bottom:12px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER</div>
    <p style="font-size:12px;color:#4B5563;margin:0 0 8px">Free forever · No betting · Pure football intelligence</p>
    <p style="font-size:11px;color:#2E4A2E;margin:0">© 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a></p>
  </div>
</div></body></html>`,
        })
        sent++
        results.push({ username: profile.username, weekPoints, weekCorrect, status: 'sent' })
      } catch (err: any) {
        results.push({ username: profile.username, status: 'failed', error: err.message })
      }
    }

    return NextResponse.json({ sent, total: profiles?.length || 0, matchweek, results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
