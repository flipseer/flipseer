import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

const COMP_EMOJI: { [k: string]: string } = {
  'EPL 2026/27': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UCL 2026/27': '⭐',
  'Liga 1 2026/27': '🇮🇩',
  'Ghana PL 2026/27': '🇬🇭',
  'ISL 2026/27': '🇮🇳',
}

const COMP_SHORT: { [k: string]: string } = {
  'EPL 2026/27': 'EPL',
  'UCL 2026/27': 'UCL',
  'Liga 1 2026/27': 'Liga 1',
  'Ghana PL 2026/27': 'Ghana PL',
  'ISL 2026/27': 'ISL',
}

function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function sendTelegram(text: string, botToken: string) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '@flipseer',
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    )
    const data = await res.json()
    return data.ok === true
  } catch (e) {
    return false
  }
}

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

  const botToken = process.env.TELEGRAM_BOT_TOKEN || ''

  const log: string[] = []
  const now = new Date()
  log.push('Cron started: ' + now.toISOString())

  try {
    const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const windowEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString()

    const { data: windowMatches } = await supabase
      .from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, home_score, away_score, competition, tg_kickoff_posted, tg_halftime_posted, tg_last_home_score, tg_last_away_score')
      .in('status', ['upcoming', 'locked', 'live'])
      .gte('kickoff', windowStart)
      .lte('kickoff', windowEnd)

    const stuckCutoff = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    const { data: stuckMatches } = await supabase
      .from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, home_score, away_score, competition, tg_kickoff_posted, tg_halftime_posted, tg_last_home_score, tg_last_away_score')
      .in('status', ['locked', 'live', 'upcoming'])
      .lt('kickoff', stuckCutoff)

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

    log.push('Matches to process: ' + matches.length)

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
      const elapsed = fixture.fixture?.status?.elapsed || 0
      const homeScore = fixture.goals?.home ?? 0
      const awayScore = fixture.goals?.away ?? 0
      const events: any[] = fixture.events || []

      const match = matches.find((m: any) => m.api_id === apiId)
      if (!match) continue

      log.push(match.home_team + ' vs ' + match.away_team + ' | API: ' + status + ' | DB: ' + match.status)

      const kickoffTime = new Date(
        match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z'
      ).getTime()

      const isInPlay = ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(status)
      const isFinished = ['FT', 'AET', 'PEN'].includes(status)
      const isAbandoned = ['CANC', 'ABD', 'AWD', 'WO'].includes(status)
      const isHalftime = status === 'HT'
      const isPastKickoff = now.getTime() >= kickoffTime

      const flag = COMP_EMOJI[match.competition] || '⚽'
      const comp = COMP_SHORT[match.competition] || match.competition
      const slug = slugify(match.home_team) + '-vs-' + slugify(match.away_team)
      const url = `https://flipseer.com/matches/${slug}`

      // ── LOCK upcoming → locked ──
      if ((isInPlay || isPastKickoff) && match.status === 'upcoming') {
        await supabase.from('matches').update({ status: 'locked' }).eq('id', match.id)
        log.push('LOCKED: ' + match.home_team + ' vs ' + match.away_team)
        match.status = 'locked'
      }

      // ── KICK-OFF ALERT ──
      if (isInPlay && !match.tg_kickoff_posted) {
        const { data: preds } = await supabase
          .from('predictions')
          .select('predicted_outcome')
          .eq('match_id', match.id)

        const total = preds?.length || 0
        let homeW = 0, draw = 0, awayW = 0
        ;(preds || []).forEach((p: any) => {
          if (p.predicted_outcome === 'home') homeW++
          else if (p.predicted_outcome === 'draw') draw++
          else if (p.predicted_outcome === 'away') awayW++
        })
        const homePct = total > 0 ? Math.round((homeW / total) * 100) : 0
        const drawPct = total > 0 ? Math.round((draw / total) * 100) : 0
        const awayPct = total > 0 ? Math.round((awayW / total) * 100) : 0

        let predLine = total > 0
          ? `\n\n🔮 <b>Community split</b> (${total} forecasters)\n🏠 ${match.home_team} — <b>${homePct}%</b>  🤝 Draw — <b>${drawPct}%</b>  ✈️ ${match.away_team} — <b>${awayPct}%</b>`
          : ''

        const text =
          `${flag} <b>KICK OFF · ${comp}</b>\n\n` +
          `⚽ <b>${match.home_team} vs ${match.away_team}</b>\n` +
          `🟢 The match has started!${predLine}\n\n` +
          `👉 Watch live → ${url}`

        const ok = await sendTelegram(text, botToken)
        if (ok) {
          await supabase.from('matches').update({ tg_kickoff_posted: true }).eq('id', match.id)
          match.tg_kickoff_posted = true
          log.push('TG KICKOFF: ' + match.home_team + ' vs ' + match.away_team)
        }
      }

      // ── LIVE SCORE UPDATE ──
      if (isInPlay) {
        const prevHome = match.tg_last_home_score ?? match.home_score ?? 0
        const prevAway = match.tg_last_away_score ?? match.away_score ?? 0

        await supabase.from('matches')
          .update({ status: 'live', home_score: homeScore, away_score: awayScore })
          .eq('id', match.id)
        log.push('LIVE SCORE: ' + homeScore + '-' + awayScore)
        match.status = 'live'

        // ── GOAL ALERT — score changed ──
        if (homeScore !== prevHome || awayScore !== prevAway) {
          // Find the latest goal event
          const goalEvents = events.filter((e: any) =>
            e.type === 'Goal' && e.detail !== 'Missed Penalty'
          )
          const latestGoal = goalEvents[goalEvents.length - 1]

          let goalLine = ''
          if (latestGoal) {
            const scorer = latestGoal.player?.name?.split(' ').pop() || ''
            const assist = latestGoal.assist?.name?.split(' ').pop() || ''
            const team = latestGoal.team?.name || ''
            const min = latestGoal.time?.elapsed || elapsed
            const isPenalty = latestGoal.detail === 'Penalty'
            const isOwnGoal = latestGoal.detail === 'Own Goal'

            if (isPenalty) goalLine = `⚽ <b>GOAL! ${scorer} (pen) — ${team} · ${min}'</b>`
            else if (isOwnGoal) goalLine = `⚽ <b>OWN GOAL! ${scorer} — ${team} · ${min}'</b>`
            else goalLine = `⚽ <b>GOAL! ${scorer}${assist ? ' (assist: ' + assist + ')' : ''} — ${team} · ${min}'</b>`
          } else {
            goalLine = `⚽ <b>GOAL!</b>`
          }

          const text =
            `${flag} <b>${comp}</b>\n\n` +
            `${goalLine}\n\n` +
            `🏟 <b>${match.home_team} ${homeScore} – ${awayScore} ${match.away_team}</b>\n\n` +
            `👉 Live → ${url}`

          const ok = await sendTelegram(text, botToken)
          if (ok) {
            await supabase.from('matches')
              .update({ tg_last_home_score: homeScore, tg_last_away_score: awayScore })
              .eq('id', match.id)
            match.tg_last_home_score = homeScore
            match.tg_last_away_score = awayScore
            log.push('TG GOAL: ' + homeScore + '-' + awayScore + ' ' + match.home_team + ' vs ' + match.away_team)
          }
        }
      }

      // ── HALF-TIME ALERT ──
      if (isHalftime && !match.tg_halftime_posted) {
        const text =
          `${flag} <b>HALF TIME · ${comp}</b>\n\n` +
          `⚽ <b>${match.home_team} ${homeScore} – ${awayScore} ${match.away_team}</b>\n\n` +
          `👉 See predictions → ${url}`

        const ok = await sendTelegram(text, botToken)
        if (ok) {
          await supabase.from('matches').update({ tg_halftime_posted: true }).eq('id', match.id)
          match.tg_halftime_posted = true
          log.push('TG HALFTIME: ' + match.home_team + ' vs ' + match.away_team)
        }
      }

      // ── FULL TIME — settle match ──
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

        try {
          const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://flipseer.com'
          const ap = await fetch(origin + '/api/cron/auto-post?match_id=' + match.id, {
            method: 'GET',
            headers: { 'authorization': 'Bearer ' + (process.env.CRON_SECRET || '') },
          })
          log.push(ap.ok ? 'SOCIAL POSTED: match ' + match.id : 'SOCIAL POST FAILED: ' + ap.status)
        } catch (e: any) {
          log.push('SOCIAL POST ERROR: ' + e.message)
        }
      }

      // ── ABANDONED ──
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
