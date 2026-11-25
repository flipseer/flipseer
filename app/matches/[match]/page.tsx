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

  // Added `id` to select so we can count predictions for noindex decision
  const { data: matches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, competition, kickoff, home_score, away_score, status')
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

  // NOINDEX FIX: completed pages with zero predictions get noindex,follow
  // so Google stops crawling thin content pages and focuses crawl budget
  // on pages that actually have user predictions.
  let robotsDirective = 'index,follow';
  if (isCompleted && match?.id) {
    const { count } = await supabase
      .from('predictions')
      .select('id', { count: 'exact', head: true })
      .eq('match_id', match.id);
    if ((count ?? 0) === 0) {
      robotsDirective = 'noindex,follow';
    }
  }

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
    robots: robotsDirective,
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
  const competition = match?.competition?.replace(' 2026/27', '') || 'Football';

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

  const isCompleted = match.status === 'completed';
  const homePct = communityStats.total > 0 ? Math.round((communityStats.home / communityStats.total) * 100) : 0;
  const drawPct = communityStats.total > 0 ? Math.round((communityStats.draw / communityStats.total) * 100) : 0;
  const awayPct = communityStats.total > 0 ? Math.round((communityStats.away / communityStats.total) * 100) : 0;

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

  // SportsEvent JSON-LD schema
  const kickoffUtc = match.kickoff
    ? (match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z')
    : null;

  const competitionMeta: Record<string, { tz: string; country: string; orgUrl: string }> = {
    'Liga 1': { tz: '+07:00', country: 'Indonesia', orgUrl: 'https://flipseer.com/predictions/liga-1' },
    'ISL': { tz: '+05:30', country: 'India', orgUrl: 'https://flipseer.com/predictions/isl' },
    'EPL': { tz: '+00:00', country: 'England', orgUrl: 'https://flipseer.com/predictions/epl' },
    'UCL': { tz: '+01:00', country: 'Europe', orgUrl: 'https://flipseer.com/predictions/ucl' },
    'Ghana PL': { tz: '+00:00', country: 'Ghana', orgUrl: 'https://flipseer.com/predictions/ghana-pl' },
  };
  const meta = competitionMeta[competition] || { tz: '+00:00', country: 'International', orgUrl: 'https://flipseer.com' };

  const startDate = kickoffUtc
    ? kickoffUtc.replace('Z', meta.tz === '+00:00' ? 'Z' : meta.tz)
    : null;

  const eventStatus = isCompleted
    ? 'https://schema.org/EventCompleted'
    : 'https://schema.org/EventScheduled';

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': `${home} vs ${away} — ${competition} Prediction`,
    'url': `https://flipseer.com/matches/${slug}`,
    ...(startDate && { 'startDate': startDate }),
    'eventStatus': eventStatus,
    'location': {
      '@type': 'Place',
      'name': competition,
      'address': { '@type': 'PostalAddress', 'addressCountry': meta.country },
    },
    'competitor': [
      { '@type': 'SportsTeam', 'name': home, ...(match.home_team_logo && { 'logo': match.home_team_logo }) },
      { '@type': 'SportsTeam', 'name': away, ...(match.away_team_logo && { 'logo': match.away_team_logo }) },
    ],
    'organizer': { '@type': 'Organization', 'name': competition, 'url': meta.orgUrl },
    'description': isCompleted
      ? `${home} ${match.home_score}-${match.away_score} ${away}. ${communityStats.total} Flipseer users predicted this ${competition} match.`
      : `Predict ${home} vs ${away} in ${competition} before kickoff. Lock your call permanently on Flipseer. Free. No betting.`,
  };

  if (isCompleted && match.home_score !== null) {
    jsonLd['subEvent'] = {
      '@type': 'Event',
      'name': 'Final Score',
      'description': `${home} ${match.home_score} - ${match.away_score} ${away}`,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>{home} vs {away} Prediction — {competition} | Flipseer</h1>
        {isCompleted ? (
          <p>Final result: {home} {match.home_score} - {match.away_score} {away}. {communityStats.total} Flipseer fans predicted this {competition} match. {homePct}% backed {home}, {drawPct}% predicted a draw, {awayPct}% backed {away}.</p>
        ) : (
          <p>Predict {home} vs {away} in {competition} before kickoff. {communityStats.total > 0 ? `${communityStats.total} predictions so far: ${homePct}% back ${home}, ${drawPct}% draw, ${awayPct}% back ${away}.` : 'Be the first to predict this match.'} Lock your prediction permanently on Flipseer. Free. No betting.</p>
        )}
        <ul>
          {predictions.slice(0, 5).map((p: any, i: number) => (
            <li key={i}>{p.profiles?.username || 'Forecaster'} ({p.profiles?.country || ''}): {p.predicted_outcome === 'home' ? home : p.predicted_outcome === 'away' ? away : 'Draw'} — {p.confidence_pct}% confidence{p.predicted_home_score !== null ? `, score: ${p.predicted_home_score}-${p.predicted_away_score}` : ''}</li>
          ))}
        </ul>
      </div>
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
    </>
  );
}
