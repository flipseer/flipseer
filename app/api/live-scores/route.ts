import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// In-memory cache for edge runtime (resets per cold start, but effective
// within a warm instance — reduces API-Football hits by ~90% during live matches
// when the homepage polls every 60s across multiple concurrent visitors)
let cachedData: any = null
let cacheExpiry = 0
const CACHE_TTL_MS = 60 * 1000 // 60 seconds — matches frontend poll interval

// Simple in-memory rate limit for edge (per-isolate, not global)
// Prevents a single IP from hammering the endpoint within one edge instance
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT_REQUESTS = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 10 requests per minute per IP

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
    // ── Rate limit by IP ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { live: [], error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'Cache-Control': 'no-store',
          }
        }
      )
    }

    // ── Serve from cache if still fresh ──
    const now = Date.now()
    if (cachedData && now < cacheExpiry) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
          'X-Cache': 'HIT',
        }
      })
    }

    // ── Fetch fresh data from API-Football ──
    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) {
      return NextResponse.json({ live: [] })
    }

    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) {
      // Return stale cache on API error rather than empty response
      if (cachedData) return NextResponse.json(cachedData, {
        headers: { 'X-Cache': 'STALE' }
      })
      return NextResponse.json({ live: [] })
    }

    const data = await res.json()
    const fixtures = data?.response || []

    const WORLD_CUP_2026_IDS = [1]
    const live = fixtures
      .filter((f: any) => {
        const leagueId = f.league?.id
        const season = f.league?.season
        const leagueName: string = f.league?.name || ''
        if (WORLD_CUP_2026_IDS.includes(leagueId) && season === 2026) return true
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

    const response = { live }

    // ── Update cache ──
    cachedData = response
    cacheExpiry = now + CACHE_TTL_MS

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'X-Cache': 'MISS',
      }
    })

  } catch (err) {
    // Return stale cache on any error
    if (cachedData) return NextResponse.json(cachedData, {
      headers: { 'X-Cache': 'STALE-ERROR' }
    })
    return NextResponse.json({ live: [] })
  }
}
