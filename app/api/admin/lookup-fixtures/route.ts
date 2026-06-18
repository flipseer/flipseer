import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── Fetch all World Cup 2026 fixtures from API-Football ──
  const res = await fetch(
    'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
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

  // ── Get all matches with fake api_ids from DB ──
  const { data: fakeMatches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, api_id, kickoff, status')
    .or('api_id.lt.1400000,api_id.like.2026%')
    .order('kickoff', { ascending: true })

  // ── Try to match each fake match to a real fixture ──
  const fixes: any[] = []
  const unmatched: any[] = []

  for (const match of (fakeMatches || [])) {
    // Normalize team names for comparison
    const normalize = (name: string) => name
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace('democraticrepublicofcongo', 'drcongo')
      .replace('congodr', 'drcongo')
      .replace('drcon', 'drcongo')
      .replace('czechia', 'czech')
      .replace('czechrepublic', 'czech')
      .replace('türkiye', 'turkey')
      .replace('turkiye', 'turkey')
      .replace('cotedivoire', 'ivorycoas')
      .replace('ivorycoast', 'ivorycoas')

    const homeNorm = normalize(match.home_team)
    const awayNorm = normalize(match.away_team)

    // Find matching fixture from API-Football
    const found = fixtures.find((f: any) => {
      const fHome = normalize(f.teams?.home?.name || '')
      const fAway = normalize(f.teams?.away?.name || '')
      return (
        (fHome.includes(homeNorm.slice(0, 5)) || homeNorm.includes(fHome.slice(0, 5))) &&
        (fAway.includes(awayNorm.slice(0, 5)) || awayNorm.includes(fAway.slice(0, 5)))
      )
    })

    if (found) {
      fixes.push({
        match_id: match.id,
        home_team: match.home_team,
        away_team: match.away_team,
        old_api_id: match.api_id,
        real_api_id: found.fixture.id,
        kickoff: match.kickoff,
        status: match.status,
        api_home: found.teams?.home?.name,
        api_away: found.teams?.away?.name,
      })
    } else {
      unmatched.push({
        match_id: match.id,
        home_team: match.home_team,
        away_team: match.away_team,
        old_api_id: match.api_id,
        kickoff: match.kickoff,
      })
    }
  }

  // ── Auto-apply fixes if apply=true param is passed ──
  const apply = req.nextUrl.searchParams.get('apply') === 'true'
  const applied: any[] = []

  if (apply && fixes.length > 0) {
    for (const fix of fixes) {
      const { error } = await supabase
        .from('matches')
        .update({ api_id: fix.real_api_id })
        .eq('id', fix.match_id)

      applied.push({
        ...fix,
        success: !error,
        error: error?.message,
      })
    }
  }

  return NextResponse.json({
    total_fake_ids: fakeMatches?.length || 0,
    total_fixed: fixes.length,
    total_unmatched: unmatched.length,
    fixes: apply ? applied : fixes,
    unmatched,
    note: apply
      ? 'Fixes applied automatically'
      : 'Add ?apply=true to automatically update all matches',
  })
}
