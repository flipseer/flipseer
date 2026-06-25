import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import NationPageClient from './NationPageClient';

const COUNTRY_DATA: { [key: string]: { name: string; code: string; flag: string; adjective: string; rivals: string[] } } = {
  'india': { name: 'India', code: 'IN', flag: '🇮🇳', adjective: 'Indian', rivals: ['Indonesia', 'Brazil', 'Argentina'] },
  'indonesia': { name: 'Indonesia', code: 'ID', flag: '🇮🇩', adjective: 'Indonesian', rivals: ['India', 'Nigeria', 'Brazil'] },
  'nigeria': { name: 'Nigeria', code: 'NG', flag: '🇳🇬', adjective: 'Nigerian', rivals: ['Ghana', 'Brazil', 'England'] },
  'brazil': { name: 'Brazil', code: 'BR', flag: '🇧🇷', adjective: 'Brazilian', rivals: ['Argentina', 'France', 'Germany'] },
  'argentina': { name: 'Argentina', code: 'AR', flag: '🇦🇷', adjective: 'Argentinian', rivals: ['Brazil', 'France', 'England'] },
  'england': { name: 'England', code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', adjective: 'English', rivals: ['France', 'Germany', 'Argentina'] },
  'france': { name: 'France', code: 'FR', flag: '🇫🇷', adjective: 'French', rivals: ['England', 'Germany', 'Spain'] },
  'germany': { name: 'Germany', code: 'DE', flag: '🇩🇪', adjective: 'German', rivals: ['France', 'England', 'Spain'] },
  'spain': { name: 'Spain', code: 'ES', flag: '🇪🇸', adjective: 'Spanish', rivals: ['Portugal', 'France', 'Germany'] },
  'portugal': { name: 'Portugal', code: 'PT', flag: '🇵🇹', adjective: 'Portuguese', rivals: ['Spain', 'France', 'Brazil'] },
  'mexico': { name: 'Mexico', code: 'MX', flag: '🇲🇽', adjective: 'Mexican', rivals: ['USA', 'Argentina', 'Brazil'] },
  'usa': { name: 'USA', code: 'US', flag: '🇺🇸', adjective: 'American', rivals: ['Mexico', 'England', 'Brazil'] },
  'ghana': { name: 'Ghana', code: 'GH', flag: '🇬🇭', adjective: 'Ghanaian', rivals: ['Nigeria', 'Senegal', 'Morocco'] },
  'morocco': { name: 'Morocco', code: 'MA', flag: '🇲🇦', adjective: 'Moroccan', rivals: ['Senegal', 'Nigeria', 'France'] },
  'japan': { name: 'Japan', code: 'JP', flag: '🇯🇵', adjective: 'Japanese', rivals: ['South Korea', 'Australia', 'Brazil'] },
  'south-korea': { name: 'South Korea', code: 'KR', flag: '🇰🇷', adjective: 'Korean', rivals: ['Japan', 'Australia', 'Germany'] },
  'australia': { name: 'Australia', code: 'AU', flag: '🇦🇺', adjective: 'Australian', rivals: ['Japan', 'South Korea', 'England'] },
  'pakistan': { name: 'Pakistan', code: 'PK', flag: '🇵🇰', adjective: 'Pakistani', rivals: ['India', 'Saudi Arabia', 'Iran'] },
  'bangladesh': { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', adjective: 'Bangladeshi', rivals: ['India', 'Indonesia', 'Nigeria'] },
  'egypt': { name: 'Egypt', code: 'EG', flag: '🇪🇬', adjective: 'Egyptian', rivals: ['Morocco', 'Nigeria', 'Senegal'] },
  'senegal': { name: 'Senegal', code: 'SN', flag: '🇸🇳', adjective: 'Senegalese', rivals: ['Nigeria', 'Ghana', 'Morocco'] },
  'south-africa': { name: 'South Africa', code: 'ZA', flag: '🇿🇦', adjective: 'South African', rivals: ['Nigeria', 'Ghana', 'Morocco'] },
  'saudi-arabia': { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', adjective: 'Saudi', rivals: ['Egypt', 'Iran', 'UAE'] },
  'turkey': { name: 'Turkey', code: 'TR', flag: '🇹🇷', adjective: 'Turkish', rivals: ['Germany', 'France', 'Croatia'] },
  'norway': { name: 'Norway', code: 'NO', flag: '🇳🇴', adjective: 'Norwegian', rivals: ['Sweden', 'Denmark', 'England'] },
};

type Props = { params: { nation: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.nation.toLowerCase();
  const country = COUNTRY_DATA[slug];
  if (!country) return { title: 'Nation Not Found | Flipseer' };

  return {
    title: `${country.name} World Cup 2026 Predictions | Flipseer Nation Battle`,
    description: `${country.adjective} football fans predicting World Cup 2026 matches on Flipseer. See ${country.name}'s global ranking, top forecasters, and recent predictions. Free. No betting.`,
    keywords: `${country.name} football predictions, ${country.name} World Cup 2026, ${country.adjective} football predictor, ${country.name} nation battle, football prediction ${country.name}`,
    openGraph: {
      title: `${country.flag} ${country.name} — World Cup 2026 Nation Battle | Flipseer`,
      description: `${country.name} forecasters competing globally. Predict matches. Earn points for ${country.name}. Build your permanent football record.`,
      url: `https://flipseer.com/${slug}`,
      images: [{ url: `https://flipseer.com/api/og/home`, width: 1200, height: 630 }],
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
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Nation not found</h1>
          <a href="/nations" style={{ color: '#2E9E5E' }}>View all nations →</a>
        </div>
      </main>
    );
  }

  // Server-side data fetch for SEO
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, total_points, accuracy_pct, prediction_count, rank, correct_count')
    .eq('country', country.code)
    .order('total_points', { ascending: false })
    .limit(10);

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('country, total_points')
    .gt('total_points', 0);

  // Calculate nation rank
  const countryMap: { [key: string]: number } = {};
  (allProfiles || []).forEach((p: any) => {
    const c = p.country || 'OTHER';
    countryMap[c] = (countryMap[c] || 0) + (p.total_points || 0);
  });
  const ranked = Object.entries(countryMap).sort((a, b) => b[1] - a[1]);
  const nationRank = ranked.findIndex(([c]) => c === country.code) + 1;
  const nationPoints = countryMap[country.code] || 0;
  const forecasterCount = (profiles || []).length;

  return (
    <NationPageClient
      country={country}
      slug={slug}
      profiles={profiles || []}
      nationRank={nationRank}
      nationPoints={nationPoints}
      forecasterCount={forecasterCount}
    />
  );
}
