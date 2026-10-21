import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ live: [] }, { status: 429 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: matches } = await supabase
    .from('matches')
    .select('id, api_id, home_team, away_team, home_score, away_score, status, competition, kickoff')
    .in('status', ['live', 'locked'])

  const live = (matches || []).map((m: any) => ({
    id: m.api_id,
    api_id: m.api_id,
    status: m.status === 'live' ? '1H' : 'NS',
    elapsed: null,
    home: m.home_team,
    away: m.away_team,
    home_score: m.home_score ?? 0,
    away_score: m.away_score ?? 0,
    competition: m.competition,
  }))

  return NextResponse.json({ live }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
