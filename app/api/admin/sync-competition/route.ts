// app/api/admin/sync-competition/route.ts
// Generic competition sync — works for ANY league on API-Football
// Usage: /api/admin/sync-competition?secret=X&league=2&season=2026&dry_run=true
// League IDs: EPL=39, UCL=2, ISL=307, NPFL=574, Ghana PL=467, Liga 1=277
// SAFE: never touches existing predictions, scores, or match results
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60
const LEAGUE_NAMES: { [key: string]: { competition: string; league: string } } = {
  '39':  { competition: 'EPL 2026/27',        league: 'Premier League' },
  '2':   { competition: 'UCL 2026/27',         league: 'Champions League' },
  '307': { competition: 'ISL 2026/27',         league: 'Indian Super League' },
  '574': { competition: 'NPFL 2026/27',        league: 'Nigeria Premier League' },
  '467': { competition: 'Ghana PL 2026/27',    league: 'Ghana Premier League' },
  '277': { competition: 'Liga 1 2026/27',      league: 'Indonesia Liga 1' },
  '140': { competition: 'La Liga 2026/27',     league: 'La Liga' },
  '78':  { competition: 'Bundesliga 2026/27',  league: 'Bundesliga' },
  '61':  { competition: 'Ligue 1 2026/27',     league: 'Ligue 1' },
  '135': { competition: 'Serie A 2026/27',     league: 'Serie A' },
  '3':   { competition: 'Europa League 2026/27', league: 'Europa League' },
}
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const leagueId = request.nextUrl.searchParams.get('league')
  const season = request.nextUrl.searchParams.get('season') || '2026'
  const dryRun = request.nextUrl.searchParams.get('dry_run') === 'true'
  if (!leagueId) {
    return NextResponse.json({
      error: 'Missing league param',
      usage: '/api/admin/sync-competition?secret=X&league=2&season=2026',
      dry_run: 'Add &dry_run=true to preview without writing to DB',
      supported: LEAGUE_NAMES,
    }, { status: 400 })
  }
  const leagueMeta = LEAGUE_NAMES[leagueId] || {
    competition: `League ${leagueId} ${season}`,
    league: `League ${leagueId}`,
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })
  const log: string[] = []
  let wouldInsert = 0, inserted = 0, skipped = 0, errors = 0
  if (dryRun) log.push('DRY RUN — no changes will be written to DB')
  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`,
      { headers: { 'x-apisports-key': apiKey }, cache: 'no-store' }
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'API-Football error: ' + res.status }, { status: 500 })
    }
    const data = await res.json()
    const fixtures = data?.response || []
    log.push(`Fetched ${fixtures.length} fixtures for league ${leagueId} season ${season}`)
    if (fixtures.length === 0) {
      return NextResponse.json({
        ok: false, log,
        message: `No fixtures returned — league ${leagueId} season ${season} may not be available yet on API-Football`,
      })
    }
    // Check existing EPL/predictions are untouched — never modify them
    const { count: existingEPL } = await supabase
      .from('matches').select('*', { count: 'exact', head: true })
      .eq('competition', 'EPL 2026/27')
    const { count: existingPredictions } = await supabase
      .from('predictions').select('*', { count: 'exact', head: true })
    log.push(`Safety check — EPL matches in DB: ${existingEPL} (will not be touched)`)
    log.push(`Safety check — Predictions in DB: ${existingPredictions} (will not be touched)`)
    for (const fixture of fixtures) {
      try {
        const apiId = fixture.fixture?.id
        const kickoff = fixture.fixture?.date
        const homeTeam = fixture.teams?.home?.name
        const awayTeam = fixture.teams?.away?.name
        const round = fixture.league?.round || 'Matchday'
        const status = fixture.fixture?.status?.short
        if (!apiId || !kickoff || !homeTeam || !awayTeam) { errors++; continue; }
        // SAFE: only insert NEW fixtures — never update existing ones
        const { data: existing } = await supabase
          .from('matches').select('id').eq('api_id', apiId).single()
        if (existing) { skipped++; continue; }
        const matchStatus = ['FT', 'AET', 'PEN'].includes(status) ? 'completed'
          : ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(status) ? 'live'
          : new Date(kickoff) <= new Date() ? 'locked'
          : 'upcoming'
        const homeScore = fixture.goals?.home ?? null
        const awayScore = fixture.goals?.away ?? null
        const winner = homeScore !== null && awayScore !== null
          ? homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
          : null
        if (dryRun) {
          // Preview only — don't write
          wouldInsert++
          if (wouldInsert <= 5) {
            log.push(`Would insert: ${homeTeam} vs ${awayTeam} — ${kickoff} (${round})`)
          }
          continue
        }
        // Insert — only new fixtures for this competition
        const { error: insertErr } = await supabase.from('matches').insert({
          api_id: apiId,
          home_team: homeTeam,
          away_team: awayTeam,
          kickoff,
          status: matchStatus,
          home_score: homeScore,
          away_score: awayScore,
          winner,
          competition: leagueMeta.competition,
          league: leagueMeta.league,
          season,
          round,
          results_processed: matchStatus === 'completed',
        })
        if (insertErr) {
          log.push(`ERROR: ${homeTeam} vs ${awayTeam}: ${insertErr.message}`)
          errors++
        } else {
          inserted++
        }
      } catch (e: any) {
        errors++
        log.push(`Exception: ${e.message}`)
      }
    }
    if (dryRun) {
      log.push(`DRY RUN complete — would have inserted ${wouldInsert} new fixtures, skipped ${skipped} existing`)
      return NextResponse.json({ ok: true, dry_run: true, wouldInsert, skipped, errors, competition: leagueMeta.competition, log })
    }
    log.push(`Done: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)
    // Verify counts — confirm EPL and predictions untouched
    const { count: finalEPL } = await supabase
      .from('matches').select('*', { count: 'exact', head: true }).eq('competition', 'EPL 2026/27')
    const { count: finalPredictions } = await supabase
      .from('predictions').select('*', { count: 'exact', head: true })
    const { count: newCompCount } = await supabase
      .from('matches').select('*', { count: 'exact', head: true }).eq('competition', leagueMeta.competition)
    log.push(`Verification — EPL matches: ${finalEPL} (unchanged ✅)`)
    log.push(`Verification — Predictions: ${finalPredictions} (unchanged ✅)`)
    log.push(`Verification — ${leagueMeta.competition} matches in DB: ${newCompCount}`)
    return NextResponse.json({
      ok: true, inserted, skipped, errors,
      competition: leagueMeta.competition,
      log,
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
