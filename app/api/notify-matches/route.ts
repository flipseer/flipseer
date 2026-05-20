import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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

    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, full_name')

    let sent = 0
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    for (const match of matches) {
      for (const user of users ?? []) {
        if (!user.email) continue
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: user.email,
          subject: `⚽ ${match.home_team} vs ${match.away_team} — 2 hours to predict!`,
          html: `
            <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
              <h1 style="color:#2E9E5E;">⚽ Flipseer</h1>
              <p>Hi ${user.full_name ?? 'Forecaster'},</p>
              <h2>${match.home_team} vs ${match.away_team}</h2>
              <p style="color:#F59E0B;">⏱ Predictions close in 2 hours!</p>
              <a href="https://flipseer.com/predict" style="display:block;background:#1A7A4A;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;">
                Lock In My Prediction →
              </a>
            </div>
          `,
        })
        sent++
      }
    }

    return NextResponse.json({ sent })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
