import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Auth
  const cronSecret = req.nextUrl.searchParams.get('secret')
  const authHeader = req.headers.get('authorization')
  const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null
    || req.headers.get('user-agent')?.includes('vercel')
  const isManual = cronSecret === process.env.CRON_SECRET
    || authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Params — defaults to World Cup 2026
  const leagueId = req.nextUrl.searchParams.get('league') || '1'
  const season = req.nextUrl.searchParams.get('season') || '2026'
  const competition = req.nextUrl.searchParams.get('competition') || 'World Cup 2026'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const apiKey = process.env.API_FOOTBALL_KEY!
  const log: string[] = []

  try {
    log.push(`Fetching league=${leagueId} season=${season} from API-Football...`)

    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`,
      {
        headers: { 'x-apisports-key': apiKey },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: `API error: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()
    const fixtures = data?.response || []
    log.push(`API returned ${fixtures.length} fixtures`)

    if (fixtures.length === 0) {
      return NextResponse.json({ ok: true, log, inserted: 0, updated: 0 })
    }

    // Get existing matches for this competition
    const { data: existing } = await supabase
      .from('matches')
      .select('id, api_id, kickoff, status')
      .eq('competition', competition)

    const existingByApiId = new Map(
      (existing || []).map((m: any) => [String(m.api_id), m])
    )

    log.push(`Found ${existing?.length || 0} existing matches in DB`)

    let inserted = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    for (const f of fixtures) {
      const apiId = String(f.fixture?.id)
      const homeTeam = f.teams?.home?.name || 'TBD'
      const awayTeam = f.teams?.away?.name || 'TBD'
      const kickoffUtc = f.fixture?.date
        ? new Date(f.fixture.date).toISOString().replace('T', ' ').replace('Z', '')
        : null
      const fixtureStatus = f.fixture?.status?.short || 'NS'
      const round = f.league?.round || ''
      const leagueName = f.league?.name || competition

      // Map API status to our status
      const statusMap: { [key: string]: string } = {
        'NS': 'upcoming',
        'TBD': 'upcoming',
        '1H': 'live',
        '2H': 'live',
        'HT': 'live',
        'ET': 'live',
        'P': 'live',
        'FT': 'completed',
        'AET': 'completed',
        'PEN': 'completed',
        'CANC': 'cancelled',
        'PST': 'upcoming',
      }
      const dbStatus = statusMap[fixtureStatus] || 'upcoming'

      // Skip TBD fixtures (knockout teams not yet determined)
      if (homeTeam === 'TBD' && awayTeam === 'TBD') {
        skipped++
        continue
      }

      const existing = existingByApiId.get(apiId)

      if (existing) {
        // Update kickoff time if changed + status if completed
        const needsUpdate = existing.kickoff !== kickoffUtc ||
          (dbStatus === 'completed' && existing.status !== 'completed')

        if (needsUpdate) {
          const updateData: any = { kickoff: kickoffUtc }
          if (dbStatus === 'completed') {
            updateData.status = 'completed'
            updateData.home_score = f.goals?.home ?? null
            updateData.away_score = f.goals?.away ?? null
            // Determine winner
            if (f.goals?.home > f.goals?.away) updateData.winner = 'home'
            else if (f.goals?.away > f.goals?.home) updateData.winner = 'away'
            else if (f.goals?.home === f.goals?.away) updateData.winner = 'draw'
          }
          const { error } = await supabase
            .from('matches')
            .update(updateData)
            .eq('api_id', apiId)

          if (error) errors.push(`Update ${homeTeam} vs ${awayTeam}: ${error.message}`)
          else { updated++; log.push(`Updated: ${homeTeam} vs ${awayTeam}`) }
        } else {
          skipped++
        }
      } else {
        // Insert new match
        const { error } = await supabase
          .from('matches')
          .insert({
            api_id: parseInt(apiId),
            home_team: homeTeam,
            away_team: awayTeam,
            kickoff: kickoffUtc,
            status: dbStatus,
            league: leagueName,
            competition: competition,
            season: season,
            home_score: dbStatus === 'completed' ? (f.goals?.home ?? null) : null,
            away_score: dbStatus === 'completed' ? (f.goals?.away ?? null) : null,
            winner: dbStatus === 'completed'
              ? (f.goals?.home > f.goals?.away ? 'home'
                : f.goals?.away > f.goals?.home ? 'away' : 'draw')
              : null,
          })

        if (error) errors.push(`Insert ${homeTeam} vs ${awayTeam}: ${error.message}`)
        else { inserted++; log.push(`Inserted: ${homeTeam} vs ${awayTeam} (${round})`) }
      }
    }

    log.push(`DONE: inserted=${inserted} updated=${updated} skipped=${skipped}`)

    return NextResponse.json({
      ok: true,
      competition,
      league: leagueId,
      season,
      total_fixtures: fixtures.length,
      inserted,
      updated,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      log,
    })

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
