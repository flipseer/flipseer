import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // ── Cache match data at edge (60s) ──
  if (pathname.startsWith('/api/matches')) {
    response.headers.set(
      'Cache-Control',
      's-maxage=60, stale-while-revalidate=30'
    )
  }

  // ── Cache leaderboard at edge (30s) ──
  if (pathname.startsWith('/api/leaderboard')) {
    response.headers.set(
      'Cache-Control',
      's-maxage=30, stale-while-revalidate=15'
    )
  }

  // ── Cache public profiles at edge (2 min) ──
  if (pathname.startsWith('/u/')) {
    response.headers.set(
      'Cache-Control',
      's-maxage=120, stale-while-revalidate=60'
    )
  }

  // ── Cache OG images (1 hour) ──
  if (pathname.startsWith('/api/og')) {
    response.headers.set(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=1800'
    )
  }

  return response
}

export const config = {
  matcher: [
    '/api/matches/:path*',
    '/api/leaderboard/:path*',
    '/api/og/:path*',
    '/u/:path*',
  ]
}
