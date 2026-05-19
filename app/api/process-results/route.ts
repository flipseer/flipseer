import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: matches, error } = await supabase
      .from('matches')
      .select('id')
      .eq('status', 'locked')
      .not('winner', 'is', null)

    if (error) throw error
    if (!matches?.length) {
      return NextResponse.json({ processed: 0 })
    }

    const processed = []
    for (const match of matches) {
      await supabase.rpc('process_match_results', { p_match_id: match.id })
      await supabase.from('matches').update({ status: 'completed' }).eq('id', match.id)
      processed.push(match.id)
    }

    return NextResponse.json({ processed: processed.length })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
