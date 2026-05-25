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

    // ── FIXED: Only process completed matches not yet processed ──
    const { data: matches, error } = await supabase
      .from('matches')
      .select('id')
      .eq('status', 'completed')
      .not('winner', 'is', null)
      .eq('results_processed', false)

    if (error) throw error

    if (!matches?.length) {
      return NextResponse.json({ processed: 0, message: 'No matches to process' })
    }

    const processed = []
    const failed = []

    for (const match of matches) {
      try {
        const { error: rpcError } = await supabase
          .rpc('process_match_results', { p_match_id: match.id })

        if (rpcError) {
          console.error(`Failed match ${match.id}:`, rpcError.message)
          failed.push({ id: match.id, error: rpcError.message })
        } else {
          processed.push(match.id)
        }
      } catch (err: any) {
        failed.push({ id: match.id, error: err.message })
      }
    }

    return NextResponse.json({
      processed: processed.length,
      failed: failed.length,
      processedIds: processed,
      failedIds: failed,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
