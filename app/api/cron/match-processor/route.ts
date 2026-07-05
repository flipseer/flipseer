import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret')
  const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null
    || req.headers.get('user-agent')?.includes('vercel')

  if (secret !== process.env.CRON_SECRET && !isVercelCron) {
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
    const windowStart = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    const windowEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString()

    const { data: windowMatches } = await supabase
      .from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, home_score, away_score')
      .in('status', ['upcoming', 'locked', 'live'])
      .gte('kickoff', windowStart)
      .lte('kickoff', windowEnd)

    const { data: stuckMatches } = await supabase
      .from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, home_score, away_score')
      .in('status', ['locked', 'live'])
      .lt('kickoff', windowStart)

    const allMatches = [...(windowMatches || []), ...(stuckMatches || [])]
    const seen = new Set<number>()
    const matches = allMatches.filter((m: any) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })

    if (matches.length === 0) {
      log.push('No matches to process')
      return NextResponse.json({ ok: true, log })
    }

    log.push('Matches to process: ' + matches.length + ' (window: ' + (windowMatches?.length || 0) + ', stuck: ' + (stuckMatches?.length || 0) + ')')

    const BATCH_SIZE = 20
    const fixtures: any[] = []

    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
      const batch = matches.slice(i, i + BATCH_SIZE)
      const apiIds = batch.map((m: any) => m.api_id).join('-')
      const res = await fetch(
        'https://v3.football.api-sports.io/fixtures?ids=' + apiIds,
        { headers: { 'x-apisports-key': apiKey }, cache: 'no-store' }
      )
      if (!res.ok) {
        log.push('API-Football error: ' + res.status)
        continue
      }
      const data = await res.json()
      fixtures.push(...(data?.response || []))
    }

    log.push('Fixtures from API: ' + fixtures.length)

    for (const fixture of fixtures) {
      const apiId = fixture.fixture?.id
      const status = fixture.fixture?.status?.short
      const homeScore = fixture.goals?.home ?? 0
      const awayScore = fixture.goals?.away ?? 0

      const match = matches.find((m: any) => m.api_id === apiId)
      if (!match) continue

      log.push(match.home_team + ' vs ' + match.away_team + ' | API status: ' + status + ' | DB status: ' + match.status)

      const kickoffTime = new Date(
        match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z'
      ).getTime()

      const isInPlay = ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(status)
      const isFinished = ['FT', 'AET', 'PEN'].includes(status)
      const isAbandoned = ['CANC', 'ABD', 'AWD', 'WO'].includes(status)
      const isPastKickoff = now.getTime() >= kickoffTime

      if ((isInPlay || isPastKickoff) && match.status === 'upcoming') {
        await supabase.from('matches').update({ status: 'locked' }).eq('id', match.id)
        log.push('LOCKED: ' + match.home_team + ' vs ' + match.away_team)
        match.status = 'locked'
      }

      if (isInPlay) {
        await supabase.from('matches')
          .update({ status: 'live', home_score: homeScore, away_score: awayScore })
          .eq('id', match.id)
        log.push('LIVE SCORE: ' + homeScore + '-' + awayScore)
        match.status = 'live'
      }

      if (isFinished && match.status !== 'completed') {
        const { error: updateErr } = await supabase.from('matches').update({
          status: 'completed',
          home_score: homeScore,
          away_score: awayScore,
        }).eq('id', match.id)

        if (updateErr) {
          log.push('UPDATE ERROR: ' + updateErr.message)
          continue
        }

        log.push('SETTLED: ' + match.home_team + ' ' + homeScore + '-' + awayScore + ' ' + match.away_team)

        // Auto-detect upset: winner picked by <40% of predictors
        const winner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
        const { data: preds } = await supabase
          .from('predictions')
          .select('predicted_outcome')
          .eq('match_id', match.id)

        if (preds && preds.length >= 2) {
          const winnerPicks = preds.filter((p: any) => p.predicted_outcome === winner).length
          const winnerPct = winnerPicks / preds.length
          if (winnerPct < 0.4) {
            await supabase.from('matches').update({ is_upset: true, winner }).eq('id', match.id)
            log.push('UPSET DETECTED: ' + match.home_team + ' vs ' + match.away_team + ' (' + Math.round(winnerPct * 100) + '% picked winner)')
          } else {
            await supabase.from('matches').update({ winner }).eq('id', match.id)
          }
        } else {
          await supabase.from('matches').update({ winner }).eq('id', match.id)
        }

        const { error: pe } = await supabase.rpc('process_match_results', { p_match_id: match.id })
        if (pe) log.push('PROCESS ERROR: ' + pe.message)
        else log.push('POINTS AWARDED: match ' + match.id)

        const { error: be } = await supabase.rpc('award_badges', { p_match_id: match.id })
        if (be) log.push('BADGE ERROR: ' + be.message)
        else log.push('BADGES AWARDED: match ' + match.id)

        await new Promise(r => setTimeout(r, 3000))
        try {
          const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://flipseer.com'
          const nr = await fetch(origin + '/api/notify-result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-cron-secret': process.env.CRON_SECRET || '',
            },
            body: JSON.stringify({ match_id: match.id }),
          })
          log.push(nr.ok ? 'NOTIFIED: match ' + match.id : 'NOTIFY FAILED: ' + nr.status)
        } catch (e: any) {
          log.push('NOTIFY ERROR: ' + e.message)
        }
      }

      if (isAbandoned && match.status !== 'completed') {
        await supabase.from('matches')
          .update({ status: 'cancelled' })
          .eq('id', match.id)
        log.push('CANCELLED: ' + match.home_team + ' vs ' + match.away_team + ' (' + status + ')')
      }
    }

    log.push('Cron done: ' + new Date().toISOString())
    return NextResponse.json({ ok: true, log })

  } catch (err: any) {
    log.push('FATAL: ' + err.message)
    return NextResponse.json({ ok: false, log, error: err.message }, { status: 500 })
  }
}
