// app/api/h2h/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io'

async function fetchH2H(teamAName: string, teamBName: string) {
  // Step 1: Find API-Football team IDs from your matches table
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Pull recent matches between these teams from Supabase first
  const { data: localMatches } = await supabase
    .from('matches')
    .select('home_team, away_team, home_score, away_score, kickoff, competition, home_team_logo, away_team_logo, api_id')
    .or(
      `and(home_team.eq.${teamAName},away_team.eq.${teamBName}),and(home_team.eq.${teamBName},away_team.eq.${teamAName})`
    )
    .not('home_score', 'is', null)
    .order('kickoff', { ascending: false })
    .limit(10)

  // Get logos from local data
  let teamALogo = ''
  let teamBLogo = ''
  if (localMatches && localMatches.length > 0) {
    for (const m of localMatches) {
      if (m.home_team === teamAName && !teamALogo) teamALogo = m.home_team_logo || ''
      if (m.away_team === teamAName && !teamALogo) teamALogo = m.away_team_logo || ''
      if (m.home_team === teamBName && !teamBLogo) teamBLogo = m.home_team_logo || ''
      if (m.away_team === teamBName && !teamBLogo) teamBLogo = m.away_team_logo || ''
    }
  }

  // Step 2: Try API-Football for H2H — search for team IDs first
  let apiMatches: any[] = []

  try {
    // Search team A
    const searchA = await fetch(
      `${API_FOOTBALL_BASE}/teams?search=${encodeURIComponent(teamAName)}`,
      { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! } }
    )
    const dataA = await searchA.json()
    const teamAId = dataA?.response?.[0]?.team?.id

    const searchB = await fetch(
      `${API_FOOTBALL_BASE}/teams?search=${encodeURIComponent(teamBName)}`,
      { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! } }
    )
    const dataB = await searchB.json()
    const teamBId = dataB?.response?.[0]?.team?.id

    if (teamAId && teamBId) {
      // Update logos from API if missing
      if (!teamALogo) teamALogo = dataA?.response?.[0]?.team?.logo || ''
      if (!teamBLogo) teamBLogo = dataB?.response?.[0]?.team?.logo || ''

      const h2hRes = await fetch(
        `${API_FOOTBALL_BASE}/fixtures/headtohead?h2h=${teamAId}-${teamBId}&last=10`,
        { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! } }
      )
      const h2hData = await h2hRes.json()
      apiMatches = h2hData?.response || []
    }
  } catch (e) {
    // Fall back to local data only
  }

  // Step 3: Merge — prefer API data, fall back to local
  let matches: any[] = []

  if (apiMatches.length > 0) {
    matches = apiMatches
      .filter((f: any) => f.fixture?.status?.short === 'FT')
      .slice(0, 5)
      .map((f: any) => ({
        date: new Date(f.fixture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
        homeTeam: f.teams.home.name,
        awayTeam: f.teams.away.name,
        homeScore: f.goals.home ?? 0,
        awayScore: f.goals.away ?? 0,
        competition: f.league?.name || '',
      }))
    if (!teamALogo) teamALogo = apiMatches[0]?.teams?.home?.name === teamAName ? apiMatches[0]?.teams?.home?.logo : apiMatches[0]?.teams?.away?.logo
    if (!teamBLogo) teamBLogo = apiMatches[0]?.teams?.home?.name === teamBName ? apiMatches[0]?.teams?.home?.logo : apiMatches[0]?.teams?.away?.logo
  } else if (localMatches && localMatches.length > 0) {
    matches = localMatches.slice(0, 5).map((m: any) => ({
      date: new Date(m.kickoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      homeScore: m.home_score ?? 0,
      awayScore: m.away_score ?? 0,
      competition: m.competition || '',
    }))
  }

  // Step 4: Compute W/D/W
  let winsA = 0, winsB = 0, draws = 0
  for (const m of matches) {
    const aIsHome = m.homeTeam === teamAName
    const homeWin = m.homeScore > m.awayScore
    const awayWin = m.awayScore > m.homeScore
    if (homeWin) { aIsHome ? winsA++ : winsB++ }
    else if (awayWin) { aIsHome ? winsB++ : winsA++ }
    else draws++
  }

  const imageUrl = `/api/h2h-image?a=${encodeURIComponent(teamAName)}&b=${encodeURIComponent(teamBName)}&aw=${winsA}&bw=${winsB}&d=${draws}&al=${encodeURIComponent(teamALogo)}&bl=${encodeURIComponent(teamBLogo)}`

  return {
    teamA: { name: teamAName, logo: teamALogo, wins: winsA },
    teamB: { name: teamBName, logo: teamBLogo, wins: winsB },
    draws,
    meetings: matches.length,
    recentMatches: matches,
    imageUrl,
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const teamA = searchParams.get('teamA')
  const teamB = searchParams.get('teamB')

  if (!teamA || !teamB) {
    return NextResponse.json({ error: 'teamA and teamB required' }, { status: 400 })
  }

  if (teamA === teamB) {
    return NextResponse.json({ error: 'Teams must be different' }, { status: 400 })
  }

  try {
    const data = await fetchH2H(teamA, teamB)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch H2H data' }, { status: 500 })
  }
}
