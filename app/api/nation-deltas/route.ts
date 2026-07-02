import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Current nation points
    const { data: profiles } = await supabase
      .from('profiles')
      .select('country, total_points')
      .gt('total_points', 0)

    const currentMap: Record<string, number> = {}
    ;(profiles || []).forEach((p: any) => {
      if (!p.country) return
      currentMap[p.country] = (currentMap[p.country] || 0) + p.total_points
    })

    // Yesterday's snapshot
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const { data: snapshots } = await supabase
      .from('leaderboard_snapshots')
      .select('user_id, total_points')
      .eq('snapshot_date', yesterday)

    // Get countries for snapshot users
    const snapshotUserIds = (snapshots || []).map((s: any) => s.user_id)
    let snapshotCountryMap: Record<string, number> = {}

    if (snapshotUserIds.length > 0) {
      const { data: snapshotProfiles } = await supabase
        .from('profiles')
        .select('id, country')
        .in('id', snapshotUserIds)

      const countryLookup: Record<string, string> = {}
      ;(snapshotProfiles || []).forEach((p: any) => {
        countryLookup[p.id] = p.country
      })

      ;(snapshots || []).forEach((s: any) => {
        const country = countryLookup[s.user_id]
        if (!country) return
        snapshotCountryMap[country] = (snapshotCountryMap[country] || 0) + s.total_points
      })
    }

    // Calculate deltas
    const allCountries = new Set([
      ...Object.keys(currentMap),
      ...Object.keys(snapshotCountryMap),
    ])

    const deltas: Record<string, number> = {}
    allCountries.forEach(code => {
      const current = currentMap[code] || 0
      const previous = snapshotCountryMap[code] || 0
      deltas[code] = current - previous
    })

    // Rank nations by current points
    const ranked = Object.entries(currentMap)
      .sort((a, b) => b[1] - a[1])
      .map(([code, points], idx) => ({
        code,
        rank: idx + 1,
        points,
        todayDelta: deltas[code] || 0,
      }))

    return NextResponse.json({ deltas: ranked, date: yesterday })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
