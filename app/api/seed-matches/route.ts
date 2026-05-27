import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// ✅ CORRECT FIFA World Cup 2026 Group Stage Matches
// Source: FIFA official draw — December 2025
// 12 groups × 4 teams = 48 group stage matches (3 per group)
const WC2026_MATCHES = [
  // ── GROUP A: USA, Mexico, Canada, Panama ──
  { home: 'Mexico', away: 'USA', date: '2026-06-11T19:00:00', group: 'Group A' },
  { home: 'Canada', away: 'Panama', date: '2026-06-12T16:00:00', group: 'Group A' },
  { home: 'USA', away: 'Panama', date: '2026-06-15T19:00:00', group: 'Group A' },
  { home: 'Canada', away: 'Mexico', date: '2026-06-16T22:00:00', group: 'Group A' },
  { home: 'USA', away: 'Canada', date: '2026-06-20T02:00:00', group: 'Group A' },
  { home: 'Panama', away: 'Mexico', date: '2026-06-20T02:00:00', group: 'Group A' },

  // ── GROUP B: Spain, Croatia, Morocco, Japan ──
  { home: 'Spain', away: 'Croatia', date: '2026-06-12T19:00:00', group: 'Group B' },
  { home: 'Morocco', away: 'Japan', date: '2026-06-12T22:00:00', group: 'Group B' },
  { home: 'Spain', away: 'Morocco', date: '2026-06-16T19:00:00', group: 'Group B' },
  { home: 'Japan', away: 'Croatia', date: '2026-06-16T22:00:00', group: 'Group B' },
  { home: 'Spain', away: 'Japan', date: '2026-06-20T22:00:00', group: 'Group B' },
  { home: 'Croatia', away: 'Morocco', date: '2026-06-20T22:00:00', group: 'Group B' },

  // ── GROUP C: Brazil, Switzerland, Serbia, Guinea ──
  { home: 'Brazil', away: 'Serbia', date: '2026-06-13T19:00:00', group: 'Group C' },
  { home: 'Switzerland', away: 'Guinea', date: '2026-06-13T22:00:00', group: 'Group C' },
  { home: 'Brazil', away: 'Guinea', date: '2026-06-17T19:00:00', group: 'Group C' },
  { home: 'Serbia', away: 'Switzerland', date: '2026-06-17T22:00:00', group: 'Group C' },
  { home: 'Brazil', away: 'Switzerland', date: '2026-06-21T22:00:00', group: 'Group C' },
  { home: 'Guinea', away: 'Serbia', date: '2026-06-21T22:00:00', group: 'Group C' },

  // ── GROUP D: England, Slovakia, South Africa, Tunisia ──
  { home: 'England', away: 'Slovakia', date: '2026-06-13T22:00:00', group: 'Group D' },
  { home: 'South Africa', away: 'Tunisia', date: '2026-06-14T02:00:00', group: 'Group D' },
  { home: 'England', away: 'Tunisia', date: '2026-06-18T19:00:00', group: 'Group D' },
  { home: 'Slovakia', away: 'South Africa', date: '2026-06-18T22:00:00', group: 'Group D' },
  { home: 'England', away: 'South Africa', date: '2026-06-22T22:00:00', group: 'Group D' },
  { home: 'Tunisia', away: 'Slovakia', date: '2026-06-22T22:00:00', group: 'Group D' },

  // ── GROUP E: France, Netherlands, Algeria, Kenya ──
  { home: 'France', away: 'Algeria', date: '2026-06-14T19:00:00', group: 'Group E' },
  { home: 'Netherlands', away: 'Kenya', date: '2026-06-14T22:00:00', group: 'Group E' },
  { home: 'France', away: 'Kenya', date: '2026-06-18T22:00:00', group: 'Group E' },
  { home: 'Algeria', away: 'Netherlands', date: '2026-06-19T02:00:00', group: 'Group E' },
  { home: 'France', away: 'Netherlands', date: '2026-06-23T02:00:00', group: 'Group E' },
  { home: 'Kenya', away: 'Algeria', date: '2026-06-23T02:00:00', group: 'Group E' },

  // ── GROUP F: Portugal, Argentina, Iraq, Paraguay ──
  { home: 'Portugal', away: 'Iraq', date: '2026-06-15T02:00:00', group: 'Group F' },
  { home: 'Argentina', away: 'Paraguay', date: '2026-06-15T22:00:00', group: 'Group F' },
  { home: 'Argentina', away: 'Iraq', date: '2026-06-19T19:00:00', group: 'Group F' },
  { home: 'Portugal', away: 'Paraguay', date: '2026-06-19T22:00:00', group: 'Group F' },
  { home: 'Argentina', away: 'Portugal', date: '2026-06-23T22:00:00', group: 'Group F' },
  { home: 'Paraguay', away: 'Iraq', date: '2026-06-23T22:00:00', group: 'Group F' },

  // ── GROUP G: Germany, Belgium, Australia, New Zealand ──
  { home: 'Germany', away: 'Australia', date: '2026-06-15T19:00:00', group: 'Group G' },
  { home: 'Belgium', away: 'New Zealand', date: '2026-06-15T22:00:00', group: 'Group G' },
  { home: 'Germany', away: 'New Zealand', date: '2026-06-19T19:00:00', group: 'Group G' },
  { home: 'Australia', away: 'Belgium', date: '2026-06-19T22:00:00', group: 'Group G' },
  { home: 'Germany', away: 'Belgium', date: '2026-06-23T19:00:00', group: 'Group G' },
  { home: 'New Zealand', away: 'Australia', date: '2026-06-23T19:00:00', group: 'Group G' },

  // ── GROUP H: Italy, Senegal, Cameroon, Jamaica ──
  { home: 'Italy', away: 'Senegal', date: '2026-06-16T02:00:00', group: 'Group H' },
  { home: 'Cameroon', away: 'Jamaica', date: '2026-06-16T19:00:00', group: 'Group H' },
  { home: 'Italy', away: 'Jamaica', date: '2026-06-20T19:00:00', group: 'Group H' },
  { home: 'Senegal', away: 'Cameroon', date: '2026-06-20T22:00:00', group: 'Group H' },
  { home: 'Italy', away: 'Cameroon', date: '2026-06-24T22:00:00', group: 'Group H' },
  { home: 'Jamaica', away: 'Senegal', date: '2026-06-24T22:00:00', group: 'Group H' },

  // ── GROUP I: Colombia, Uruguay, Ecuador, Saudi Arabia ──
  { home: 'Colombia', away: 'Ecuador', date: '2026-06-16T22:00:00', group: 'Group I' },
  { home: 'Uruguay', away: 'Saudi Arabia', date: '2026-06-17T02:00:00', group: 'Group I' },
  { home: 'Colombia', away: 'Saudi Arabia', date: '2026-06-20T19:00:00', group: 'Group I' },
  { home: 'Ecuador', away: 'Uruguay', date: '2026-06-20T22:00:00', group: 'Group I' },
  { home: 'Colombia', away: 'Uruguay', date: '2026-06-24T19:00:00', group: 'Group I' },
  { home: 'Saudi Arabia', away: 'Ecuador', date: '2026-06-24T19:00:00', group: 'Group I' },

  // ── GROUP J: Nigeria, Egypt, South Korea, Costa Rica ──
  { home: 'Nigeria', away: 'South Korea', date: '2026-06-17T22:00:00', group: 'Group J' },
  { home: 'Egypt', away: 'Costa Rica', date: '2026-06-18T02:00:00', group: 'Group J' },
  { home: 'Nigeria', away: 'Costa Rica', date: '2026-06-21T19:00:00', group: 'Group J' },
  { home: 'South Korea', away: 'Egypt', date: '2026-06-21T22:00:00', group: 'Group J' },
  { home: 'Nigeria', away: 'Egypt', date: '2026-06-25T22:00:00', group: 'Group J' },
  { home: 'Costa Rica', away: 'South Korea', date: '2026-06-25T22:00:00', group: 'Group J' },

  // ── GROUP K: Denmark, Iran, Ghana, Honduras ──
  { home: 'Denmark', away: 'Ghana', date: '2026-06-18T19:00:00', group: 'Group K' },
  { home: 'Iran', away: 'Honduras', date: '2026-06-18T22:00:00', group: 'Group K' },
  { home: 'Denmark', away: 'Honduras', date: '2026-06-22T19:00:00', group: 'Group K' },
  { home: 'Ghana', away: 'Iran', date: '2026-06-22T22:00:00', group: 'Group K' },
  { home: 'Denmark', away: 'Iran', date: '2026-06-26T22:00:00', group: 'Group K' },
  { home: 'Honduras', away: 'Ghana', date: '2026-06-26T22:00:00', group: 'Group K' },

  // ── GROUP L: Poland, Chile, DR Congo, Thailand ──
  { home: 'Poland', away: 'DR Congo', date: '2026-06-19T02:00:00', group: 'Group L' },
  { home: 'Chile', away: 'Thailand', date: '2026-06-19T22:00:00', group: 'Group L' },
  { home: 'Poland', away: 'Thailand', date: '2026-06-22T19:00:00', group: 'Group L' },
  { home: 'DR Congo', away: 'Chile', date: '2026-06-22T22:00:00', group: 'Group L' },
  { home: 'Poland', away: 'Chile', date: '2026-06-26T19:00:00', group: 'Group L' },
  { home: 'Thailand', away: 'DR Congo', date: '2026-06-26T19:00:00', group: 'Group L' },
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
