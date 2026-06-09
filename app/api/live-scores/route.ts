import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) {
      return NextResponse.json({ live: [] })
    }

    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ live: [] })
    }

    const data = await res.json()
    const fixtures = data?.response || []

    // Strict filter: FIFA World Cup 2026 mens only
    // League ID 1 = FIFA World Cup (mens)
    // Exclude womens (league 6), youth, friendlies
    const WORLD_CUP_2026_IDS = [1] // FIFA World Cup mens

    const live = fixtures
      .filter((f: any) => {
        const leagueId = f.league?.id
        const season = f.league?.season
        const leagueName: string = f.league?.name || ''

        // Primary: match by league ID + season
        if (WORLD_CUP_2026_IDS.includes(leagueId) && season === 2026) return true

        // Fallback: name match but strict -- must have 2026 and not Women
        if (
          leagueName.includes('2026') &&
          (leagueName.includes('World Cup') || leagueName.includes('FIFA')) &&
          !leagueName.toLowerCase().includes('women') &&
          !leagueName.toLowerCase().includes('u20') &&
          !leagueName.toLowerCase().includes('u17') &&
          !leagueName.toLowerCase().includes('youth') &&
          !leagueName.toLowerCase().includes('friendly')
        ) return true

        return false
      })
      .map((f: any) => ({
        id: f.fixture?.id,
        status: f.fixture?.status?.short,
        elapsed: f.fixture?.status?.elapsed,
        home: f.teams?.home?.name,
        away: f.teams?.away?.name,
        home_score: f.goals?.home ?? 0,
        away_score: f.goals?.away ?? 0,
        league: f.league?.name,
        round: f.league?.round,
      }))

    return NextResponse.json({ live }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (err) {
    return NextResponse.json({ live: [] })
  }
}
