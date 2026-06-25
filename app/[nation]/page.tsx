import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import NationPageClient from './NationPageClient';

const COUNTRY_DATA: { [key: string]: { name: string; code: string; flag: string; adjective: string; rivals: string[] } } = {
  'india': { name: 'India', code: 'IN', flag: '&#x1F1EE;&#x1F1F3;', adjective: 'Indian', rivals: ['Indonesia', 'Brazil', 'Argentina'] },
  'indonesia': { name: 'Indonesia', code: 'ID', flag: '&#x1F1EE;&#x1F1E9;', adjective: 'Indonesian', rivals: ['India', 'Nigeria', 'Brazil'] },
  'nigeria': { name: 'Nigeria', code: 'NG', flag: '&#x1F1F3;&#x1F1EC;', adjective: 'Nigerian', rivals: ['Ghana', 'Brazil', 'England'] },
  'brazil': { name: 'Brazil', code: 'BR', flag: '&#x1F1E7;&#x1F1F7;', adjective: 'Brazilian', rivals: ['Argentina', 'France', 'Germany'] },
  'argentina': { name: 'Argentina', code: 'AR', flag: '&#x1F1E6;&#x1F1F7;', adjective: 'Argentinian', rivals: ['Brazil', 'France', 'England'] },
  'england': { name: 'England', code: 'GB', flag: '&#x1F3F4;', adjective: 'English', rivals: ['France', 'Germany', 'Argentina'] },
  'france': { name: 'France', code: 'FR', flag: '&#x1F1EB;&#x1F1F7;', adjective: 'French', rivals: ['England', 'Germany', 'Spain'] },
  'germany': { name: 'Germany', code: 'DE', flag: '&#x1F1E9;&#x1F1EA;', adjective: 'German', rivals: ['France', 'England', 'Spain'] },
  'spain': { name: 'Spain', code: 'ES', flag: '&#x1F1EA;&#x1F1F8;', adjective: 'Spanish', rivals: ['Portugal', 'France', 'Germany'] },
  'portugal': { name: 'Portugal', code: 'PT', flag: '&#x1F1F5;&#x1F1F9;', adjective: 'Portuguese', rivals: ['Spain', 'France', 'Brazil'] },
  'mexico': { name: 'Mexico', code: 'MX', flag: '&#x1F1F2;&#x1F1FD;', adjective: 'Mexican', rivals: ['USA', 'Argentina', 'Brazil'] },
  'usa': { name: 'USA', code: 'US', flag: '&#x1F1FA;&#x1F1F8;', adjective: 'American', rivals: ['Mexico', 'England', 'Brazil'] },
  'ghana': { name: 'Ghana', code: 'GH', flag: '&#x1F1EC;&#x1F1ED;', adjective: 'Ghanaian', rivals: ['Nigeria', 'Senegal', 'Morocco'] },
  'morocco': { name: 'Morocco', code: 'MA', flag: '&#x1F1F2;&#x1F1E6;', adjective: 'Moroccan', rivals: ['Senegal', 'Nigeria', 'France'] },
  'japan': { name: 'Japan', code: 'JP', flag: '&#x1F1EF;&#x1F1F5;', adjective: 'Japanese', rivals: ['South Korea', 'Australia', 'Brazil'] },
  'south-korea': { name: 'South Korea', code: 'KR', flag: '&#x1F1F0;&#x1F1F7;', adjective: 'Korean', rivals: ['Japan', 'Australia', 'Germany'] },
  'australia': { name: 'Australia', code: 'AU', flag: '&#x1F1E6;&#x1F1FA;', adjective: 'Australian', rivals: ['Japan', 'South Korea', 'England'] },
  'pakistan': { name: 'Pakistan', code: 'PK', flag: '&#x1F1F5;&#x1F1F0;', adjective: 'Pakistani', rivals: ['India', 'Saudi Arabia', 'Iran'] },
  'bangladesh': { name: 'Bangladesh', code: 'BD', flag: '&#x1F1E7;&#x1F1E9;', adjective: 'Bangladeshi', rivals: ['India', 'Indonesia', 'Nigeria'] },
  'egypt': { name: 'Egypt', code: 'EG', flag: '&#x1F1EA;&#x1F1EC;', adjective: 'Egyptian', rivals: ['Morocco', 'Nigeria', 'Senegal'] },
  'senegal': { name: 'Senegal', code: 'SN', flag: '&#x1F1F8;&#x1F1F3;', adjective: 'Senegalese', rivals: ['Nigeria', 'Ghana', 'Morocco'] },
  'south-africa': { name: 'South Africa', code: 'ZA', flag: '&#x1F1FF;&#x1F1E6;', adjective: 'South African', rivals: ['Nigeria', 'Ghana', 'Morocco'] },
  'saudi-arabia': { name: 'Saudi Arabia', code: 'SA', flag: '&#x1F1F8;&#x1F1E6;', adjective: 'Saudi', rivals: ['Egypt', 'Iran', 'UAE'] },
  'turkey': { name: 'Turkey', code: 'TR', flag: '&#x1F1F9;&#x1F1F7;', adjective: 'Turkish', rivals: ['Germany', 'France', 'Croatia'] },
  'norway': { name: 'Norway', code: 'NO', flag: '&#x1F1F3;&#x1F1F4;', adjective: 'Norwegian', rivals: ['Sweden', 'Denmark', 'England'] },
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
      title: `${country.flag} ${country.name} -- World Cup 2026 Nation Battle | Flipseer`,
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x1F30D;</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Nation not found</h1>
          <a href="/nations" style={{ color: '#2E9E5E' }}>View all nations &#x2192;</a>
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
