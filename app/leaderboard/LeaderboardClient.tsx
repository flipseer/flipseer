import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import LeaderboardClient from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Football Prediction Leaderboard | EPL · UCL · Liga 1 · Ghana PL | Flipseer',
  description: 'Top football predictors on Flipseer. Global and country leaderboards ranked by prediction accuracy and REP points. EPL, UCL, Liga 1 and Ghana PL. Free forever.',
  keywords: 'football prediction leaderboard, EPL predictions ranking, UCL predictions leaderboard, best football predictors, football forecaster rankings, Ghana Premier League predictions',
  alternates: { canonical: 'https://flipseer.com/leaderboard' },
  openGraph: {
    title: 'Football Prediction Leaderboard | Flipseer',
    description: 'Who are the top football predictors in the world? See global and country leaderboards across EPL, UCL, Liga 1 and Ghana PL.',
    url: 'https://flipseer.com/leaderboard',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
};

export default async function LeaderboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: leaders } = await supabase
    .from('profiles')
    .select('id, username, total_points, prediction_count, correct_count, accuracy_pct, rank, rank_icon, country')
    .gt('prediction_count', 0)
    .order('total_points', { ascending: false })
    .limit(20);

  const topLeaders = leaders || [];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Football Prediction Leaderboard — EPL · UCL · Liga 1 · Ghana PL',
    description: 'Top football predictors ranked by accuracy and REP points across EPL, UCL, Liga 1 and Ghana PL on Flipseer',
    numberOfItems: topLeaders.length,
    itemListElement: topLeaders.slice(0, 10).map((leader, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: leader.username,
      description: `${leader.total_points} REP · ${leader.accuracy_pct}% accuracy · ${leader.prediction_count} predictions`,
      url: `https://flipseer.com/u/${leader.username}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div style={{ display: 'none' }}>
        <h1>Football Prediction Leaderboard — EPL, UCL, Liga 1, Ghana PL | Flipseer</h1>
        <p>Top football predictors competing across EPL 2026/27, UCL 2026/27, Liga 1 Indonesia and Ghana Premier League on Flipseer. Free prediction platform. No betting. Build your permanent Football Reputation.</p>
        <ol>
          {topLeaders.slice(0, 10).map((leader, i) => (
            <li key={leader.id}>
              #{i + 1} <a href={`/u/${leader.username}`}>@{leader.username}</a>
              {' '}- {leader.total_points} REP, {leader.accuracy_pct}% accuracy
            </li>
          ))}
        </ol>
      </div>
      <LeaderboardClient initialLeaders={topLeaders} />
    </>
  );
}
