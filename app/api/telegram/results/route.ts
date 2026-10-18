import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL = '@flipseer';

function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const COMP_EMOJI: { [k: string]: string } = {
  'EPL 2026/27': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UCL 2026/27': '⭐',
  'Liga 1 2026/27': '🇮🇩',
  'Ghana PL 2026/27': '🇬🇭',
  'ISL 2026/27': '🇮🇳',
};

const COMP_SHORT: { [k: string]: string } = {
  'EPL 2026/27': 'EPL',
  'UCL 2026/27': 'UCL',
  'Liga 1 2026/27': 'Liga 1',
  'Ghana PL 2026/27': 'Ghana PL',
  'ISL 2026/27': 'ISL',
};

async function sendTelegram(text: string) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    }
  );
  return res.json();
}

export async function GET(req: NextRequest) {
  // Auth check
  const secret = req.headers.get('x-cron-secret') ?? new URL(req.url).searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find finished matches not yet posted
  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, home_team, away_team, competition, home_score, away_score, tg_result_posted')
    .eq('status', 'finished')
    .eq('tg_result_posted', false)
    .not('home_score', 'is', null)
    .not('away_score', 'is', null)
    .order('id', { ascending: true })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!matches || matches.length === 0) return NextResponse.json({ posted: 0 });

  const posted: number[] = [];

  for (const match of matches) {
    // Get community prediction breakdown
    const { data: preds } = await supabase
      .from('predictions')
      .select('predicted_outcome, points_earned, prediction_processed')
      .eq('match_id', match.id);

    const total = preds?.length || 0;
    let homeW = 0, draw = 0, awayW = 0;
    (preds || []).forEach((p: any) => {
      if (p.predicted_outcome === 'home') homeW++;
      else if (p.predicted_outcome === 'draw') draw++;
      else if (p.predicted_outcome === 'away') awayW++;
    });

    const homePct = total > 0 ? Math.round((homeW / total) * 100) : 0;
    const drawPct = total > 0 ? Math.round((draw  / total) * 100) : 0;
    const awayPct = total > 0 ? Math.round((awayW / total) * 100) : 0;

    // Determine actual result
    const hs = match.home_score ?? 0;
    const as_ = match.away_score ?? 0;
    let actualResult = '';
    if (hs > as_)       actualResult = 'home';
    else if (as_ > hs)  actualResult = 'away';
    else                actualResult = 'draw';

    // Which outcome had the most community votes?
    let communityCall = '';
    let communityPct = 0;
    if (homeW >= draw && homeW >= awayW) { communityCall = 'home'; communityPct = homePct; }
    else if (awayW >= draw)              { communityCall = 'away'; communityPct = awayPct; }
    else                                 { communityCall = 'draw'; communityPct = drawPct; }

    const calledIt = communityCall === actualResult;
    const callLabel = actualResult === 'home'
      ? `${match.home_team} Win`
      : actualResult === 'away'
      ? `${match.away_team} Win`
      : 'Draw';
    const communityLabel = communityCall === 'home'
      ? `${match.home_team} Win`
      : communityCall === 'away'
      ? `${match.away_team} Win`
      : 'Draw';

    const flag = COMP_EMOJI[match.competition] || '⚽';
    const comp = COMP_SHORT[match.competition] || match.competition;
    const slug = slugify(match.home_team) + '-vs-' + slugify(match.away_team);
    const url  = `https://flipseer.com/matches/${slug}`;

    let predLine = '';
    if (total > 0) {
      predLine =
        `\n🔮 <b>Community predicted:</b> ${communityLabel} (${communityPct}%)\n` +
        (calledIt ? `✅ <b>Community called it!</b>` : `❌ Community got it wrong`);
    }

    const text =
      `${flag} <b>FULL TIME · ${comp}</b>\n\n` +
      `⚽ <b>${match.home_team} ${hs} – ${as_} ${match.away_team}</b>\n` +
      `🏁 Result: <b>${callLabel}</b>${predLine}\n\n` +
      `👀 Who called it? → ${url}\n\n` +
      `<i>#Flipseer #${comp.replace(/\s/g, '')} #Football</i>`;

    const result = await sendTelegram(text);

    if (result.ok) {
      await supabase
        .from('matches')
        .update({ tg_result_posted: true })
        .eq('id', match.id);
      posted.push(match.id);
    }
  }

  return NextResponse.json({ posted: posted.length, match_ids: posted });
}
