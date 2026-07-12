import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import MatchPageClient from './MatchPageClient';

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

  return {
    title: `${home} vs ${away} Predictions | World Cup 2026 | Flipseer`,
    description: `See what football fans predict for ${home} vs ${away}. Community prediction percentages, top forecasters, exact score predictions. Free. No betting.`,
    keywords: `${home} vs ${away} prediction, ${home} ${away} World Cup 2026, ${home} vs ${away} forecast, football prediction ${home} ${away}`,
    alternates: {
      canonical: `https://flipseer.com/matches/${params.match}`,
    },
    openGraph: {
      title: `${home} vs ${away} — World Cup 2026 Predictions | Flipseer`,
      description: `What are football fans predicting for ${home} vs ${away}? See community split, top forecasters and exact score predictions on Flipseer.`,
      url: `https://flipseer.com/matches/${params.match}`,
      images: [{ url: `https://flipseer.com/api/og/home`, width: 1200, height: 630 }],
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    const { data: preds } = await supabase
      .from('predictions')
      .select('predicted_outcome, confidence_pct, predicted_home_score, predicted_away_score, profiles(username, country, total_points)')
      .eq('match_id', match.id)
      .eq('prediction_processed', false) // Only show pending (hide results)
      .order('confidence_pct', { ascending: false })
      .limit(10);

    predictions = preds || [];

    // Community stats
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
