import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const DAILY_PREDICTION_LIMIT = 8

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

    // ── ✅ Check daily prediction limit (5 per day) ──
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { count: todayCount } = await supabase
      .from('predictions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())

    if ((todayCount ?? 0) >= DAILY_PREDICTION_LIMIT) {
      return NextResponse.json(
        {
          error: `Daily limit reached. You can make ${DAILY_PREDICTION_LIMIT} predictions per day. Come back tomorrow!`,
          daily_limit: DAILY_PREDICTION_LIMIT,
          used_today: todayCount,
          resets_at: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
        { status: 429 }
      )
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

    // ── FIX: 'live' was missing here — without it, a match that has already
    // kicked off (status flipped to 'live' by match-processor based on
    // real-time API data) could still accept NEW predictions if the stored
    // `kickoff` timestamp happens to be later than the real kickoff time
    // (e.g. due to a seeding/timezone error). This closes that gap
    // regardless of whether `kickoff` is accurate. ──
    if (['locked', 'live', 'completed', 'cancelled'].includes(match.status)) {
      return NextResponse.json({ error: 'Predictions are locked for this match' }, { status: 400 })
    }

    // ── Check kickoff hasn't passed (secondary safeguard) ──
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
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (predError) throw predError

    const remainingToday = DAILY_PREDICTION_LIMIT - ((todayCount ?? 0) + 1)

    return NextResponse.json({
      success: true,
      prediction,
      daily_limit: DAILY_PREDICTION_LIMIT,
      used_today: (todayCount ?? 0) + 1,
      remaining_today: remainingToday,
      ip_remaining: limit.remaining,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
