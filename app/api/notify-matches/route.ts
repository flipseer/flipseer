import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .gte('kickoff', in2h.toISOString())
      .lte('kickoff', in2h10.toISOString())

    if (!matches?.length) {
      return NextResponse.json({ sent: 0 })
    }

    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, full_name')

    let sent = 0
    for (const match of matches) {
      for (const user of users ?? []) {
        if (!user.email) continue
        sent++
      }
    }

    return NextResponse.json({ sent })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
