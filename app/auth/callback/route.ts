import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/profile'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // ── Check if profile exists ──
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', data.user.id)
        .single()

      // ── Create profile if new Google user ──
      if (!profile) {
        const googleName = data.user.user_metadata?.full_name || ''
        const emailPrefix = data.user.email?.split('@')[0] || 'user'

        // Clean username from Google name or email
        const baseUsername = googleName
          ? googleName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
          : emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '')

        // Ensure unique username
        let username = baseUsername.slice(0, 20)
        const { data: existing } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single()

        if (existing) {
          username = `${username}_${Math.floor(Math.random() * 9999)}`
        }

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

        // Send welcome email
        try {
          await fetch(`${origin}/api/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.user.email, username }),
          })
        } catch (e) {
          console.error('Welcome email failed:', e)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=oauth_error`)
}
