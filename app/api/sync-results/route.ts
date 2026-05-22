import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    // ── Auth check ──
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Get matches that need result sync ──
    // Matches that kicked off in last 3 hours but aren't completed yet
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['locked', 'upcoming'])
      .lte('kickoff', now)
      .gte('kickoff', threeHoursAgo)

    if (matchError) throw matchError

    if (!matches?.length) {
      return NextResponse.json({ synced: 0, message: 'No matches to sync' })
    }

    console.log(`🔄 Syncing results for ${matches.length} matches...`)

    let synced = 0
    let errors = []

    for (const match of matches) {
      try {
        if (!match.api_id) continue

        // ── Fetch result from API-Football ──
        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?id=${match.api_id}`,
          {
            headers: {
              'x-apisports-key': process.env.API_FOOTBALL_KEY!,
            },
          }
        )

        const json = await response.json()
        const fixture = json.response?.[0]

        if (!fixture) continue

        const status = fixture.fixture.status.short
        const goals = fixture.goals

        // Only update if match is finished
        const finishedStatuses = ['FT', 'AET', 'PEN', 'AWD', 'WO']
        if (!finishedStatuses.includes(status)) continue

        const homeScore = goals.home ?? 0
        const awayScore = goals.away ?? 0
        const teams = fixture.teams

        // Determine winner
        let winner = 'draw'
        if (homeScore > awayScore) winner = teams.home.name
        else if (awayScore > homeScore) winner = teams.away.name

        // Determine if upset (away win or draw when home was favorite)
        // Simple heuristic: away win = potential upset
        const isUpset = awayScore > homeScore

        // ── Update match in Supabase ──
        const { error: updateError } = await supabase
          .from('matches')
          .update({
            home_score: homeScore,
            away_score: awayScore,
            winner,
            is_upset: isUpset,
            status: 'completed',
          })
          .eq('id', match.id)

        if (updateError) {
          errors.push(`Match ${match.id}: ${updateError.message}`)
          continue
        }

        console.log(`✅ Synced: ${match.home_team} ${homeScore}-${awayScore} ${match.away_team}`)
        synced++

        // ── Trigger result processing ──
        await supabase.rpc('process_match_results', { p_match_id: match.id })

      } catch (err: any) {
        errors.push(`Match ${match.api_id}: ${err.message}`)
      }
    }

    return NextResponse.json({
      synced,
      total: matches.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `✅ Synced ${synced}/${matches.length} match results`
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
