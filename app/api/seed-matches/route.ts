import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 second timeout for seeding

export async function GET(request: NextRequest) {
  try {
    // ── Auth check ──
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Fetch World Cup 2026 matches from API-Football ──
    console.log('🌍 Fetching World Cup 2026 matches from API-Football...')

    const response = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      {
        headers: {
          'x-apisports-key': process.env.API_FOOTBALL_KEY!,
        },
      }
    )

    const json = await response.json()

    if (!json.response?.length) {
      return NextResponse.json({
        error: 'No matches found from API-Football',
        details: json
      }, { status: 404 })
    }

    console.log(`✅ Found ${json.response.length} matches`)

    let inserted = 0
    let skipped = 0
    const errors = []

    for (const fixture of json.response) {
      const f = fixture.fixture
      const teams = fixture.teams
      const goals = fixture.goals
      const league = fixture.league

      // Map API status to our status
      const statusMap: { [key: string]: string } = {
        'NS': 'upcoming',
        'TBD': 'upcoming',
        'LIVE': 'upcoming',
        '1H': 'upcoming',
        'HT': 'upcoming',
        '2H': 'upcoming',
        'ET': 'upcoming',
        'P': 'upcoming',
        'FT': 'completed',
        'AET': 'completed',
        'PEN': 'completed',
        'PST': 'upcoming',
        'CANC': 'upcoming',
        'ABD': 'upcoming',
        'AWD': 'completed',
        'WO': 'completed',
      }
      const status = statusMap[f.status.short] || 'upcoming'

      // Determine winner
      let winner = null
      if (status === 'completed' && goals.home !== null && goals.away !== null) {
        if (goals.home > goals.away) winner = teams.home.name
        else if (goals.away > goals.home) winner = teams.away.name
        else winner = 'draw'
      }

      const matchData = {
        api_id: f.id,
        home_team: teams.home.name,
        away_team: teams.away.name,
        home_team_logo: teams.home.logo,
        away_team_logo: teams.away.logo,
        kickoff: new Date(f.date).toISOString(),
        status,
        home_score: goals.home ?? null,
        away_score: goals.away ?? null,
        winner,
        league: league.round || league.name,
        is_upset: false,
      }

      // Upsert — insert or update if api_id exists
      const { error } = await supabase
        .from('matches')
        .upsert(matchData, { onConflict: 'api_id' })

      if (error) {
        console.error(`❌ ${teams.home.name} vs ${teams.away.name}:`, error.message)
        errors.push(`${teams.home.name} vs ${teams.away.name}: ${error.message}`)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      total: json.response.length,
      inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      message: `✅ Seeded ${inserted} World Cup 2026 matches!`
    })

  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
