import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Secure: check Vercel cron header OR admin password
  // Vercel automatically adds this header for cron jobs
  const headersList = headers()
  const isVercelCron = headersList.get('x-vercel-cron') === '1'
  const adminPassword = req.nextUrl.searchParams.get('pwd')
  const isAdmin = adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  if (!isVercelCron && !isAdmin) {
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
      { headers: { 'x-apisports-key': apiKey } }
    )
    const data = await res.json()
    const fixtures = data?.response || []
    log.push('API fixtures found: ' + fixtures.length)

    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, api_id')
      .like('api_id::text', '2026%')

    log.push('Fake IDs to fix: ' + (matches?.length || 0))

    let updated = 0
    let notFound: string[] = []

    for (const match of matches || []) {
      const dbHome = match.home_team?.toLowerCase() || ''
      const dbAway = match.away_team?.toLowerCase() || ''

      const fixture = fixtures.find((f: any) => {
        const apiHome = f.teams?.home?.name?.toLowerCase() || ''
        const apiAway = f.teams?.away?.name?.toLowerCase() || ''
        const homeMatch = apiHome.startsWith(dbHome.slice(0, 4)) || dbHome.startsWith(apiHome.slice(0, 4))
        const awayMatch = apiAway.startsWith(dbAway.slice(0, 4)) || dbAway.startsWith(apiAway.slice(0, 4))
        return homeMatch && awayMatch
      })

      if (fixture) {
        const realId = fixture.fixture?.id
        await supabase.from('matches').update({ api_id: realId }).eq('id', match.id)
        log.push('OK: ' + match.home_team + ' vs ' + match.away_team + ' = ' + realId)
        updated++
      } else {
        notFound.push(match.home_team + ' vs ' + match.away_team)
        log.push('NOT FOUND: ' + match.home_team + ' vs ' + match.away_team)
      }
    }

    log.push('DONE! Updated: ' + updated + ' | Not found: ' + notFound.length)
    return NextResponse.json({ ok: true, updated, notFound, log })

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, log }, { status: 500 })
  }
}
