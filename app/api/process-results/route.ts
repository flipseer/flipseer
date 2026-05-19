import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find matches that are locked but not yet processed
    const { data: matches, error } = await supabase
      .from('matches')
      .select('id, home_team, away_team, winner, home_score, away_score')
      .eq('status', 'locked')
      .not('winner', 'is', null) // result is in

    if (error) throw error
    if (!matches?.length) {
      return NextResponse.json({ processed: 0, message: 'No completed matches' })
    }

    const processed = []
    for (const match of matches) {
      // Call our Supabase function
      const { error: fnError } = await supabase.rpc(
        'process_match_results',
        { p_match_id: match.id }
      )
      if (fnError) throw fnError

      // Mark match as completed
      await supabase
        .from('matches')
        .update({ status: 'completed' })
        .eq('id', match.id)

      processed.push(match.id)
    }

    return NextResponse.json({ processed: processed.length, match_ids: processed })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
