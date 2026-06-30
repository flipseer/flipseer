import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Current leaderboard
    let query = supabase
      .from('profiles')
      .select('id, username, total_points, prediction_count, correct_count, accuracy_pct, rank, rank_icon, country, best_streak, streak, created_at')
      .gt('prediction_count', 0)
      .order('total_points', { ascending: false })
      .limit(50)

    if (country) query = query.eq('country', country)

    const { data: leaders, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Yesterday's snapshot for movement comparison
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const { data: snapshots } = await supabase
      .from('leaderboard_snapshots')
      .select('user_id, rank_position')
      .eq('snapshot_date', yesterday)

    const snapshotMap: Record<string, number> = {}
    ;(snapshots || []).forEach((s: any) => { snapshotMap[s.user_id] = s.rank_position })

    // Exact score counts per user (for Exact Score King badge)
    const { data: exactScores } = await supabase
      .from('predictions')
      .select('user_id')
      .gt('exact_bonus', 0)

    const exactCountMap: Record<string, number> = {}
    ;(exactScores || []).forEach((p: any) => {
      exactCountMap[p.user_id] = (exactCountMap[p.user_id] || 0) + 1
    })

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

    const enriched = (leaders || []).map((leader: any, idx: number) => {
      const currentRank = idx + 1
      const previousRank = snapshotMap[leader.id]
      const isNew = !previousRank && new Date(leader.created_at) > new Date(sevenDaysAgo)

      let movement: 'rising' | 'falling' | 'same' | 'new' = 'same'
      let movementAmount = 0
      if (isNew) {
        movement = 'new'
      } else if (previousRank) {
        if (previousRank > currentRank) { movement = 'rising'; movementAmount = previousRank - currentRank }
        else if (previousRank < currentRank) { movement = 'falling'; movementAmount = currentRank - previousRank }
      }

      return {
        ...leader,
        currentRank,
        movement,
        movementAmount,
        exactScoreCount: exactCountMap[leader.id] || 0,
      }
    })

    // Biggest climber today
    const biggestClimber = enriched
      .filter(l => l.movement === 'rising')
      .sort((a, b) => b.movementAmount - a.movementAmount)[0] || null

    // Longest current streak
    const longestStreak = [...enriched].sort((a, b) => (b.streak || 0) - (a.streak || 0))[0] || null

    // Exact Score King
    const exactScoreKing = [...enriched].sort((a, b) => b.exactScoreCount - a.exactScoreCount)[0] || null

    return NextResponse.json({
      leaders: enriched,
      highlights: {
        biggestClimber: biggestClimber ? { username: biggestClimber.username, amount: biggestClimber.movementAmount } : null,
        longestStreak: longestStreak && longestStreak.streak > 0 ? { username: longestStreak.username, streak: longestStreak.streak } : null,
        exactScoreKing: exactScoreKing && exactScoreKing.exactScoreCount > 0 ? { username: exactScoreKing.username, count: exactScoreKing.exactScoreCount } : null,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
