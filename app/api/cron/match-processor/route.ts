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
    .replace(/[\u0300-\u036f]/g, '')
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
      const isFinished = ['FT', 'AET',
