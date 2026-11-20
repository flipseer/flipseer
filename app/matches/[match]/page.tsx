import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import MatchPageClient from './MatchPageClient';

// ISR: revalidate every 5 minutes for upcoming/live matches.
// Completed matches rarely change — but 5 min is safe for all states.
export const revalidate = 300;

type Props = { params: { match: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.match;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: matches } = await supabase
    .from('matches')
    .select('home_team, away_team, competition, kickoff, home_score, away_score, status')
    .eq('slug', slug)
    .limit(1);

  const match = matches?.[0];
  const home = match?.home_team || '';
  const away = match?.away_team || '';

  if (!home || !away) return { title: 'Match Not Found | Flipseer' };

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
      canonical: `https://flipseer.com/matches/${slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://flipseer.com/matches/${slug}`,
      images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630, alt: `${home} vs ${away} — Flipseer` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    },
  };
}

export default async function MatchPage({ params }: Props) {
  const slug = params.match;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('slug', slug)
    .limit(1);

  const match = matches?.[0] || null;

  if (!match) {
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

  const home = match.home_team;
  const away = match.away_team;

  let predictions: any[] = [];
  let communityStats = { home: 0, draw: 0, away: 0, total: 0 };

  const { data: preds } = await supabase
    .from('predictions')
    .select('predicted_outcome, confidence_pct, predicted_home_score, predicted_away_score, profiles(username, country, total_points)')
    .eq('match_id', match.id)
    .order('confidence_pct', { ascending: false })
    .limit(10);

  predictions = preds || [];

  const { data: allPreds } = await supabase
    .from('predictions')
    .select('predicted_outcome')
    .eq('match_id', match.id);

  (allPreds || []).forEach((p: any) => {
    communityStats[p.predicted_outcome as 'home' | 'draw' | 'away']++;
    communityStats.total++;
  });

  // Fetch last 5 H2H results from matches table (completed only)
  let h2hMatches: any[] = [];
  const { data: h2hData } = await supabase
    .from('matches')
    .select('home_team, away_team, home_score, away_score, kickoff, home_team_logo, away_team_logo')
    .eq('status', 'completed')
    .or(
      `and(home_team.eq.${home},away_team.eq.${away}),and(home_team.eq.${away},away_team.eq.${home})`
    )
    .order('kickoff', { ascending: false })
    .limit(5);
  h2hMatches = h2hData || [];

  // Related Liga 1 matches for internal linking
  let relatedMatches: { slug: string; home_team: string; away_team: string; kickoff: string | null }[] = [];
  if (match.competition?.includes('Liga 1')) {
    const { data: related } = await supabase
      .from('matches')
      .select('slug, home_team, away_team, kickoff')
      .ilike('competition', '%Liga 1%')
      .neq('slug', slug)
      .in('status', ['upcoming', 'live'])
      .order('kickoff', { ascending: true })
      .limit(4);
    relatedMatches = related || [];
  }

  return (
    <MatchPageClient
      home={home}
      away={away}
      slug={slug}
      match={match}
      predictions={predictions}
      communityStats={communityStats}
      h2hMatches={h2hMatches}
      relatedMatches={relatedMatches}
    />
  );
}
