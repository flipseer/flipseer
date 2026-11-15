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

    // Get recently completed matches
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'completed')
      .gte('kickoff', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (!matches?.length) {
      return NextResponse.json({ awarded: 0, message: 'No recent completed matches' })
    }

    let totalAwarded = 0

    for (const match of matches) {
      // Get all predictions for this match
      const { data: predictions } = await supabase
        .from('predictions')
        .select('*, profiles(username, streak)')
        .eq('match_id', match.id)

      if (!predictions?.length) continue

      // Community split — needed to determine Bold Caller
      const total = predictions.length
      const upsetSideCount = predictions.filter(
        (p: any) => p.predicted_outcome === match.winner
      ).length
      // Bold Caller: called the upset when fewer than 30% of community agreed
      const upsetPct = total > 0 ? upsetSideCount / total : 1

      // Sort by points for Match Hero
      const sorted = [...predictions].sort((a, b) =>
        (b.points_earned ?? 0) - (a.points_earned ?? 0)
      )

      for (const pred of predictions) {
        const badges = []

        // 🎯 Score Master — exact score
        if (
          pred.predicted_home_score === match.home_score &&
          pred.predicted_away_score === match.away_score
        ) {
          badges.push({
            user_id: pred.user_id,
            badge_type: 'score_master',
            badge_label: 'Score Master',
            badge_icon: '🎯',
            match_id: match.id,
          })
        }

        // 👑 Upset King — correct call on an upset match
        if (pred.predicted_outcome === match.winner && match.is_upset) {
          badges.push({
            user_id: pred.user_id,
            badge_type: 'upset_king',
            badge_label: 'Upset King',
            badge_icon: '👑',
            match_id: match.id,
          })
        }

        // 🏆 Match Hero — top 3 points earners
        const rank = sorted.findIndex(p => p.user_id === pred.user_id)
        if (rank < 3 && (pred.points_earned ?? 0) > 0) {
          badges.push({
            user_id: pred.user_id,
            badge_type: 'match_hero',
            badge_label: `Match Hero #${rank + 1}`,
            badge_icon: rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉',
            match_id: match.id,
          })
        }

        // ⚡ Bold Caller — called the upset when <30% of community agreed
        if (
          pred.predicted_outcome === match.winner &&
          match.is_upset &&
          upsetPct < 0.3
        ) {
          badges.push({
            user_id: pred.user_id,
            badge_type: 'bold_caller',
            badge_label: 'Bold Caller',
            badge_icon: '⚡',
            match_id: match.id,
          })
        }

        // Insert badges — ignore duplicates via DB unique constraint
        for (const badge of badges) {
          const { error } = await supabase
            .from('user_badges')
            .insert(badge)
          if (!error) totalAwarded++
        }
      }
    }

    // 🔥 Hot Streak — award ONCE per run, not once per match
    const { data: hotUsers } = await supabase
      .from('profiles')
      .select('id, streak')
      .gte('streak', 5)

    for (const u of hotUsers ?? []) {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: u.id,
          badge_type: `hot_streak_${u.streak}`,
          badge_label: `${u.streak} Match Streak`,
          badge_icon: '🔥',
          match_id: null,
        })
      if (!error) totalAwarded++
    }

    return NextResponse.json({ awarded: totalAwarded })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
