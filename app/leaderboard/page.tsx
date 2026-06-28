import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import LeaderboardClient from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Football Prediction Leaderboard | World Cup 2026 | Flipseer',
  description: 'Top football predictors for World Cup 2026. Global and country leaderboards ranked by prediction accuracy and points. Free football prediction platform.',
  keywords: 'football prediction leaderboard, World Cup 2026 predictions ranking, best football predictors, football forecaster rankings, India football predictions leaderboard',
  alternates: { canonical: 'https://flipseer.com/leaderboard' },
  openGraph: {
    title: 'Football Prediction Leaderboard | World Cup 2026 | Flipseer',
    description: 'Who are the top football predictors in the world? See global and country leaderboards for World Cup 2026.',
    url: 'https://flipseer.com/leaderboard',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
};

export default async function LeaderboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Server-side fetch — bots see real data
  const { data: leaders } = await supabase
    .from('profiles')
    .select('id, username, total_points, prediction_count, correct_count, accuracy_pct, rank, rank_icon, country')
    .gt('prediction_count', 0)
    .order('total_points', { ascending: false })
    .limit(20);

  const topLeaders = leaders || [];

  // Structured data for Google
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'World Cup 2026 Football Prediction Leaderboard',
    description: 'Top football predictors ranked by accuracy and points for World Cup 2026',
    numberOfItems: topLeaders.length,
    itemListElement: topLeaders.slice(0, 10).map((leader, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: leader.username,
      description: `${leader.total_points} points · ${leader.accuracy_pct}% accuracy · ${leader.prediction_count} predictions`,
      url: `https://flipseer.com/u/${leader.username}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hidden SEO content — bots read this */}
      <div style={{ display: 'none' }}>
        <h1>World Cup 2026 Football Prediction Leaderboard</h1>
        <p>Top football predictors competing in World Cup 2026 on Flipseer. Free prediction platform with no betting.</p>
        <ol>
          {topLeaders.slice(0, 10).map((leader, i) => (
            <li key={leader.id}>
              #{i + 1} <a href={`/u/${leader.username}`}>@{leader.username}</a>
              {' '}- {leader.total_points} points, {leader.accuracy_pct}% accuracy
            </li>
          ))}
        </ol>
      </div>
      {/* Client component for interactive UI */}
      <LeaderboardClient initialLeaders={topLeaders} />
    </>
  );
}
