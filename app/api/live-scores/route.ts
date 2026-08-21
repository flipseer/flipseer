import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

let cachedData: any = null
let cacheExpiry = 0
const CACHE_TTL_MS = 60 * 1000

const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT_REQUESTS = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_REQUESTS) return false
  entry.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { live: [], error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } }
      )
    }

    const now = Date.now()
    if (cachedData && now < cacheExpiry) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
          'X-Cache': 'HIT',
        }
      })
    }

    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) return NextResponse.json({ live: [] })

    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) {
      if (cachedData) return NextResponse.json(cachedData, { headers: { 'X-Cache': 'STALE' } })
      return NextResponse.json({ live: [] })
    }

    const data = await res.json()
    const fixtures = data?.response || []

    // ── Active competitions on Flipseer ──
    // EPL = league 39, season 2026
    // UCL = league 2, season 2026 (group stage Sep 17+)
    // World Cup = league 1, season 2026 (completed but keep for safety)
    const ACTIVE_LEAGUES = [
      { id: 39, season: 2026, name: 'EPL 2026/27' },       // Premier League
      { id: 2,  season: 2026, name: 'UCL 2026/27' },       // Champions League
      { id: 1,  season: 2026, name: 'World Cup 2026' },    // World Cup (completed)
    ]

    const live = fixtures
      .filter((f: any) => {
        const leagueId = f.league?.id
        const season = f.league?.season
        // Match against active league IDs
        return ACTIVE_LEAGUES.some(l => l.id === leagueId && l.season === season)
      })
      .map((f: any) => ({
        id: f.fixture?.id,
        api_id: f.fixture?.id,
        status: f.fixture?.status?.short,
        elapsed: f.fixture?.status?.elapsed,
        home: f.teams?.home?.name,
        away: f.teams?.away?.name,
        home_score: f.goals?.home ?? 0,
        away_score: f.goals?.away ?? 0,
        league: f.league?.name,
        round: f.league?.round,
        competition: ACTIVE_LEAGUES.find(l => l.id === f.league?.id)?.name || f.league?.name,
      }))

    const response = { live }
    cachedData = response
    cacheExpiry = now + CACHE_TTL_MS

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'X-Cache': 'MISS',
      }
    })
  } catch (err) {
    if (cachedData) return NextResponse.json(cachedData, { headers: { 'X-Cache': 'STALE-ERROR' } })
    return NextResponse.json({ live: [] })
  }
}
