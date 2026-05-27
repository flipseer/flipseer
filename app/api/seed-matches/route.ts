import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// ✅ FIFA World Cup 2026 Group Stage Matches (Realistic Seeding)
// Note: Final groups and exact fixtures will be confirmed closer to the event.
// This is a realistic placeholder based on official host allocations + typical draw.

const WC2026_MATCHES = [
  // GROUP A (Hosts + strong teams)
  { home: 'Mexico', away: 'South Africa', date: '2026-06-11T19:00:00', group: 'Group A' },
  { home: 'USA', away: 'Canada', date: '2026-06-12T18:00:00', group: 'Group A' },
  { home: 'Mexico', away: 'USA', date: '2026-06-16T19:00:00', group: 'Group A' },
  { home: 'Canada', away: 'South Africa', date: '2026-06-17T22:00:00', group: 'Group A' },
  { home: 'Mexico', away: 'Canada', date: '2026-06-21T19:00:00', group: 'Group A' },
  { home: 'South Africa', away: 'USA', date: '2026-06-21T22:00:00', group: 'Group A' },

  // GROUP B
  { home: 'Spain', away: 'Croatia', date: '2026-06-13T19:00:00', group: 'Group B' },
  { home: 'Brazil', away: 'Morocco', date: '2026-06-14T19:00:00', group: 'Group B' },
  { home: 'Spain', away: 'Brazil', date: '2026-06-18T19:00:00', group: 'Group B' },

  // GROUP C (Examples - expand as needed)
  { home: 'England', away: 'France', date: '2026-06-15T22:00:00', group: 'Group C' },
  { home: 'Argentina', away: 'Portugal', date: '2026-06-16T22:00:00', group: 'Group C' },
  { home: 'Germany', away: 'Netherlands', date: '2026-06-19T19:00:00', group: 'Group C' },

  // Add more realistic matches here as official draw becomes available
  // Total group stage matches = 72 (48 teams × 3 matches each / 2)
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log(`🌍 Seeding ${WC2026_MATCHES.length} FIFA World Cup 2026 matches...`)

    let inserted = 0
    let skipped = 0
    const errors: string[] = []

    for (const m of WC2026_MATCHES) {
      const matchData = {
        api_id: `wc2026-\( {m.home.toLowerCase()}- \){m.away.toLowerCase()}-${m.date.slice(0,10)}`,
        home_team: m.home,
        away_team: m.away,
        kickoff: new Date(m.date).toISOString(),
        status: 'upcoming',
        home_score: null,
        away_score: null,
        winner: null,
        league: m.group,
        is_upset: false,
        results_processed: false,
      }

      const { error } = await supabase
        .from('matches')
        .upsert(matchData, { onConflict: 'api_id' })

      if (error) {
        console.error(`❌ ${m.home} vs ${m.away}:`, error.message)
        errors.push(`${m.home} vs ${m.away}: ${error.message}`)
        skipped++
      } else {
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      total: WC2026_MATCHES.length,
      inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      message: `✅ Successfully seeded ${inserted} World Cup 2026 matches.`,
    })

  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
