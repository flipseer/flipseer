import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { count } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('badge_type', 'founding_forecaster')

    const awarded = count || 0
    const spots_left = Math.max(0, 100 - awarded)

    return NextResponse.json({ awarded, spots_left }, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' }
    })
  } catch (err: any) {
    return NextResponse.json({ awarded: 0, spots_left: 83 })
  }
}
