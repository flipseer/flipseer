import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) {
      return NextResponse.json({ live: [] })
    }

    // FIFA World Cup 2026 league ID = 1 is wrong
    // World Cup = league 1 in API-Football v3
    // But safer to fetch ALL live and filter by name
    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ live: [] })
    }

    const data = await res.json()
    const fixtures = data?.response || []

    // Filter only World Cup 2026 matches
    const live = fixtures
      .filter((f: any) => {
        const leagueName = f.league?.name || ''
        return leagueName.includes('World Cup') || leagueName.includes('FIFA')
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
