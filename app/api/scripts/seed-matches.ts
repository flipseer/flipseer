// ─────────────────────────────────────────
// Flipseer — World Cup 2026 Match Seeder
// Run: npx ts-node scripts/seed-matches.ts
// Needs: API_FOOTBALL_KEY + Supabase keys in .env.local
// ─────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const API_KEY = process.env.API_FOOTBALL_KEY!

// World Cup 2026 competition ID on API-Football
const WC_2026_LEAGUE_ID = 1 // ← confirm this from API-Football dashboard
const WC_2026_SEASON = 2026

async function fetchMatches() {
  console.log('🌍 Fetching World Cup 2026 matches from API-Football...')

  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${WC_2026_LEAGUE_ID}&season=${WC_2026_SEASON}`,
    {
      headers: {
        'x-apisports-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    }
  )

  const json = await response.json()

  if (!json.response?.length) {
    console.error('❌ No matches found. Check league ID and season.')
    console.log('Response:', JSON.stringify(json, null, 2))
    process.exit(1)
  }

  console.log(`✅ Found ${json.response.length} matches`)
  return json.response
}

async function seedMatches() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const fixtures = await fetchMatches()

  let inserted = 0
  let skipped = 0

  for (const fixture of fixtures) {
    const f = fixture.fixture
    const teams = fixture.teams
    const goals = fixture.goals
    const league = fixture.league

    // Determine status
    const statusMap: { [key: string]: string } = {
      'NS': 'upcoming',
      'TBD': 'upcoming',
      'LIVE': 'upcoming',
      '1H': 'upcoming',
      'HT': 'upcoming',
      '2H': 'upcoming',
      'FT': 'completed',
      'AET': 'completed',
      'PEN': 'completed',
      'PST': 'upcoming',
      'CANC': 'upcoming',
    }
    const status = statusMap[f.status.short] || 'upcoming'

    // Determine winner
    let winner = null
    if (status === 'completed') {
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
      league: league.name,
      is_upset: false, // calculated later after results
    }

    // Upsert — update if api_id exists, insert if not
    const { error } = await supabase
      .from('matches')
      .upsert(matchData, { onConflict: 'api_id' })

    if (error) {
      console.error(`❌ Failed to insert ${teams.home.name} vs ${teams.away.name}:`, error.message)
      skipped++
    } else {
      console.log(`✅ ${teams.home.name} vs ${teams.away.name} — ${new Date(f.date).toLocaleDateString()}`)
      inserted++
    }
  }

  console.log(`\n🎉 Done! Inserted/updated: ${inserted} | Skipped: ${skipped}`)
}

seedMatches().catch(console.error)
