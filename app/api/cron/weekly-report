// app/api/cron/weekly-report/route.ts
// Monday 09:00 UTC — sends weekly leaderboard digest to active users
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵','KR':'🇰🇷','PK':'🇵🇰',
  'BD':'🇧🇩','NG':'🇳🇬','EG':'🇪🇬','ZA':'🇿🇦','TR':'🇹🇷',
}
const COUNTRY: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'GH':'Ghana','MA':'Morocco','JP':'Japan','KR':'South Korea','PK':'Pakistan',
  'BD':'Bangladesh','EG':'Egypt','ZA':'South Africa','TR':'Turkey',
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron-signature') !== null
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !isVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Active users — predicted in last 7 days
    const { data: recentPreds } = await supabase
      .from('predictions')
      .select('user_id, points_earned')
      .gte('created_at', weekAgo)
    const activeIds = new Set((recentPreds || []).map((p: any) => p.user_id))

    // Global top 10 leaderboard
    const { data: topLeaders } = await supabase
      .from('profiles')
      .select('id, username, total_points, accuracy_pct, prediction_count, country, rank_icon')
      .gt('prediction_count', 0)
      .order('total_points', { ascending: false })
      .limit(10)

    // Nation leaderboard
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('country, total_points, id')
    const nationMap: Record<string, number> = {}
    allProfiles?.forEach((p: any) => {
      if (!p.country) return
      nationMap[p.country] = (nationMap[p.country] || 0) + (p.total_points || 0)
    })
    const topNations = Object.entries(nationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // This week's predictions count
    const weekPreds = recentPreds?.length || 0
    const weekPts = (recentPreds || []).reduce((s: number, p: any) => s + (p.points_earned || 0), 0)

    // Get emails for active users
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authUsers?.users?.forEach((u: any) => { if (u.email) emailMap[u.id] = u.email })

    // Active profiles
    const activeProfiles = (allProfiles || []).filter((p: any) => activeIds.has(p.id))

    // Build leaderboard HTML
    const medals = ['🥇', '🥈', '🥉']
    const leaderboardRows = (topLeaders || []).map((l: any, i: number) => {
      const flag = FLAG[l.country] || '🌍'
      const medal = i < 3 ? medals[i] : `#${i + 1}`
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1A3A1A">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="width:36px;font-size:18px;text-align:center">${medal}</td>
              <td style="font-size:14px;font-weight:bold;color:white">${flag} @${l.username}</td>
              <td style="font-size:12px;color:#6B7280;text-align:right">${l.accuracy_pct}% acc</td>
              <td style="font-size:16px;font-weight:bold;color:${i === 0 ? '#F59E0B' : '#8B5CF6'};text-align:right;padding-left:12px">${l.total_points} pts</td>
            </tr></table>
          </td>
        </tr>`
    }).join('')

    const nationRows = topNations.map(([code, pts], i) => {
      const flag = FLAG[code] || '🌍'
      const name = COUNTRY[code] || code
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1A3A1A">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:14px;color:#4B5563;width:28px">#${i + 1}</td>
              <td style="font-size:14px;color:white">${flag} ${name}</td>
              <td style="font-size:14px;font-weight:bold;color:#F59E0B;text-align:right">${pts} pts</td>
            </tr></table>
          </td>
        </tr>`
    }).join('')

    let sent = 0
    // Send to active users only
    for (const profile of activeProfiles) {
      const email = emailMap[profile.id]
      if (!email) continue

      // Find this user's rank
      const userRank = (topLeaders || []).findIndex((l: any) => l.id === profile.id) + 1
      const userProfile = topLeaders?.find((l: any) => l.id === profile.id)

      try {
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: email,
          subject: `📊 Weekly Leaderboard — ${userRank > 0 ? `You are #${userRank}` : 'See where you stand'}`,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0D1F0F;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:#0D1F0F;color:white">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#1A0B2E,#4C1D95);padding:28px 32px;text-align:center">
    <div style="font-size:11px;color:#C4B5FD;font-weight:bold;letter-spacing:3px;margin-bottom:8px">📊 WEEKLY LEADERBOARD</div>
    <h1 style="font-family:Georgia,serif;font-size:28px;margin:0;color:white">Your Football Reputation<br/>This Week</h1>
  </div>

  <!-- WEEK STATS -->
  <div style="padding:24px 32px;border-bottom:1px solid #2D1B69">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="text-align:center">
        <div style="font-size:32px;font-weight:bold;color:#8B5CF6;font-family:Georgia,serif">${weekPreds}</div>
        <div style="font-size:11px;color:#4B5563">Predictions This Week</div>
      </td>
      <td style="text-align:center">
        <div style="font-size:32px;font-weight:bold;color:#F59E0B;font-family:Georgia,serif">${weekPts}</div>
        <div style="font-size:11px;color:#4B5563">Points Earned</div>
      </td>
      <td style="text-align:center">
        <div style="font-size:32px;font-weight:bold;color:#2E9E5E;font-family:Georgia,serif">${userRank > 0 ? '#' + userRank : '—'}</div>
        <div style="font-size:11px;color:#4B5563">Your Global Rank</div>
      </td>
    </tr></table>
  </div>

  <!-- GLOBAL LEADERBOARD -->
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#8B5CF6;font-weight:bold;letter-spacing:3px;margin:0 0 16px">🏆 GLOBAL TOP 10</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${leaderboardRows}
    </table>
    <div style="text-align:center;margin-top:16px">
      <a href="https://flipseer.com/leaderboard" style="font-size:13px;color:#8B5CF6;text-decoration:none;font-weight:bold">Full leaderboard →</a>
    </div>
  </div>

  <!-- NATION BATTLE -->
  <div style="padding:28px 32px;border-bottom:1px solid #2D1B69">
    <p style="font-size:11px;color:#F59E0B;font-weight:bold;letter-spacing:3px;margin:0 0 16px">🌍 NATION BATTLE TOP 5</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${nationRows}
    </table>
    <div style="text-align:center;margin-top:16px">
      <a href="https://flipseer.com/nations" style="font-size:13px;color:#F59E0B;text-decoration:none;font-weight:bold">Nation Battle standings →</a>
    </div>
  </div>

  <!-- CTA -->
  <div style="padding:28px 32px;text-align:center;border-bottom:1px solid #2D1B69">
    <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 10px">Keep predicting.</h2>
    <p style="font-size:14px;color:#9CA3AF;margin:0 0 20px">New EPL matches are open. Predictions lock at kickoff.</p>
    <a href="https://flipseer.com/predict" style="display:inline-block;background:#8B5CF6;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:bold">
      ⚽ Predict Now →
    </a>
  </div>

  <!-- FOOTER -->
  <div style="padding:24px 32px;text-align:center">
    <div style="font-size:16px;font-weight:bold;color:#8B5CF6;margin-bottom:8px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER</div>
    <p style="font-size:11px;color:#4B5563;margin:0">© 2026 Flipseer ·
      <a href="https://flipseer.com/unsubscribe?email=${email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a>
    </p>
  </div>

</div></body></html>`,
        })
        sent++
      } catch (e) {}
    }

    return NextResponse.json({ sent, active_users: activeProfiles.length, week_predictions: weekPreds })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
