import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const cronSecret = req.nextUrl.searchParams.get('secret')
  const authHeader = req.headers.get('authorization')

  const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null
    || req.headers.get('user-agent')?.includes('vercel')
  const isManual = cronSecret === process.env.CRON_SECRET
    || authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const apiKey = process.env.API_FOOTBALL_KEY!
  const log: string[] = []

  try {
    log.push('Fetching WC2026 fixtures from API-Football...')
    const res = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      {
        headers: { 'x-apisports-key': apiKey },
        cache: 'no-store',
      }
    )
    const data = await res.json()
    const fixtures = data?.response || []
    log.push('API fixtures found: ' + fixtures.length)

    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, api_id')

    // Fix fake IDs — both 2026xxx pattern and numbers < 1400000
    const fakeMatches = (matches || []).filter((m: any) =>
      String(m.api_id).startsWith('2026') || Number(m.api_id) < 1400000
    )
    log.push('Fake IDs to fix: ' + fakeMatches.length)

    // Log all API team names for debugging
    const apiTeamPairs = fixtures.map((f: any) =>
      f.teams?.home?.name + ' vs ' + f.teams?.away?.name
    )
    log.push('Sample API teams: ' + apiTeamPairs.slice(0, 10).join(' | '))

    let updated = 0
    let notFound: string[] = []

    for (const match of fakeMatches) {
      const dbHome = match.home_team?.toLowerCase().trim() || ''
      const dbAway = match.away_team?.toLowerCase().trim() || ''

      // Enhanced matching — try multiple strategies
      const fixture = fixtures.find((f: any) => {
        const apiHome = f.teams?.home?.name?.toLowerCase().trim() || ''
        const apiAway = f.teams?.away?.name?.toLowerCase().trim() || ''

        // Strategy 1: exact match
        if (apiHome === dbHome && apiAway === dbAway) return true

        // Strategy 2: contains match (handles "DR Congo" vs "Congo DR")
        const homeMatch = apiHome.includes(dbHome) || dbHome.includes(apiHome) ||
          apiHome.replace(/\s/g, '').includes(dbHome.replace(/\s/g, '').slice(0, 5)) ||
          dbHome.replace(/\s/g, '').includes(apiHome.replace(/\s/g, '').slice(0, 5))

        const awayMatch = apiAway.includes(dbAway) || dbAway.includes(apiAway) ||
          apiAway.replace(/\s/g, '').includes(dbAway.replace(/\s/g, '').slice(0, 5)) ||
          dbAway.replace(/\s/g, '').includes(apiAway.replace(/\s/g, '').slice(0, 5))

        return homeMatch && awayMatch
      })

      if (fixture) {
        const realId = fixture.fixture?.id
        await supabase.from('matches').update({ api_id: realId }).eq('id', match.id)
        log.push('OK: ' + match.home_team + ' vs ' + match.away_team + ' → ' + realId +
          ' (API: ' + fixture.teams?.home?.name + ' vs ' + fixture.teams?.away?.name + ')')
        updated++
      } else {
        notFound.push(match.home_team + ' vs ' + match.away_team)
        log.push('NOT FOUND: ' + match.home_team + ' vs ' + match.away_team +
          ' (db: "' + dbHome + '" vs "' + dbAway + '")')
      }
    }

    log.push('DONE! Updated: ' + updated + ' | Not found: ' + notFound.length)
    return NextResponse.json({ ok: true, updated, notFound, log })

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
