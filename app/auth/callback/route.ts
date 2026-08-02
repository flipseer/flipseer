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

  // Check profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .single()

  const isNewUser = !profile

  if (isNewUser) {
    // Build username — works for Google, X/Twitter, and email
    const meta = data.user.user_metadata || {}

    // Google: full_name | X/Twitter: name or user_name | Email: email prefix
    const displayName = meta.full_name || meta.name || meta.user_name || ''
    const emailPrefix = data.user.email?.split('@')[0] || 'user'

    const base = displayName
      ? displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      : emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '')

    const username = `${base.slice(0, 15)}_${Date.now().toString().slice(-4)}`

    // Detect country from X profile location if available
    // (X sometimes provides location but not reliably — skip for now)

    // Run profile insert
    await supabase.from('profiles').upsert([{
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
      rank_icon: '🥉',
    }], { onConflict: 'id' })

    // Welcome email — fire and forget
    fetch(`${origin}/api/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.user.email || '',
        username,
        country: null,
      }),
    }).catch(e => console.error('Welcome email failed silently:', e))

    // New users → predict page to start predicting EPL
    return NextResponse.redirect(`${origin}/predict?welcome=1`)
  }

  // Returning users → wherever they were going
  return NextResponse.redirect(`${origin}${next}`)
}
