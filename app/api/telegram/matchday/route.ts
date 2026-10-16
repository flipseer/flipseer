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

  // Find matches starting in the next 2–3 hours that haven't been announced yet
  const now = new Date();
  const windowStart = new Date(now.getTime() + 90 * 60 * 1000);   // 1.5h from now
  const windowEnd   = new Date(now.getTime() + 180 * 60 * 1000);  // 3h from now

  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, home_team, away_team, kickoff, competition, tg_prematch_posted')
    .in('competition', ['EPL 2026/27', 'UCL 2026/27', 'Liga 1 2026/27', 'Ghana PL 2026/27', 'ISL 2026/27'])
    .eq('status', 'upcoming')
    .eq('tg_prematch_posted', false)
    .gte('kickoff', windowStart.toISOString())
    .lte('kickoff', windowEnd.toISOString())
    .order('kickoff', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!matches || matches.length === 0) return NextResponse.json({ posted: 0 });

  const posted: number[] = [];

  for (const match of matches) {
    // Get community prediction breakdown
    const { data: preds } = await supabase
      .from('predictions')
      .select('predicted_outcome')
      .eq('match_id', match.id);

    const total = preds?.length || 0;
    let homeW = 0, draw = 0, awayW = 0;
    (preds || []).forEach((p: any) => {
      if (p.predicted_outcome === 'home') homeW++;
      else if (p.predicted_outcome === 'draw') draw++;
      else if (p.predicted_outcome === 'away') awayW++;
    });

    const homePct  = total > 0 ? Math.round((homeW / total) * 100) : 0;
    const drawPct  = total > 0 ? Math.round((draw  / total) * 100) : 0;
    const awayPct  = total > 0 ? Math.round((awayW / total) * 100) : 0;

    const utc = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
    const diffMs = new Date(utc).getTime() - now.getTime();
    const diffH  = Math.floor(diffMs / 3600000);
    const diffM  = Math.floor((diffMs % 3600000) / 60000);
    const timeStr = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m`;

    const flag  = COMP_EMOJI[match.competition]  || '⚽';
    const comp  = COMP_SHORT[match.competition]  || match.competition;
    const slug  = slugify(match.home_team) + '-vs-' + slugify(match.away_team);
    const url   = `https://flipseer.com/matches/${slug}`;

    let predLine = '';
    if (total > 0) {
      predLine = `\n🔮 <b>Community prediction</b> (${total} forecasters)\n` +
        `🏠 ${match.home_team} Win — <b>${homePct}%</b>\n` +
        `🤝 Draw — <b>${drawPct}%</b>\n` +
        `✈️ ${match.away_team} Win — <b>${awayPct}%</b>`;
    } else {
      predLine = `\n🔮 No predictions yet — be the first!`;
    }

    const text =
      `${flag} <b>${comp} · MATCHDAY</b>\n\n` +
      `⚽ <b>${match.home_team} vs ${match.away_team}</b>\n` +
      `⏱ Kicks off in <b>${timeStr}</b>${predLine}\n\n` +
      `👉 Lock your prediction → ${url}\n\n` +
      `<i>Free forever · No betting · Pure football</i>`;

    const result = await sendTelegram(text);

    if (result.ok) {
      await supabase
        .from('matches')
        .update({ tg_prematch_posted: true })
        .eq('id', match.id);
      posted.push(match.id);
    }
  }

  return NextResponse.json({ posted: posted.length, match_ids: posted });
}
