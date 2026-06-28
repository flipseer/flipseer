import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'World Cup 2026 Match Predictions | All 104 Matches | Flipseer',
  description: 'Predict all 104 FIFA World Cup 2026 matches before kickoff. Lock in your exact score, set your confidence, earn points for your nation. Free. No betting.',
  keywords: 'World Cup 2026 predictions, FIFA World Cup 2026 match prediction, predict world cup matches, world cup 2026 score prediction, football prediction 2026',
  alternates: { canonical: 'https://flipseer.com/world-cup-2026' },
  openGraph: {
    title: 'World Cup 2026 Match Predictions | Flipseer',
    description: 'Predict all 104 World Cup 2026 matches. Earn points for your nation. Build your permanent football record. Free.',
    url: 'https://flipseer.com/world-cup-2026',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
};

export default async function WorldCup2026Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch upcoming matches for SEO
  const { data: matches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, kickoff, status, league')
    .eq('competition', 'World Cup 2026')
    .in('status', ['upcoming', 'locked'])
    .order('kickoff', { ascending: true })
    .limit(16);

  const { count: totalMatches } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('competition', 'World Cup 2026');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    sport: 'Football',
    description: 'Predict World Cup 2026 matches on Flipseer. Free football prediction platform.',
    url: 'https://flipseer.com/world-cup-2026',
    organizer: {
      '@type': 'Organization',
      name: 'Flipseer',
      url: 'https://flipseer.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* SEO content for bots */}
      <div style={{ display: 'none' }}>
        <h1>World Cup 2026 Match Predictions</h1>
        <p>Predict all {totalMatches} World Cup 2026 matches on Flipseer. Free football prediction platform. No betting. Earn points for your nation.</p>
        <h2>Upcoming World Cup 2026 Matches</h2>
        <ul>
          {(matches || []).map((match: any) => (
            <li key={match.id}>
              <a href={`/matches/${match.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-')}`}>
                {match.home_team} vs {match.away_team} — World Cup 2026 Prediction
              </a>
            </li>
          ))}
        </ul>
        <p>
          <a href="/predict">Predict World Cup 2026 matches free</a> |
          <a href="/nations">World Cup 2026 Nation Battle</a> |
          <a href="/leaderboard">World Cup 2026 prediction leaderboard</a>
        </p>
      </div>

      {/* Visible content for users */}
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>WORLD CUP 2026</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 6vw, 48px)', marginBottom: '16px' }}>
            Predict All {totalMatches} World Cup 2026 Matches
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Lock in your exact score prediction before kickoff.<br />
            Earn points for your nation. Build your permanent football record.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <a href="/auth" style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
              Predict Free &#x2192;
            </a>
            <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: '16px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', border: '1px solid #1A3A1A' }}>
              Nation Battle
            </a>
          </div>

          {/* Upcoming matches list */}
          {(matches || []).length > 0 && (
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>UPCOMING MATCHES</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(matches || []).map((match: any) => {
                  const slug = `${match.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <a key={match.id} href={`/matches/${slug}`}
                      style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '14px 20px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                        {match.home_team} vs {match.away_team}
                      </span>
                      <span style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold' }}>Predict &#x2192;</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
