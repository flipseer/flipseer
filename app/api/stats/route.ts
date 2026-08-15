// app/api/stats/route.ts
// Returns real-time site stats — used by homepage buzz bar
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const [
      { count: totalUsers },
      { count: activeForecasters },
      { count: totalPredictions },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('prediction_count', 0),
      supabase.from('predictions').select('*', { count: 'exact', head: true }),
    ])
    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeForecasters: activeForecasters || 0,
      totalPredictions: totalPredictions || 0,
    })
  } catch (e) {
    return NextResponse.json({ totalUsers: 0, activeForecasters: 0, totalPredictions: 0 })
  }
}
