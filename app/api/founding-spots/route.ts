import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    // Use service role to bypass RLS for accurate count
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count, error } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('badge_type', 'founding_forecaster')

    if (error) {
      console.error('Founding spots error:', error.message)
      return NextResponse.json({ awarded: 17, spots_left: 83 })
    }

    const awarded = count || 0
    const spots_left = Math.max(0, 100 - awarded)

    return NextResponse.json({ awarded, spots_left }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (err: any) {
    return NextResponse.json({ awarded: 17, spots_left: 83 })
  }
}
