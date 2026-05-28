import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// ══════════════════════════════════════════════════════════
// FIFA WORLD CUP 2026 — OFFICIAL GROUP STAGE FIXTURES
// Source: Al Jazeera / FIFA Official Schedule (May 2026)
// All times in UTC
// Groups confirmed:
// A: Mexico, South Africa, Korea Republic, Czechia
// B: Canada, Bosnia & Herzegovina, Qatar, Switzerland
// C: Brazil, Morocco, Haiti, Scotland
// D: USA, Paraguay, Australia, Türkiye
// E: Germany, Curaçao, Ivory Coast, Ecuador
// F: Netherlands, Japan, Sweden, Tunisia
// G: Belgium, Egypt, Iran, New Zealand
// H: Spain, Cape Verde, Saudi Arabia, Uruguay
// I: France, Senegal, Iraq, Norway
// J: Argentina, Algeria, Austria, Jordan
// K: Portugal, DR Congo, Uzbekistan, Colombia
// L: England, Croatia, Ghana, Panama
// ══════════════════════════════════════════════════════════

const WC2026_MATCHES = [

  // ── GROUP A: Mexico, South Africa, Korea Republic, Czechia ──
  { home: 'Mexico',       away: 'South Africa',  date: '2026-06-11T19:00:00Z', group: 'Group A' },
  { home: 'South Korea',  away: 'Czechia',        date: '2026-06-12T02:00:00Z', group: 'Group A' },
  { home: 'Czechia',      away: 'South Africa',   date: '2026-06-18T17:00:00Z', group: 'Group A' },
  { home: 'Mexico',       away: 'South Korea',    date: '2026-06-19T03:00:00Z', group: 'Group A' },
  { home: 'Czechia',      away: 'Mexico',         date: '2026-06-25T01:00:00Z', group: 'Group A' },
  { home: 'South Africa', away: 'South Korea',    date: '2026-06-25T01:00:00Z', group: 'Group A' },

  // ── GROUP B: Canada, Bosnia & Herzegovina, Qatar, Switzerland ──
  { home: 'Canada',       away: 'Bosnia & Herzegovina', date: '2026-06-12T19:00:00Z', group: 'Group B' },
  { home: 'Qatar',        away: 'Switzerland',          date: '2026-06-13T19:00:00Z', group: 'Group B' },
  { home: 'Switzerland',  away: 'Bosnia & Herzegovina', date: '2026-06-18T23:00:00Z', group: 'Group B' },
  { home: 'Canada',       away: 'Qatar',                date: '2026-06-19T02:00:00Z', group: 'Group B' },
  { home: 'Switzerland',  away: 'Canada',               date: '2026-06-24T23:00:00Z', group: 'Group B' },
  { home: 'Bosnia & Herzegovina', away: 'Qatar',        date: '2026-06-24T23:00:00Z', group: 'Group B' },

  // ── GROUP C: Brazil, Morocco, Haiti, Scotland ──
  { home: 'Brazil',       away: 'Morocco',        date: '2026-06-13T23:00:00Z', group: 'Group C' },
  { home: 'Haiti',        away: 'Scotland',       date: '2026-06-14T01:00:00Z', group: 'Group C' },
  { home: 'Scotland',     away: 'Morocco',        date: '2026-06-19T23:00:00Z', group: 'Group C' },
  { home: 'Brazil',       away: 'Haiti',          date: '2026-06-20T02:00:00Z', group: 'Group C' },
  { home: 'Scotland',     away: 'Brazil',         date: '2026-06-24T23:00:00Z', group: 'Group C' },
  { home: 'Morocco',      away: 'Haiti',          date: '2026-06-24T23:00:00Z', group: 'Group C' },

  // ── GROUP D: USA, Paraguay, Australia, Türkiye ──
  { home: 'USA',          away: 'Paraguay',       date: '2026-06-12T01:00:00Z', group: 'Group D' },
  { home: 'Australia',    away: 'Türkiye',        date: '2026-06-13T04:00:00Z', group: 'Group D' },
  { home: 'USA',          away: 'Australia',      date: '2026-06-19T23:00:00Z', group: 'Group D' },
  { home: 'Türkiye',      away: 'Paraguay',       date: '2026-06-20T08:00:00Z', group: 'Group D' },
  { home: 'Türkiye',      away: 'USA',            date: '2026-06-26T02:00:00Z', group: 'Group D' },
  { home: 'Paraguay',     away: 'Australia',      date: '2026-06-26T02:00:00Z', group: 'Group D' },

  // ── GROUP E: Germany, Curaçao, Ivory Coast, Ecuador ──
  { home: 'Germany',      away: 'Curaçao',        date: '2026-06-14T18:00:00Z', group: 'Group E' },
  { home: 'Ivory Coast',  away: 'Ecuador',        date: '2026-06-15T00:00:00Z', group: 'Group E' },
  { home: 'Germany',      away: 'Ivory Coast',    date: '2026-06-20T21:00:00Z', group: 'Group E' },
  { home: 'Ecuador',      away: 'Curaçao',        date: '2026-06-21T04:00:00Z', group: 'Group E' },
  { home: 'Ecuador',      away: 'Germany',        date: '2026-06-25T21:00:00Z', group: 'Group E' },
  { home: 'Curaçao',      away: 'Ivory Coast',    date: '2026-06-25T21:00:00Z', group: 'Group E' },

  // ── GROUP F: Netherlands, Japan, Sweden, Tunisia ──
  { home: 'Netherlands',  away: 'Japan',          date: '2026-06-14T21:00:00Z', group: 'Group F' },
  { home: 'Sweden',       away: 'Tunisia',        date: '2026-06-15T04:00:00Z', group: 'Group F' },
  { home: 'Netherlands',  away: 'Sweden',         date: '2026-06-20T19:00:00Z', group: 'Group F' },
  { home: 'Tunisia',      away: 'Japan',          date: '2026-06-21T06:00:00Z', group: 'Group F' },
  { home: 'Japan',        away: 'Sweden',         date: '2026-06-26T01:00:00Z', group: 'Group F' },
  { home: 'Tunisia',      away: 'Netherlands',    date: '2026-06-26T01:00:00Z', group: 'Group F' },

  // ── GROUP G: Belgium, Egypt, Iran, New Zealand ──
  { home: 'Belgium',      away: 'Egypt',          date: '2026-06-15T23:00:00Z', group: 'Group G' },
  { home: 'Iran',         away: 'New Zealand',    date: '2026-06-16T05:00:00Z', group: 'Group G' },
  { home: 'Belgium',      away: 'Iran',           date: '2026-06-21T23:00:00Z', group: 'Group G' },
  { home: 'New Zealand',  away: 'Egypt',          date: '2026-06-22T05:00:00Z', group: 'Group G' },
  { home: 'New Zealand',  away: 'Belgium',        date: '2026-06-27T07:00:00Z', group: 'Group G' },
  { home: 'Egypt',        away: 'Iran',           date: '2026-06-27T07:00:00Z', group: 'Group G' },

  // ── GROUP H: Spain, Cape Verde, Saudi Arabia, Uruguay ──
  { home: 'Spain',        away: 'Cape Verde',     date: '2026-06-15T17:00:00Z', group: 'Group H' },
  { home: 'Saudi Arabia', away: 'Uruguay',        date: '2026-06-15T23:00:00Z', group: 'Group H' },
  { home: 'Spain',        away: 'Saudi Arabia',   date: '2026-06-21T17:00:00Z', group: 'Group H' },
  { home: 'Uruguay',      away: 'Cape Verde',     date: '2026-06-21T23:00:00Z', group: 'Group H' },
  { home: 'Uruguay',      away: 'Spain',          date: '2026-06-27T02:00:00Z', group: 'Group H' },
  { home: 'Cape Verde',   away: 'Saudi Arabia',   date: '2026-06-27T02:00:00Z', group: 'Group H' },

  // ── GROUP I: France, Senegal, Iraq, Norway ──
  { home: 'France',       away: 'Senegal',        date: '2026-06-16T20:00:00Z', group: 'Group I' },
  { home: 'Iraq',         away: 'Norway',         date: '2026-06-16T23:00:00Z', group: 'Group I' },
  { home: 'France',       away: 'Iraq',           date: '2026-06-22T22:00:00Z', group: 'Group I' },
  { home: 'Norway',       away: 'Senegal',        date: '2026-06-23T01:00:00Z', group: 'Group I' },
  { home: 'Norway',       away: 'France',         date: '2026-06-26T20:00:00Z', group: 'Group I' },
  { home: 'Senegal',      away: 'Iraq',           date: '2026-06-26T20:00:00Z', group: 'Group I' },

  // ── GROUP J: Argentina, Algeria, Austria, Jordan ──
  { home: 'Argentina',    away: 'Algeria',        date: '2026-06-16T03:00:00Z', group: 'Group J' },
  { home: 'Austria',      away: 'Jordan',         date: '2026-06-17T08:00:00Z', group: 'Group J' },
  { home: 'Argentina',    away: 'Austria',        date: '2026-06-22T19:00:00Z', group: 'Group J' },
  { home: 'Jordan',       away: 'Algeria',        date: '2026-06-23T07:00:00Z', group: 'Group J' },
  { home: 'Jordan',       away: 'Argentina',      date: '2026-06-27T04:00:00Z', group: 'Group J' },
  { home: 'Algeria',      away: 'Austria',        date: '2026-06-27T04:00:00Z', group: 'Group J' },

  // ── GROUP K: Portugal, DR Congo, Uzbekistan, Colombia ──
  { home: 'Portugal',     away: 'DR Congo',       date: '2026-06-17T19:00:00Z', group: 'Group K' },
  { home: 'Uzbekistan',   away: 'Colombia',       date: '2026-06-18T04:00:00Z', group: 'Group K' },
  { home: 'Portugal',     away: 'Uzbekistan',     date: '2026-06-23T19:00:00Z', group: 'Group K' },
  { home: 'Colombia',     away: 'DR Congo',       date: '2026-06-24T04:00:00Z', group: 'Group K' },
  { home: 'Colombia',     away: 'Portugal',       date: '2026-06-27T23:30:00Z', group: 'Group K' },
  { home: 'DR Congo',     away: 'Uzbekistan',     date: '2026-06-27T23:30:00Z', group: 'Group K' },

  // ── GROUP L: England, Croatia, Ghana, Panama ──
  { home: 'England',      away: 'Croatia',        date: '2026-06-17T22:00:00Z', group: 'Group L' },
  { home: 'Ghana',        away: 'Panama',         date: '2026-06-18T00:00:00Z', group: 'Group L' },
  { home: 'England',      away: 'Ghana',          date: '2026-06-23T21:00:00Z', group: 'Group L' },
  { home: 'Panama',       away: 'Croatia',        date: '2026-06-24T00:00:00Z', group: 'Group L' },
  { home: 'Panama',       away: 'England',        date: '2026-06-27T22:00:00Z', group: 'Group L' },
  { home: 'Croatia',      away: 'Ghana',          date: '2026-06-27T22:00:00Z', group: 'Group L' },
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

    console.log(`🌍 Seeding ${WC2026_MATCHES.length} official FIFA WC 2026 matches...`)

    let inserted = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 0; i < WC2026_MATCHES.length; i++) {
      const m = WC2026_MATCHES[i]

      const matchData = {
        api_id: 2026001 + i,
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
      message: `✅ Seeded ${inserted} official FIFA World Cup 2026 group stage matches!`,
      groups: 'Groups A–L confirmed',
    })

  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
