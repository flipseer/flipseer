import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

  const log: string[] = []
  const now = new Date()
  log.push('Cron started: ' + now.toISOString())

  try {
    const windowStart = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    const windowEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString()

    const { data: matches } = await supabase
      .from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, home_score, away_score')
      .in('status', ['upcoming', 'locked', 'live'])
      .gte('kickoff', windowStart)
      .lte('kickoff', windowEnd)

    if (!matches || matches.length === 0) {
      log.push('No matches in window')
      return NextResponse.json({ ok: true, log })
    }

    log.push('Matches in window: ' + matches.length)

    const apiIds = matches.map((m: any) => m.api_id).join('-')
    const liveRes = await fetch(
      'https://v3.football.api-sports.io/fixtures?ids=' + apiIds,
      { headers: { 'x-apisports-key': apiKey } }
    )

    if (!liveRes.ok) {
      log.push('API-Football error: ' + liveRes.status)
      return NextResponse.json({ ok: false, log }, { status: 500 })
    }

    const liveData = await liveRes.json()
    const fixtures = liveData?.response || []
    log.push('Fixtures from API: ' + fixtures.length)

    for (const fixture of fixtures) {
      const apiId = fixture.fixture?.id
      const status = fixture.fixture?.status?.short
      const homeScore = fixture.goals?.home ?? 0
      const awayScore = fixture.goals?.away ?? 0

      const match = matches.find((m: any) => m.api_id === apiId)
      if (!match) continue

      log.push(match.home_team + ' vs ' + match.away_team + ' | status: ' + status)

      // LOCK at kick-off
      if (['1H', 'HT', '2H', 'ET', 'P'].includes(status) && match.status === 'upcoming') {
        await supabase.from('matches').update({ status: 'locked' }).eq('id', match.id)
        log.push('LOCKED: ' + match.home_team + ' vs ' + match.away_team)
      }

      // UPDATE score during match
      if (['1H', 'HT', '2H', 'ET', 'P'].includes(status)) {
        await supabase.from('matches')
          .update({ home_score: homeScore, away_score: awayScore })
          .eq('id', match.id)
        log.push('SCORE: ' + homeScore + '-' + awayScore)
      }

      // SETTLE at full time
      if (['FT', 'AET', 'PEN'].includes(status) && match.status !== 'completed') {
        await supabase.from('matches').update({
          status: 'completed',
          home_score: homeScore,
          away_score: awayScore,
        }).eq('id', match.id)

        log.push('SETTLED: ' + match.home_team + ' ' + homeScore + '-' + awayScore + ' ' + match.away_team)

        // Process results
        const { error: pe } = await supabase.rpc('process_match_results', { p_match_id: match.id })
        if (pe) log.push('PROCESS ERROR: ' + pe.message)
        else log.push('POINTS AWARDED: match ' + match.id)

        // Award badges
        const { error: be } = await supabase.rpc('award_badges', { p_match_id: match.id })
        if (be) log.push('BADGE ERROR: ' + be.message)
        else log.push('BADGES AWARDED: match ' + match.id)

        // Wait 3s then send notifications
        await new Promise(r => setTimeout(r, 3000))
        try {
          const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://flipseer.com'
          const nr = await fetch(origin + '/api/notify-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-cron-secret': process.env.CRON_SECRET || '' },
            body: JSON.stringify({ match_id: match.id }),
          })
          log.push(nr.ok ? 'NOTIFIED: match ' + match.id : 'NOTIFY FAILED: ' + nr.status)
        } catch (e: any) {
          log.push('NOTIFY ERROR: ' + e.message)
        }
      }
    }

    log.push('Cron done: ' + new Date().toISOString())
    return NextResponse.json({ ok: true, log })

  } catch (err: any) {
    log.push('FATAL: ' + err.message)
    return NextResponse.json({ ok: false, log, error: err.message }, { status: 500 })
  }
}
