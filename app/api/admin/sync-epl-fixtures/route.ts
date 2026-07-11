// app/api/admin/sync-epl-fixtures/route.ts
// Syncs all EPL 2026/27 fixtures from API-Football
// Run once manually, then weekly via cron

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

  const log: string[] = []
  let inserted = 0
  let skipped = 0
  let errors = 0

  try {
    // EPL = league 39, season 2026
    const res = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=39&season=2026',
      {
        headers: { 'x-apisports-key': apiKey },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'API-Football error: ' + res.status }, { status: 500 })
    }

    const data = await res.json()
    const fixtures = data?.response || []
    log.push(`Fetched ${fixtures.length} EPL fixtures from API-Football`)

    if (fixtures.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        log, 
        message: 'No EPL fixtures returned — season 2026 may not be available yet on API-Football' 
      })
    }

    for (const fixture of fixtures) {
      try {
        const apiId = fixture.fixture?.id
        const kickoff = fixture.fixture?.date
        const homeTeam = fixture.teams?.home?.name
        const awayTeam = fixture.teams?.away?.name
        const round = fixture.league?.round || 'Matchweek'
        const status = fixture.fixture?.status?.short

        if (!apiId || !kickoff || !homeTeam || !awayTeam) {
          errors++
          continue
        }

        // Map API status to our status
        const matchStatus = ['FT', 'AET', 'PEN'].includes(status) ? 'completed'
          : ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(status) ? 'live'
          : new Date(kickoff) <= new Date() ? 'locked'
          : 'upcoming'

        const homeScore = fixture.goals?.home ?? null
        const awayScore = fixture.goals?.away ?? null
        const winner = homeScore !== null && awayScore !== null
          ? homeScore > awayScore ? 'home'
          : awayScore > homeScore ? 'away'
          : 'draw'
          : null

        // Check if already exists
        const { data: existing } = await supabase
          .from('matches')
          .select('id')
          .eq('api_id', apiId)
          .single()

        if (existing) {
          skipped++
          continue
        }

        // Insert new match
        const { error: insertErr } = await supabase.from('matches').insert({
          api_id: apiId,
          home_team: homeTeam,
          away_team: awayTeam,
          kickoff: kickoff,
          status: matchStatus,
          home_score: homeScore,
          away_score: awayScore,
          winner: winner,
          competition: 'EPL 2026/27',
          league: 'Premier League',
          season: '2026',
          round: round,
          results_processed: matchStatus === 'completed',
        })

        if (insertErr) {
          log.push(`ERROR inserting ${homeTeam} vs ${awayTeam}: ${insertErr.message}`)
          errors++
        } else {
          inserted++
        }
      } catch (e: any) {
        errors++
        log.push(`Exception: ${e.message}`)
      }
    }

    log.push(`Done: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)

    // Verify total EPL matches in DB
    const { count } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('competition', 'EPL 2026/27')

    log.push(`Total EPL matches in DB: ${count}`)

    return NextResponse.json({ ok: true, inserted, skipped, errors, log })

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
