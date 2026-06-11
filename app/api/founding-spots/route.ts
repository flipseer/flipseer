import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count, error } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('badge_type', 'founding_forecaster')

    if (error) {
      return NextResponse.json({ awarded: 20, spots_left: 80 })
    }

    const awarded = count || 0
    const spots_left = Math.max(0, 100 - awarded)

    return NextResponse.json({ awarded, spots_left }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      }
    })
  } catch (err: any) {
    return NextResponse.json({ awarded: 20, spots_left: 80 })
  }
}
