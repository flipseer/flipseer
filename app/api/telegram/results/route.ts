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

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find matches just completed but not yet posted
  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, home_team, away_team, home_score, away_score, competition, telegram_result_sent')
    .eq('status', 'completed')
    .eq('telegram_result_sent', false)
    .not('home_score', 'is', null)
    .not('away_score', 'is', null)
    .order('kickoff', { ascending: false })
    .limit(5);

  if (error || !matches || matches.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No new results to post' });
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

    // Determine actual outcome
    const actualOutcome = match.home_score > match.away_score ? 'home'
      : match.away_score > match.home_score ? 'away'
      : 'draw';

    const outcomeName = actualOutcome === 'home' ? `${match.home_team} Win`
      : actualOutcome === 'away' ? `${match.away_team} Win`
      : 'Draw';

    const majorityPrediction = stats.home >= stats.draw && stats.home >= stats.away ? 'home'
      : stats.away >= stats.draw && stats.away >= stats.home ? 'away'
      : 'draw';

    const communityWasRight = majorityPrediction === actualOutcome;
    const majorityPct = getPct(stats[majorityPrediction]);

    const competition = match.competition?.replace(' 2026/27', '') || 'Football';
    const slug = `${toSlug(match.home_team)}-vs-${toSlug(match.away_team)}`;

    let predLine = '';
    if (stats.total > 0) {
      const verdict = communityWasRight ? '✅ Community called it!' : '❌ Community got it wrong';
      predLine = `\n\n🔮 <b>Flipseer predicted:</b> ${outcomeName === 'Draw' ? 'Draw' : outcomeName} ${majorityPct}% — ${verdict}`;
    }

    const message = `🏁 <b>FULL TIME — ${competition}</b>\n\n<b>${match.home_team} ${match.home_score}–${match.away_score} ${match.away_team}</b>${predLine}\n\n👀 Who called it?\nhttps://flipseer.com/matches/${slug}\n\n<i>#Flipseer #${competition.replace(/\s/g, '')}</i>`;

    const tgResult = await sendTelegramMessage(message);

    if (tgResult.ok) {
      await supabase
        .from('matches')
        .update({ telegram_result_sent: true })
        .eq('id', match.id);

      results.push({ match: slug, sent: true });
    } else {
      results.push({ match: slug, sent: false, error: tgResult });
    }
  }

  return NextResponse.json({ sent: results.filter(r => r.sent).length, results });
}
