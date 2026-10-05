import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import MatchPageClient from './MatchPageClient';

export const dynamic = 'force-dynamic';

type Props = { params: { match: string } };

function parseSlug(slug: string): { home: string; away: string } {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return { home: '', away: '' };
  const toName = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { home: toName(parts[0]), away: toName(parts[1]) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { home, away } = parseSlug(params.match);
  if (!home || !away) return { title: 'Match Not Found | Flipseer' };

  // Fetch match to get competition name for metadata
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: matches } = await supabase
    .from('matches')
    .select('competition, kickoff, home_score, away_score, status')
    .ilike('home_team', home)
    .ilike('away_team', away)
    .limit(1);

  const match = matches?.[0];
  const competition = match?.competition?.replace(' 2026/27', '') || 'Football';
  const isCompleted = match?.status === 'completed';
  const resultStr = isCompleted && match?.home_score !== null
    ? ` | Result: ${match.home_score}-${match.away_score}`
    : '';

  const title = `${home} vs ${away} Prediction | ${competition} | Flipseer`;
  const desc = isCompleted
    ? `${home} ${match?.home_score}-${match?.away_score} ${away}${resultStr}. See what Flipseer fans predicted before kickoff. Build your own football reputation. Free.`
    : `Predict ${home} vs ${away} before kickoff. Lock your ${competition} prediction permanently. Build your football reputation on Flipseer. Free. No betting.`;

  return {
    title,
    description: desc,
    keywords: `${home} vs ${away} prediction, ${home} ${away} ${competition}, ${home} vs ${away} forecast, football prediction`,
    alternates: {
      canonical: `https://flipseer.com/matches/${params.match}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://flipseer.com/matches/${params.match}`,
      images: [{ url: `https://flipseer.com/api/og/home`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    },
  };
}

export default async function MatchPage({ params }: Props) {
  const { home, away } = parseSlug(params.match);

  if (!home || !away) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Match not found</h1>
          <a href="/predict" style={{ color: '#2E9E5E' }}>View all matches →</a>
        </div>
      </main>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find the match
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .ilike('home_team', home)
    .ilike('away_team', away)
    .limit(1);

  const match = matches?.[0] || null;

  // Get predictions for this match
  let predictions: any[] = [];
  let communityStats = { home: 0, draw: 0, away: 0, total: 0 };

  if (match) {
    // Show all predictions — not filtered by processed status
    // This ensures completed match pages have content for Google
    const { data: preds } = await supabase
      .from('predictions')
      .select('predicted_outcome, confidence_pct, predicted_home_score, predicted_away_score, profiles(username, country, total_points)')
      .eq('match_id', match.id)
      .order('confidence_pct', { ascending: false })
      .limit(10);

    predictions = preds || [];

    // Community stats — all predictions
    const { data: allPreds } = await supabase
      .from('predictions')
      .select('predicted_outcome')
      .eq('match_id', match.id);

    (allPreds || []).forEach((p: any) => {
      communityStats[p.predicted_outcome as 'home' | 'draw' | 'away']++;
      communityStats.total++;
    });
  }

  return (
    <MatchPageClient
      home={home}
      away={away}
      slug={params.match}
      match={match}
      predictions={predictions}
      communityStats={communityStats}
    />
  );
}
