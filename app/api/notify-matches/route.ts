import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendMatchReminder } from '@/lib/emails'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const in2h = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const in2h10 = new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000)

    const { data: matches, error: matchErr } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .gte('kickoff', in2h.toISOString())
      .lte('kickoff', in2h10.toISOString())

    if (matchErr) throw matchErr
    if (!matches?.length) {
      return NextResponse.json({ sent: 0, message: 'No matches in window' })
    }

    const { data: users, error: userErr } = await supabase
      .from('profiles')
      .select('id, email, full_name')

    if (userErr) throw userErr

    let sent = 0
    const errors: string[] = []

    for (const match of matches) {
      for (const user of users ?? []) {
        if (!user.email) continue
        try {
          await sendMatchReminder({
            email: user.email,
            name: user.full_name ?? 'Forecaster',
            homeTeam: match.home_team,
            awayTeam: match.away_team,
            kickoffTime: new Date(match.kickoff).toLocaleString('en-GB', {
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
              timeZone: 'UTC',
            }),
            matchUrl: `https://flipseer.com/predict`,
          })
          sent++
        } catch (e: any) {
          errors.push(`${user.email}: ${e.message}`)
        }
      }
    }

    return NextResponse.json({ sent, matches: matches.length, errors: errors.length ? errors : undefined })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
