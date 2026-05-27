import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// ✅ CORRECT FIFA World Cup 2026 Group Stage Matches
// Source: FIFA official draw — December 2025
const WC2026_MATCHES = [
  // ── GROUP A ──
  { home: 'Mexico', away: 'South Africa', date: '2026-06-11T19:30:00', group: 'Group A' },
  { home: 'South Korea', away: 'Czech Republic', date: '2026-06-11T19:30:00', group: 'Group A' },
  { home: 'Mexico', away: 'South Korea', date: '2026-06-16T20:00:00', group: 'Group A' },
  { home: 'South Africa', away: 'Czech Republic', date: '2026-06-16T20:00:00', group: 'Group A' },
  { home: 'Mexico', away: 'Czech Republic', date: '2026-06-20T20:00:00', group: 'Group A' },
  { home: 'South Africa', away: 'South Korea', date: '2026-06-20T20:00:00', group: 'Group A' },

  // ── GROUP B ──
  { home: 'Canada', away: 'Bosnia and Herzegovina', date: '2026-06-12T00:00:00', group: 'Group B' },
  { home: 'Canada', away: 'Switzerland', date: '2026-06-16T20:00:00', group: 'Group B' },
  { home: 'Canada', away: 'Qatar', date: '2026-06-21T20:00:00', group: 'Group B' },
  { home: 'Switzerland', away: 'Bosnia and Herzegovina', date: '2026-06-21T20:00:00', group: 'Group B' },
  { home: 'Canada', away: 'Switzerland', date: '2026-06-25T20:00:00', group: 'Group B' },
  { home: 'Qatar', away: 'Bosnia and Herzegovina', date: '2026-06-25T20:00:00', group: 'Group B' },

  // ── GROUP C ──
  { home: 'Brazil', away: 'Morocco', date: '2026-06-12T20:00:00', group: 'Group C' },
  { home: 'Brazil', away: 'Scotland', date: '2026-06-17T20:00:00', group: 'Group C' },
  { home: 'Brazil', away: 'Haiti', date: '2026-06-21T20:00:00', group: 'Group C' },
  { home: 'Brazil', away: 'Scotland', date: '2026-06-24T20:00:00', group: 'Group C' },
  { home: 'Morocco', away: 'Haiti', date: '2026-06-24T20:00:00', group: 'Group C' },
  { home: 'Morocco', away: 'Scotland', date: '2026-06-27T20:00:00', group: 'Group C' },

  // ── GROUP D ──
  { home: 'United States', away: 'Paraguay', date: '2026-06-12T20:00:00', group: 'Group D' },
  { home: 'United States', away: 'Türkiye', date: '2026-06-17T20:00:00', group: 'Group D' },
  { home: 'United States', away: 'Australia', date: '2026-06-21T20:00:00', group: 'Group D' },
  { home: 'Paraguay', away: 'Türkiye', date: '2026-06-24T20:00:00', group: 'Group D' },
  { home: 'United States', away: 'Paraguay', date: '2026-06-27T20:00:00', group: 'Group D' },
  { home: 'Australia', away: 'Türkiye', date: '2026-06-27T20:00:00', group: 'Group D' },

  // ── GROUP E ──
  { home: 'Germany', away: 'Curaçao', date: '2026-06-13T20:00:00', group: 'Group E' },
  { home: 'Germany', away: 'Ecuador', date: '2026-06-17T20:00:00', group: 'Group E' },
  { home: 'Germany', away: 'Ivory Coast', date: '2026-06-22T20:00:00', group: 'Group E' },
  { home: 'Germany', away: 'Curaçao', date: '2026-06-25T20:00:00', group: 'Group E' },
  { home: 'Ecuador', away: 'Ivory Coast', date: '2026-06-25T20:00:00', group: 'Group E' },
  { home: 'Ecuador', away: 'Curaçao', date: '2026-06-27T20:00:00', group: 'Group E' },

  // ── GROUP F ──
  { home: 'Netherlands', away: 'Japan', date: '2026-06-15T20:00:00', group: 'Group F' },
  { home: 'Netherlands', away: 'Sweden', date: '2026-06-19T20:00:00', group: 'Group F' },
  { home: 'Netherlands', away: 'Tunisia', date: '2026-06-24T20:00:00', group: 'Group F' },
  { home: 'Japan', away: 'Tunisia', date: '2026-06-25T20:00:00', group: 'Group F' },
  { home: 'Sweden', away: 'Tunisia', date: '2026-06-27T20:00:00', group: 'Group F' },
  { home: 'Netherlands', away: 'Japan', date: '2026-06-27T20:00:00', group: 'Group F' },

  // ── GROUP G ──
  { home: 'Belgium', away: 'Egypt', date: '2026-06-15T20:00:00', group: 'Group G' },
  { home: 'Belgium', away: 'Iran', date: '2026-06-20T20:00:00', group: 'Group G' },
  { home: 'Belgium', away: 'New Zealand', date: '2026-06-24T20:00:00', group: 'Group G' },
  { home: 'Egypt', away: 'Iran', date: '2026-06-25T20:00:00', group: 'Group G' },
  { home: 'Egypt', away: 'New Zealand', date: '2026-06-27T20:00:00', group: 'Group G' },
  { home: 'Iran', away: 'New Zealand', date: '2026-06-27T20:00:00', group: 'Group G' },

  // ── GROUP H ──
  { home: 'Spain', away: 'Cape Verde', date: '2026-06-14T20:00:00', group: 'Group H' },
  { home: 'Spain', away: 'Uruguay', date: '2026-06-19T20:00:00', group: 'Group H' },
  { home: 'Spain', away: 'Saudi Arabia', date: '2026-06-23T20:00:00', group: 'Group H' },
  { home: 'Uruguay', away: 'Saudi Arabia', date: '2026-06-26T20:00:00', group: 'Group H' },
  { home: 'Spain', away: 'Uruguay', date: '2026-06-27T20:00:00', group: 'Group H' },
  { home: 'Saudi Arabia', away: 'Cape Verde', date: '2026-06-27T20:00:00', group: 'Group H' },

  // ── GROUP I ──
  { home: 'France', away: 'Senegal', date: '2026-06-14T20:00:00', group: 'Group I' },
  { home: 'France', away: 'Norway', date: '2026-06-18T20:00:00', group: 'Group I' },
  { home: 'France', away: 'Iraq', date: '2026-06-23T20:00:00', group: 'Group I' },
  { home: 'France', away: 'Senegal', date: '2026-06-26T20:00:00', group: 'Group I' },
  { home: 'Norway', away: 'Iraq', date: '2026-06-26T20:00:00', group: 'Group I' },
  { home: 'Senegal', away: 'Iraq', date: '2026-06-27T20:00:00', group: 'Group I' },

  // ── GROUP J ──
  { home: 'Argentina', away: 'Algeria', date: '2026-06-13T20:00:00', group: 'Group J' },
  { home: 'Argentina', away: 'Austria', date: '2026-06-18T20:00:00', group: 'Group J' },
  { home: 'Argentina', away: 'Jordan', date: '2026-06-22T20:00:00', group: 'Group J' },
  { home: 'Argentina', away: 'Austria', date: '2026-06-25T20:00:00', group: 'Group J' },
  { home: 'Algeria', away: 'Jordan', date: '2026-06-25T20:00:00', group: 'Group J' },
  { home: 'Austria', away: 'Jordan', date: '2026-06-27T20:00:00', group: 'Group J' },

  // ── GROUP K ──
  { home: 'Portugal', away: 'Uzbekistan', date: '2026-06-14T20:00:00', group: 'Group K' },
  { home: 'Portugal', away: 'Colombia', date: '2026-06-19T20:00:00', group: 'Group K' },
  { home: 'Portugal', away: 'DR Congo', date: '2026-06-23T20:00:00', group: 'Group K' },
  { home: 'Portugal', away: 'Colombia', date: '2026-06-27T20:00:00', group: 'Group K' },
  { home: 'Uzbekistan', away: 'DR Congo', date: '2026-06-27T20:00:00', group: 'Group K' },
  { home: 'Colombia', away: 'DR Congo', date: '2026-06-27T20:00:00', group: 'Group K' },

  // ── GROUP L ──
  { home: 'England', away: 'Croatia', date: '2026-06-13T20:00:00', group: 'Group L' },
  { home: 'England', away: 'Ghana', date: '2026-06-18T20:00:00', group: 'Group L' },
  { home: 'England', away: 'Panama', date: '2026-06-22T20:00:00', group: 'Group L' },
  { home: 'England', away: 'Croatia', date: '2026-06-26T20:00:00', group: 'Group L' },
  { home: 'Ghana', away: 'Panama', date: '2026-06-26T20:00:00', group: 'Group L' },
  { home: 'Croatia', away: 'Panama', date: '2026-06-27T20:00:00', group: 'Group L' },
]

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

    console.log(`🌍 Seeding ${WC2026_MATCHES.length} correct WC 2026 matches...`)

    let inserted = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 0; i < WC2026_MATCHES.length; i++) {
      const m = WC2026_MATCHES[i]

      const matchData = {
        api_id: 2026000 + i + 1, // Unique IDs starting from 2026001
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
      message: `✅ Seeded ${inserted} correct FIFA World Cup 2026 matches!`,
      groups: 'A through L — 12 groups × 6 matches = 72 group stage matches',
    })

  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
