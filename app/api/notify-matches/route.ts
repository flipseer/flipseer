import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = request.headers.get('x-vercel-cron-signature') !== null
      || request.headers.get('user-agent')?.includes('vercel')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Find matches kicking off in ~2 hours ──
    const in2h = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const in2h10 = new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000)

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .gte('kickoff', in2h.toISOString())
      .lte('kickoff', in2h10.toISOString())

    if (!matches?.length) {
      return NextResponse.json({ sent: 0, message: 'No matches in window' })
    }

    // ── Get all users ──
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError

    // ── Fetch ALL profiles in ONE query instead of N+1 ──
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')

    // Build lookup map for O(1) access
    const profileMap = new Map(
      profiles?.map(p => [p.id, p.username]) ?? []
    )

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    let sent = 0
    const errors: string[] = []

    for (const match of matches) {
      // ── Send in batches of 50 to avoid rate limits ──
      const userBatches = []
      const validUsers = (users ?? []).filter(u => u.email)

      for (let i = 0; i < validUsers.length; i += 50) {
        userBatches.push(validUsers.slice(i, i + 50))
      }

      for (const batch of userBatches) {
        await Promise.all(batch.map(async (user) => {
          try {
            const username = profileMap.get(user.id) || 'Forecaster'

            await resend.emails.send({
              from: 'Flipseer <noreply@flipseer.com>',
              to: user.email!,
              subject: `⚽ ${match.home_team} vs ${match.away_team} — 2 hours to predict!`,
              html: `
                <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
                  <div style="text-align:center;margin-bottom:24px;">
                    <h1 style="color:#2E9E5E;font-family:Georgia,serif;margin:0">⚽ Flipseer</h1>
                  </div>
                  <p style="color:#9CA3AF;">Hi @${username},</p>
                  <h2 style="color:white;font-family:Georgia,serif;">${match.home_team} vs ${match.away_team}</h2>
                  <div style="background:#0D2B14;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
                    <p style="color:#F59E0B;font-weight:bold;margin:0;">⏱ Predictions close in 2 hours!</p>
                  </div>
                  <p style="color:#9CA3AF;font-size:14px;">Once the match kicks off, predictions are locked forever. Don't miss your chance to call it.</p>
                  <a href="https://flipseer.com/predict" 
                     style="display:block;background:#1A7A4A;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin-top:20px;">
                    Lock In My Prediction →
                  </a>
                  <p style="color:#4B5563;font-size:11px;text-align:center;margin-top:24px;">
                    © 2026 Flipseer · Pure football reputation. No betting. Ever.
                  </p>
                </div>
              `,
            })
            sent++
          } catch (err: any) {
            errors.push(`${user.email}: ${err.message}`)
          }
        }))

        // ── Small delay between batches to avoid rate limits ──
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    return NextResponse.json({ 
      sent,
      errors: errors.length > 0 ? errors : undefined,
      message: `✅ Sent ${sent} notifications`
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
