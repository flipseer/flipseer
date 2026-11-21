import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import H2HPageClient from './H2HPageClient';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

function parseSlug(slug: string): { teamA: string; teamB: string } | null {
  // slug format: "persebaya-surabaya-vs-arema-fc"
  const vsIndex = slug.indexOf('-vs-');
  if (vsIndex === -1) return null;
  // Convert slug segments to Title Case
  const toTitle = (s: string) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const teamA = toTitle(slug.slice(0, vsIndex));
  const teamB = toTitle(slug.slice(vsIndex + 4));
  return { teamA, teamB };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: 'H2H | Flipseer' };

  const { teamA, teamB } = parsed;
  const title = `${teamA} vs ${teamB} Head to Head | H2H Record | Flipseer`;
  const desc = `${teamA} vs ${teamB} all-time head to head record. Win rates, last 5 results, scores and community predictions. Free on Flipseer.`;

  return {
    title,
    description: desc,
    keywords: `${teamA} vs ${teamB} h2h, ${teamA} ${teamB} head to head, ${teamA} vs ${teamB} history`,
    alternates: {
      canonical: `https://flipseer.com/h2h/${params.slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://flipseer.com/h2h/${params.slug}`,
      images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630, alt: `${teamA} vs ${teamB} H2H — Flipseer` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    },
  };
}

export default async function H2HPage({ params }: Props) {
  const parsed = parseSlug(params.slug);

  if (!parsed) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Invalid H2H URL</h1>
          <a href="/predict" style={{ color: '#2E9E5E' }}>View all matches →</a>
        </div>
      </main>
    );
  }

  const { teamA, teamB } = parsed;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch last 10 H2H completed matches
  const { data: h2hData } = await supabase
    .from('matches')
    .select('home_team, away_team, home_score, away_score, kickoff, competition, home_team_logo, away_team_logo, slug')
    .eq('status', 'completed')
    .or(
      `and(home_team.ilike.${teamA},away_team.ilike.${teamB}),and(home_team.ilike.${teamB},away_team.ilike.${teamA})`
    )
    .order('kickoff', { ascending: false })
    .limit(10);

  const h2hMatches = h2hData || [];

  // Fetch upcoming match between these teams if any
  const { data: upcomingData } = await supabase
    .from('matches')
    .select('slug, home_team, away_team, kickoff, competition, home_team_logo, away_team_logo')
    .or(
      `and(home_team.ilike.${teamA},away_team.ilike.${teamB}),and(home_team.ilike.${teamB},away_team.ilike.${teamA})`
    )
    .in('status', ['upcoming', 'live'])
    .order('kickoff', { ascending: true })
    .limit(1);

  const upcomingMatch = upcomingData?.[0] || null;

  // Get logos: prefer completed H2H match, fall back to upcoming match
  const logoSource = h2hMatches[0] || upcomingMatch;
  const teamALogo = logoSource
    ? (logoSource.home_team.toLowerCase() === teamA.toLowerCase()
        ? logoSource.home_team_logo
        : logoSource.away_team_logo)
    : null;
  const teamBLogo = logoSource
    ? (logoSource.home_team.toLowerCase() === teamA.toLowerCase()
        ? logoSource.away_team_logo
        : logoSource.home_team_logo)
    : null;

  return (
    <H2HPageClient
      teamA={teamA}
      teamB={teamB}
      teamALogo={teamALogo}
      teamBLogo={teamBLogo}
      h2hMatches={h2hMatches}
      upcomingMatch={upcomingMatch}
      slug={params.slug}
    />
  );
}
