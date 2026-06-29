import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'username required' }, { status: 400 })
    }

    // Use service role to bypass RLS — public journal is intentionally public
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get predictions with match data
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select('*, matches(id, home_team, away_team, kickoff, status, home_score, away_score, competition)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(200)

    if (predError) {
      return NextResponse.json({ error: predError.message }, { status: 500 })
    }

    return NextResponse.json({ profile, predictions: predictions || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
