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

    const cutoff = new Date(Date.now() + 2 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('matches')
      .update({ status: 'locked' })
      .eq('status', 'upcoming')
      .lte('kickoff', cutoff)
      .select()

    if (error) throw error

    return NextResponse.json({ locked: data?.length ?? 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
