import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import NationPageClientV2 from './NationPageClientV2';

const COUNTRY_DATA: { [key: string]: { name: string; code: string; flag: string; adjective: string; rivals: string[]; slug: string } } = {
  'india': { name: 'India', code: 'IN', flag: '🇮🇳', adjective: 'Indian', rivals: ['indonesia', 'nigeria', 'brazil'], slug: 'india' },
  'indonesia': { name: 'Indonesia', code: 'ID', flag: '🇮🇩', adjective: 'Indonesian', rivals: ['india', 'nigeria', 'brazil'], slug: 'indonesia' },
  'nigeria': { name: 'Nigeria', code: 'NG', flag: '🇳🇬', adjective: 'Nigerian', rivals: ['ghana', 'brazil', 'england'], slug: 'nigeria' },
  'brazil': { name: 'Brazil', code: 'BR', flag: '🇧🇷', adjective: 'Brazilian', rivals: ['argentina', 'france', 'germany'], slug: 'brazil' },
  'argentina': { name: 'Argentina', code: 'AR', flag: '🇦🇷', adjective: 'Argentinian', rivals: ['brazil', 'france', 'england'], slug: 'argentina' },
  'england': { name: 'England', code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', adjective: 'English', rivals: ['france', 'germany', 'argentina'], slug: 'england' },
  'france': { name: 'France', code: 'FR', flag: '🇫🇷', adjective: 'French', rivals: ['england', 'germany', 'spain'], slug: 'france' },
  'germany': { name: 'Germany', code: 'DE', flag: '🇩🇪', adjective: 'German', rivals: ['france', 'england', 'spain'], slug: 'germany' },
  'spain': { name: 'Spain', code: 'ES', flag: '🇪🇸', adjective: 'Spanish', rivals: ['portugal', 'france', 'germany'], slug: 'spain' },
  'portugal': { name: 'Portugal', code: 'PT', flag: '🇵🇹', adjective: 'Portuguese', rivals: ['spain', 'france', 'brazil'], slug: 'portugal' },
  'mexico': { name: 'Mexico', code: 'MX', flag: '🇲🇽', adjective: 'Mexican', rivals: ['usa', 'argentina', 'brazil'], slug: 'mexico' },
  'usa': { name: 'USA', code: 'US', flag: '🇺🇸', adjective: 'American', rivals: ['mexico', 'england', 'brazil'], slug: 'usa' },
  'ghana': { name: 'Ghana', code: 'GH', flag: '🇬🇭', adjective: 'Ghanaian', rivals: ['nigeria', 'senegal', 'morocco'], slug: 'ghana' },
  'morocco': { name: 'Morocco', code: 'MA', flag: '🇲🇦', adjective: 'Moroccan', rivals: ['senegal', 'nigeria', 'france'], slug: 'morocco' },
  'japan': { name: 'Japan', code: 'JP', flag: '🇯🇵', adjective: 'Japanese', rivals: ['south-korea', 'australia', 'brazil'], slug: 'japan' },
  'south-korea': { name: 'South Korea', code: 'KR', flag: '🇰🇷', adjective: 'Korean', rivals: ['japan', 'australia', 'germany'], slug: 'south-korea' },
  'australia': { name: 'Australia', code: 'AU', flag: '🇦🇺', adjective: 'Australian', rivals: ['japan', 'south-korea', 'england'], slug: 'australia' },
  'pakistan': { name: 'Pakistan', code: 'PK', flag: '🇵🇰', adjective: 'Pakistani', rivals: ['india', 'saudi-arabia', 'indonesia'], slug: 'pakistan' },
  'bangladesh': { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', adjective: 'Bangladeshi', rivals: ['india', 'indonesia', 'nigeria'], slug: 'bangladesh' },
  'egypt': { name: 'Egypt', code: 'EG', flag: '🇪🇬', adjective: 'Egyptian', rivals: ['morocco', 'nigeria', 'senegal'], slug: 'egypt' },
  'senegal': { name: 'Senegal', code: 'SN', flag: '🇸🇳', adjective: 'Senegalese', rivals: ['nigeria', 'ghana', 'morocco'], slug: 'senegal' },
  'south-africa': { name: 'South Africa', code: 'ZA', flag: '🇿🇦', adjective: 'South African', rivals: ['nigeria', 'ghana', 'morocco'], slug: 'south-africa' },
  'saudi-arabia': { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', adjective: 'Saudi', rivals: ['egypt', 'pakistan', 'indonesia'], slug: 'saudi-arabia' },
  'turkey': { name: 'Turkey', code: 'TR', flag: '🇹🇷', adjective: 'Turkish', rivals: ['germany', 'france', 'croatia'], slug: 'turkey' },
  'norway': { name: 'Norway', code: 'NO', flag: '🇳🇴', adjective: 'Norwegian', rivals: ['sweden', 'england', 'germany'], slug: 'norway' },
};

type Props = { params: { nation: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.nation.toLowerCase();
  const country = COUNTRY_DATA[slug];
  if (!country) return { title: 'Nation Not Found | Flipseer' };

  return {
    title: `${country.name} Football Reputation | World Cup 2026 | Flipseer`,
    description: `${country.name} forecasters building their football reputation on Flipseer. See ${country.name}'s global ranking, top predictors, accuracy stats and recent activity. Free. No betting.`,
    keywords: `${country.name} football predictions, ${country.name} World Cup 2026, ${country.adjective} football predictor, ${country.name} nation battle, football prediction ${country.name}, ${country.name} football reputation`,
    alternates: {
      canonical: `https://flipseer.com/${slug}`,
      languages: {
        'en': `https://flipseer.com/${slug}`,
        'en-IN': slug === 'india' ? `https://flipseer.com/india` : undefined,
        'en-NG': slug === 'nigeria' ? `https://flipseer.com/nigeria` : undefined,
        'en-ID': slug === 'indonesia' ? `https://flipseer.com/indonesia` : undefined,
        'en-GH': slug === 'ghana' ? `https://flipseer.com/ghana` : undefined,
        'en-BR': slug === 'brazil' ? `https://flipseer.com/brazil` : undefined,
        'en-AR': slug === 'argentina' ? `https://flipseer.com/argentina` : undefined,
        'en-GB': slug === 'england' ? `https://flipseer.com/england` : undefined,
        'x-default': `https://flipseer.com/${slug}`,
      },
    },
    openGraph: {
      title: `${country.flag} ${country.name} — World Cup 2026 Football Reputation | Flipseer`,
      description: `${country.name} forecasters competing globally. Every correct prediction earns points for ${country.name}. Build your permanent football reputation.`,
      url: `https://flipseer.com/${slug}`,
      images: [{ url: `https://flipseer.com/api/og/home`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${country.name} Football Reputation | World Cup 2026 | Flipseer`,
      description: `${country.name} forecasters competing globally on Flipseer. Free. No betting.`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(COUNTRY_DATA).map(nation => ({ nation }));
}

export default async function NationPage({ params }: Props) {
  const slug = params.nation.toLowerCase();
  const country = COUNTRY_DATA[slug];

  if (!country) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Nation not found</h1>
          <a href="/nations" style={{ color: '#2E9E5E' }}>View all nations →</a>
        </div>
      </main>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Parallel data fetch
  const [
    { data: nationProfiles },
    { data: allProfiles },
    { data: recentPredictions },
    { data: nationMatches },
  ] = await Promise.all([
    // Top forecasters for this nation
    supabase.from('profiles')
      .select('id, username, total_points, accuracy_pct, prediction_count, correct_count, rank, rank_icon')
      .eq('country', country.code)
      .gt('prediction_count', 0)
      .order('total_points', { ascending: false })
      .limit(10),

    // All profiles for nation ranking
    supabase.from('profiles')
      .select('country, total_points, accuracy_pct, prediction_count, correct_count')
      .gt('total_points', 0),

    // Recent predictions from this nation
    supabase.from('predictions')
      .select('predicted_outcome, confidence_pct, points_earned, prediction_processed, created_at, profiles(username, country), matches(home_team, away_team)')
      .eq('profiles.country', country.code)
      .order('created_at', { ascending: false })
      .limit(5),

    // Recent matches for internal links
    supabase.from('matches')
      .select('home_team, away_team, kickoff, status')
      .eq('competition', 'World Cup 2026')
      .in('status', ['upcoming', 'completed'])
      .order('kickoff', { ascending: false })
      .limit(6),
  ]);

  // Calculate nation stats
  const countryMap: { [key: string]: { points: number; forecasters: number; predictions: number; correct: number } } = {};
  (allProfiles || []).forEach((p: any) => {
    const c = p.country || 'OTHER';
    if (!countryMap[c]) countryMap[c] = { points: 0, forecasters: 0, predictions: 0, correct: 0 };
    countryMap[c].points += p.total_points || 0;
    countryMap[c].forecasters += 1;
    countryMap[c].predictions += p.prediction_count || 0;
    countryMap[c].correct += p.correct_count || 0;
  });

  const ranked = Object.entries(countryMap).sort((a, b) => b[1].points - a[1].points);
  const nationRank = ranked.findIndex(([c]) => c === country.code) + 1;
  const nationStats = countryMap[country.code] || { points: 0, forecasters: 0, predictions: 0, correct: 0 };
  const avgAccuracy = nationStats.predictions > 0
    ? Math.round((nationStats.correct / nationStats.predictions) * 100)
    : 0;

  // Exact score count from nation profiles
  const nationProfilesList = nationProfiles || [];
  const totalNationPredictions = nationStats.predictions;
  const totalNationPoints = nationStats.points;

  // Build rival nation data
  const rivalData = country.rivals.map(rivalSlug => {
    const rivalCountry = COUNTRY_DATA[rivalSlug];
    if (!rivalCountry) return null;
    const rivalStats = countryMap[rivalCountry.code];
    const rivalRank = ranked.findIndex(([c]) => c === rivalCountry.code) + 1;
    return {
      slug: rivalSlug,
      name: rivalCountry.name,
      flag: rivalCountry.flag,
      rank: rivalRank,
      points: rivalStats?.points || 0,
    };
  }).filter(Boolean);

  // SEO structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: `${country.name} Football Prediction Community`,
    sport: 'Football',
    description: `${country.name} forecasters building football reputation on Flipseer during World Cup 2026`,
    url: `https://flipseer.com/${slug}`,
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'Flipseer Nation Battle',
      url: 'https://flipseer.com/nations',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hidden SEO content */}
      <div style={{ display: 'none' }}>
        <h1>{country.name} Football Reputation — World Cup 2026</h1>
        <p>
          {nationStats.forecasters} {country.adjective} football forecasters competing globally on Flipseer.
          {country.name} is ranked #{nationRank} in the World Cup 2026 Nation Battle with {totalNationPoints} points
          from {totalNationPredictions} predictions at {avgAccuracy}% average accuracy.
        </p>
        <h2>Top {country.name} Forecasters</h2>
        <ol>
          {nationProfilesList.slice(0, 5).map((p: any, i: number) => (
            <li key={p.id}>
              #{i + 1} <a href={`/u/${p.username}`}>@{p.username}</a>
              {' '}- {p.total_points} points, {p.accuracy_pct}% accuracy
            </li>
          ))}
        </ol>
        <h2>Explore Other Nations</h2>
        <ul>
          {country.rivals.map(r => (
            <li key={r}><a href={`/${r}`}>{COUNTRY_DATA[r]?.name} Football Predictions</a></li>
          ))}
        </ul>
        <a href="/leaderboard">Global Football Prediction Leaderboard</a>
        <a href="/nations">Nation Battle Rankings</a>
        <a href="/predict">Predict World Cup 2026 Matches</a>
      </div>

      <NationPageClientV2
        country={country}
        slug={slug}
        profiles={nationProfilesList}
        nationRank={nationRank}
        nationPoints={totalNationPoints}
        nationPredictions={totalNationPredictions}
        avgAccuracy={avgAccuracy}
        forecasterCount={nationStats.forecasters}
        rivalData={rivalData}
        recentPredictions={recentPredictions || []}
      />
    </>
  );
}
