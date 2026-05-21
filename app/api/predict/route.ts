import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit by IP ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const limit = rateLimit(`predict:${ip}`, LIMITS.PREDICTIONS)
    
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many predictions. Please wait before trying again.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(limit.resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Get authenticated user ──
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { match_id, predicted_outcome, predicted_home_score, predicted_away_score, confidence_pct } = body

    // ── Validate inputs ──
    if (!match_id || !predicted_outcome || !confidence_pct) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['home', 'away', 'draw'].includes(predicted_outcome)) {
      return NextResponse.json({ error: 'Invalid outcome' }, { status: 400 })
    }

    if (confidence_pct < 1 || confidence_pct > 100) {
      return NextResponse.json({ error: 'Confidence must be 1-100' }, { status: 400 })
    }

    // ── Check match is still unlocked ──
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id, status, kickoff')
      .eq('id', match_id)
      .single()

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    if (match.status === 'locked' || match.status === 'completed') {
      return NextResponse.json({ error: 'Predictions are locked for this match' }, { status: 400 })
    }

    // ── Check kickoff hasn't passed ──
    if (new Date(match.kickoff) <= new Date()) {
      return NextResponse.json({ error: 'Match has already started' }, { status: 400 })
    }

    // ── Check for duplicate prediction ──
    const { data: existing } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', user.id)
      .eq('match_id', match_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'You have already predicted this match' }, { status: 400 })
    }

    // ── Save prediction with server timestamp ──
    const { data: prediction, error: predError } = await supabase
      .from('predictions')
      .insert([{
        user_id: user.id,
        match_id,
        predicted_outcome,
        predicted_home_score: predicted_home_score ?? null,
        predicted_away_score: predicted_away_score ?? null,
        confidence_pct,
        created_at: new Date().toISOString(), // server timestamp — cannot be manipulated
      }])
      .select()
      .single()

    if (predError) throw predError

    return NextResponse.json({ 
      success: true, 
      prediction,
      remaining: limit.remaining 
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
