import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const runtime = 'nodejs';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ACTIVE_COMPETITIONS = [
  'EPL 2026/27',
  'UCL 2026/27',
  'Liga 1 2026/27',
  'NPFL 2026/27',
  'Ghana PL 2026/27',
  'ISL 2026/27',
]

const COMPETITION_META: { [key: string]: { emoji: string; label: string; color: string } } = {
  'EPL 2026/27':      { emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'Premier League 2026/27',   color: '#8B5CF6' },
  'UCL 2026/27':      { emoji: '⭐',           label: 'UEFA Champions League',    color: '#A78BFA' },
  'Liga 1 2026/27':   { emoji: '🇮🇩',           label: 'Liga 1 Indonesia',         color: '#EF4444' },
  'NPFL 2026/27':     { emoji: '🇳🇬',           label: 'NPFL Nigeria',             color: '#2E9E5E' },
  'Ghana PL 2026/27': { emoji: '🇬🇭',           label: 'Ghana Premier League',     color: '#F59E0B' },
  'World Cup 2026':   { emoji: '🏆',           label: 'FIFA World Cup 2026',      color: '#F59E0B' },
  'ISL 2026/27':      { emoji: '🇮🇳',           label: 'Indian Super League',      color: '#FF6B35' },
}

export async function POST(req: NextRequest) {
  try {
    const cronSecret = req.headers.get('x-cron-secret');
    const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null
      || req.headers.get('user-agent')?.includes('vercel');
    const validCron = cronSecret === process.env.CRON_SECRET;
    if (!validCron && !isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const match_id = Number(body.match_id);
    if (!match_id) {
      return NextResponse.json({ error: 'match_id required' }, { status: 400 });
    }
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single();
    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found', match_id }, { status: 404 });
    }
    if (!ACTIVE_COMPETITIONS.includes(match.competition)) {
      return NextResponse.json({
        success: true,
        message: 'Notifications skipped — ' + match.competition + ' not active for notifications yet',
        sent: 0,
      });
    }
    const meta = COMPETITION_META[match.competition] || { emoji: '⚽', label: match.competition, color: '#8B5CF6' }
    const headerEmoji = meta.emoji

    const { data: predictionsRaw, error: predError } = await supabaseAdmin
      .from('predictions')
      .select('*')
      .eq('match_id', match_id)
      .eq('prediction_processed', true);
    const predictions = predictionsRaw || [];
    if (predictions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No processed predictions',
        sent: 0,
        debug: { match_id, pred_count: 0, error: predError?.message }
      });
    }

    // ── Send web push notifications ──
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://flipseer.com';
    let pushSent = 0;
    try {
      const pushRes = await fetch(origin + '/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.CRON_SECRET || ''}`,
        },
        body: JSON.stringify({
          title: `${headerEmoji} ${meta.label} Result`,
          body: `${match.home_team} ${match.home_score}–${match.away_score} ${match.away_team} · See how you scored`,
          url: `https://flipseer.com/results`,
        }),
      });
      if (pushRes.ok) {
        const pushData = await pushRes.json();
        pushSent = pushData.sent || 0;
      }
    } catch (e: any) {
      console.error('Push send error:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Push notifications sent',
      push_sent: pushSent,
      total_predictions: predictions.length,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
