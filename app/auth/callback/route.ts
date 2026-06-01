import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/predict'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${origin}/auth?error=oauth_error`)
  }

  // -- Check profile exists --
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .single()

  if (!profile) {
    // -- Build username -- no extra DB call --
    const googleName = data.user.user_metadata?.full_name || ''
    const emailPrefix = data.user.email?.split('@')[0] || 'user'
    const base = googleName
      ? googleName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      : emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '')
    // Timestamp suffix = always unique, no extra DB query needed
    const username = `${base.slice(0, 15)}_${Date.now().toString().slice(-4)}`

    const isBeforeLaunch = new Date() < new Date('2026-06-11T19:00:00Z')

    // -- Run profile + badge inserts in parallel --
    await Promise.all([
      supabase.from('profiles').upsert([{
        id: data.user.id,
        username,
        reputation: 0,
        total_points: 0,
        prediction_count: 0,
        correct_count: 0,
        streak: 0,
        best_streak: 0,
        accuracy_pct: 0,
        rank: 'Rookie',
        rank_icon: '&#x1F949;',
      }], { onConflict: 'id' }),

      isBeforeLaunch
        ? supabase.from('user_badges').insert({
            user_id: data.user.id,
            badge_type: 'founding_forecaster',
            badge_label: 'Founding Forecaster',
            badge_icon: '&#x1F3C5;',
            awarded_at: new Date().toISOString(),
          }).select()
        : Promise.resolve(),
    ])

    // -- Welcome email -- fire and forget, don't block redirect --
    fetch(`${origin}/api/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.user.email, username }),
    }).catch(e => console.error('Welcome email failed silently:', e))
  }

  // -- Redirect immediately --
  return NextResponse.redirect(`${origin}${next}`)
}
