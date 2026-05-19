import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const group_id = searchParams.get('group_id')
    if (!group_id) {
      return NextResponse.json({ error: 'group_id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('group_members')
      .select(`
        user_id,
        profiles(username, total_points, streak, correct_count, prediction_count, rank, rank_icon, country)
      `)
      .eq('group_id', group_id)

    if (error) throw error

    // Sort by total_points
    const sorted = (data ?? []).sort((a: any, b: any) =>
      (b.profiles?.total_points ?? 0) - (a.profiles?.total_points ?? 0)
    )

    return NextResponse.json({ members: sorted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
