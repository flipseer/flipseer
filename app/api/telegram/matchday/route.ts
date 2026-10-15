import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL = '@flipseer';
const CRON_SECRET = process.env.CRON_SECRET!;

async function sendTelegramMessage(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    }),
  });
  return res.json();
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function formatKickoffIST(kickoff: string): string {
  const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
  return new Date(utc).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export async function GET(req: Request) {
  // Verify cron secret
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find matches kicking off in the next 60–90 minutes
  const now = new Date();
  const from = new Date(now.getTime() + 55 * 60 * 1000);  // 55 min from now
  const to = new Date(now.getTime() + 90 * 60 * 1000);    // 90 min from now

  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, home_team, away_team, kickoff, competition, telegram_matchday_sent')
    .in('status', ['upcoming', 'locked'])
    .gte('kickoff', from.toISOString())
    .lte('kickoff', to.toISOString())
    .eq('telegram_matchday_sent', false);

  if (error || !matches || matches.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No upcoming matches in window' });
  }

  const results = [];

  for (const match of matches) {
    // Get community prediction stats
    const { data: preds } = await supabase
      .from('predictions')
      .select('predicted_outcome')
      .eq('match_id', match.id);

    const stats = { home: 0, draw: 0, away: 0, total: 0 };
    (preds || []).forEach((p: any) => {
      stats[p.predicted_outcome as 'home' | 'draw' | 'away']++;
      stats.total++;
    });

    const getPct = (n: number) => stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);
    const homePct = getPct(stats.home);
    const drawPct = getPct(stats.draw);
    const awayPct = getPct(stats.away);

    const competition = match.competition?.replace(' 2026/27', '') || 'Football';
    const slug = `${toSlug(match.home_team)}-vs-${toSlug(match.away_team)}`;
    const kickoffStr = formatKickoffIST(match.kickoff);

    let predLine = '';
    if (stats.total > 0) {
      predLine = `\n\n🔮 <b>Community says (${stats.total} predictions):</b>\n🟢 ${match.home_team} Win — ${homePct}%\n⚪ Draw — ${drawPct}%\n🔵 ${match.away_team} Win — ${awayPct}%`;
    }

    const message = `⚽ <b>MATCHDAY — ${competition}</b>\n\n<b>${match.home_team} vs ${match.away_team}</b>\n🕐 ${kickoffStr} IST${predLine}\n\n🔒 Predict before kickoff 👇\nhttps://flipseer.com/matches/${slug}\n\n<i>Free. No betting. Pure football.</i>`;

    const tgResult = await sendTelegramMessage(message);

    if (tgResult.ok) {
      // Mark as sent so we don't double-post
      await supabase
        .from('matches')
        .update({ telegram_matchday_sent: true })
        .eq('id', match.id);

      results.push({ match: slug, sent: true });
    } else {
      results.push({ match: slug, sent: false, error: tgResult });
    }
  }

  return NextResponse.json({ sent: results.filter(r => r.sent).length, results });
}
