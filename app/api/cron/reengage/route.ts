import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Vercel Cron — runs daily at 10:00 UTC
// Add to vercel.json: { "path": "/api/cron/reengage", "schedule": "0 10 * * *" }

const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','ZA':'🇿🇦','NO':'🇳🇴','SN':'🇸🇳',
}

const COUNTRY_NAMES: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'South Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','ZA':'South Africa',
  'NO':'Norway','SN':'Senegal',
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Find users with 0 predictions, signed up 48-96 hours ago, not yet re-engaged
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const ninetyHoursAgo = new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, country, reengage_sent')
      .eq('prediction_count', 0)
      .gte('created_at', ninetyHoursAgo)
      .lte('created_at', fortyEightHoursAgo)
      .eq('reengage_sent', false)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No users to re-engage' })
    }

    // Get emails from auth.users via service role
    const userIds = profiles.map(p => p.id)
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authUsers?.users?.forEach(u => {
      if (userIds.includes(u.id) && u.email) emailMap[u.id] = u.email
    })

    let sent = 0
    const results = []

    for (const profile of profiles) {
      const email = emailMap[profile.id]
      if (!email) continue

      const flag = FLAG[profile.country] || '🌍'
      const nationName = COUNTRY_NAMES[profile.country] || 'your nation'
      const hasNation = !!profile.country && !!FLAG[profile.country]

      try {
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: email,
          subject: `⚽ @${profile.username} — your football record is still empty`,
          html: `
            <div style="background:#0D1F0F;padding:40px 32px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:16px">

              <div style="text-align:center;margin-bottom:28px">
                <div style="font-size:48px;margin-bottom:12px">📖</div>
                <h1 style="font-family:Georgia,serif;color:#2E9E5E;font-size:26px;margin:0 0 8px">
                  @${profile.username}, your record is empty.
                </h1>
                <p style="color:#9CA3AF;font-size:15px;margin:0">
                  You signed up for Flipseer but haven't made your first prediction yet.
                </p>
              </div>

              <div style="background:#0D2B14;border:1px solid #EF4444;border-radius:12px;padding:20px;margin-bottom:20px;text-align:center">
                <p style="color:#EF4444;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 8px">
                  ⚡ WORLD CUP 2026 · ROUND OF 16 · LIVE NOW
                </p>
                <p style="color:white;font-size:17px;font-weight:bold;margin:0 0 6px">
                  Every match without a prediction is a call<br/>your record can never reclaim.
                </p>
                ${hasNation ? `<p style="color:#F59E0B;font-size:14px;margin:0">${flag} ${nationName} needs your predictions to climb the global rankings.</p>` : ''}
              </div>

              <div style="background:#0D2B14;border:1px solid #1A3A1A;border-radius:12px;padding:16px;margin-bottom:20px">
                <p style="color:#6B7280;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 12px">YOUR FIRST PREDICTION TAKES 30 SECONDS</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    { icon: '🎯', text: 'Pick a team to win (or draw)' },
                    { icon: '📊', text: 'Set your confidence level' },
                    { icon: '🔒', text: 'Lock it in before kickoff' },
                    { icon: '⚡', text: 'Your record begins — permanently' },
                  ].map(({ icon, text }) => `
                    <tr>
                      <td style="padding:6px 0;width:32px;font-size:18px;vertical-align:middle">${icon}</td>
                      <td style="padding:6px 0 6px 8px;color:#9CA3AF;font-size:13px;border-bottom:1px solid #1A3A1A;vertical-align:middle">${text}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>

              <a href="https://flipseer.com/predict?utm_source=reengage&utm_medium=email&utm_campaign=zero_predictions"
                style="display:block;background:#1A7A4A;color:white;padding:18px;border-radius:10px;text-align:center;text-decoration:none;font-weight:bold;font-size:17px;margin-bottom:12px;box-shadow:0 0 20px rgba(46,158,94,0.3)">
                ⚽ Make Your First Prediction Now →
              </a>

              <div style="border-top:1px solid #1A3A1A;padding-top:16px;text-align:center;margin-top:20px">
                <p style="color:#4B5563;font-size:11px;margin:0">
                  © 2026 Flipseer · Pure football reputation. No betting. Ever.<br/>
                  <a href="https://flipseer.com" style="color:#2E9E5E;text-decoration:none">flipseer.com</a>
                </p>
              </div>

            </div>
          `,
        })

        // Mark as re-engaged so we don't send again
        await supabase
          .from('profiles')
          .update({ reengage_sent: true })
          .eq('id', profile.id)

        sent++
        results.push({ username: profile.username, status: 'sent' })
      } catch (err: any) {
        results.push({ username: profile.username, status: 'failed', error: err.message })
      }
    }

    return NextResponse.json({ sent, total: profiles.length, results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
