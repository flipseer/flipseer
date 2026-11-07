import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const FLAG: Record<string, string> = {
  IN:'🇮🇳',ID:'🇮🇩',NG:'🇳🇬',BR:'🇧🇷',AR:'🇦🇷',
  GB:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',FR:'🇫🇷',DE:'🇩🇪',ES:'🇪🇸',PT:'🇵🇹',
  MX:'🇲🇽',US:'🇺🇸',GH:'🇬🇭',MA:'🇲🇦',JP:'🇯🇵',
  KR:'🇰🇷',AU:'🇦🇺',PK:'🇵🇰',BD:'🇧🇩',SA:'🇸🇦',
  TR:'🇹🇷',EG:'🇪🇬',ZA:'🇿🇦',NO:'🇳🇴',SN:'🇸🇳',
};

const COMPETITIONS: Record<string, {
  slug: string;
  label: string;
  fullName: string;
  competition: string; // matches the value in DB
  icon: string;
  description: string;
  country?: string; // for nation leaderboard
}> = {
  epl: {
    slug: 'epl',
    label: 'EPL',
    fullName: 'English Premier League',
    competition: 'EPL 2026/27',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    description: 'Top football predictors for the English Premier League 2026/27 on Flipseer.',
  },
  ucl: {
    slug: 'ucl',
    label: 'UCL',
    fullName: 'UEFA Champions League',
    competition: 'UCL 2026/27',
    icon: '⭐',
    description: 'Top football predictors for the UEFA Champions League 2026/27 on Flipseer.',
  },
  isl: {
    slug: 'isl',
    label: 'ISL',
    fullName: 'Indian Super League',
    competition: 'ISL 2026/27',
    icon: '🇮🇳',
    description: 'Top football predictors for the Indian Super League 2026/27 on Flipseer.',
  },
  'liga-1': {
    slug: 'liga-1',
    label: 'Liga 1',
    fullName: 'Indonesia Liga 1',
    competition: 'Liga 1 2026/27',
    icon: '🇮🇩',
    description: 'Top football predictors for Indonesia Liga 1 2026/27 on Flipseer.',
  },
  'ghana-pl': {
    slug: 'ghana-pl',
    label: 'Ghana PL',
    fullName: 'Ghana Premier League',
    competition: 'Ghana PL 2026/27',
    icon: '🇬🇭',
    description: 'Top football predictors for the Ghana Premier League 2026/27 on Flipseer.',
  },
  'nation-battle': {
    slug: 'nation-battle',
    label: 'Nation Battle',
    fullName: 'Nation Battle',
    competition: '', // special case — country-based
    icon: '🌍',
    description: 'Nation Battle standings on Flipseer — which country has the best football predictors?',
  },
};

type Props = { params: { competition: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comp = COMPETITIONS[params.competition];
  if (!comp) return { title: 'Leaderboard | Flipseer' };
  return {
    title: `${comp.fullName} Prediction Leaderboard 2026/27 | Flipseer`,
    description: `${comp.description} Free football prediction platform. No betting. Build your permanent football reputation.`,
    keywords: `${comp.label} prediction leaderboard, ${comp.fullName} predictions, best football predictors, football forecaster rankings, Flipseer`,
    alternates: { canonical: `https://flipseer.com/leaderboard/${comp.slug}` },
    openGraph: {
      title: `${comp.fullName} Top Predictors 2026/27 | Flipseer`,
      description: comp.description,
      url: `https://flipseer.com/leaderboard/${comp.slug}`,
      images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function CompetitionLeaderboardPage({ params }: Props) {
  const comp = COMPETITIONS[params.competition];
  if (!comp) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1>Leaderboard not found</h1>
          <a href="/leaderboard" style={{ color: '#2E9E5E' }}>← All Leaderboards</a>
        </div>
      </main>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let topPredictors: any[] = [];
  let nationStandings: any[] = [];

  if (comp.slug === 'nation-battle') {
    // Nation Battle: aggregate REP points by country
    const { data: profiles } = await supabase
      .from('profiles')
      .select('country, total_points, username')
      .gt('total_points', 0)
      .not('country', 'is', null);

    const nationMap: Record<string, { points: number; members: number; topUser: string }> = {};
    (profiles || []).forEach((p: any) => {
      if (!nationMap[p.country]) nationMap[p.country] = { points: 0, members: 0, topUser: '' };
      nationMap[p.country].points += p.total_points || 0;
      nationMap[p.country].members += 1;
      if (!nationMap[p.country].topUser) nationMap[p.country].topUser = p.username;
    });

    nationStandings = Object.entries(nationMap)
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 20);
  } else {
    // Competition leaderboard: get users who have predictions in this competition
    const { data: matchIds } = await supabase
      .from('matches')
      .select('id')
      .eq('competition', comp.competition);

    const ids = (matchIds || []).map((m: any) => m.id);

    if (ids.length > 0) {
      // Get user IDs with predictions in this competition
      const { data: preds } = await supabase
        .from('predictions')
        .select('user_id, points_earned, prediction_processed')
        .in('match_id', ids);

      const userStats: Record<string, { points: number; correct: number; total: number }> = {};
      (preds || []).forEach((p: any) => {
        if (!userStats[p.user_id]) userStats[p.user_id] = { points: 0, correct: 0, total: 0 };
        userStats[p.user_id].points += p.points_earned || 0;
        userStats[p.user_id].total += 1;
        if (p.prediction_processed && p.points_earned > 0) userStats[p.user_id].correct += 1;
      });

      const userIds = Object.keys(userStats);
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, total_points, rank, rank_icon, accuracy_pct, country, streak')
          .in('id', userIds);

        topPredictors = (profiles || [])
          .map((p: any) => ({
            ...p,
            comp_points: userStats[p.id]?.points || 0,
            comp_correct: userStats[p.id]?.correct || 0,
            comp_total: userStats[p.id]?.total || 0,
          }))
          .sort((a, b) => b.comp_points - a.comp_points)
          .slice(0, 50);
      }
    }

    // Fallback: global leaderboard if no competition-specific data
    if (topPredictors.length === 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, total_points, rank, rank_icon, accuracy_pct, country, streak')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(50);
      topPredictors = profiles || [];
    }
  }

  const isNationBattle = comp.slug === 'nation-battle';
  const COUNTRY_NAMES: Record<string, string> = {
    IN:'India',ID:'Indonesia',NG:'Nigeria',BR:'Brazil',AR:'Argentina',
    GB:'England',FR:'France',DE:'Germany',ES:'Spain',PT:'Portugal',
    GH:'Ghana',MA:'Morocco',JP:'Japan',KR:'South Korea',AU:'Australia',
    PK:'Pakistan',BD:'Bangladesh',ZA:'South Africa',TR:'Turkey',EG:'Egypt',
    MX:'Mexico',US:'USA',SN:'Senegal',NO:'Norway',SA:'Saudi Arabia',
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: 60 }}>

      {/* SEO h1 (hidden) */}
      <div style={{ display: 'none' }}>
        <h1>{comp.fullName} Prediction Leaderboard 2026/27 — Top Forecasters | Flipseer</h1>
        <p>{comp.description} Free. No betting. Build your permanent football reputation across {comp.fullName}.</p>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>
          FLIPSEER · FOOTBALL REPUTATION
        </p>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{comp.icon}</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,5vw,40px)', margin: '0 0 12px 0' }}>
          {comp.fullName} Leaderboard
        </h2>
        <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 20px 0', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          {isNationBattle
            ? 'Which country has the best football predictors? Nation standings across all competitions.'
            : `Top forecasters ranked by REP points earned from ${comp.fullName} 2026/27 predictions. Locked before kickoff. No edits.`}
        </p>

        {/* Competition tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.values(COMPETITIONS).map(c => (
            <a key={c.slug} href={`/leaderboard/${c.slug}`} style={{
              padding: '6px 14px',
              backgroundColor: c.slug === comp.slug ? '#1A7A4A' : 'transparent',
              color: c.slug === comp.slug ? 'white' : '#6B7280',
              border: `1px solid ${c.slug === comp.slug ? '#2E9E5E' : '#1A3A1A'}`,
              borderRadius: 999, fontSize: 12, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              {c.icon} {c.label}
            </a>
          ))}
          <a href="/leaderboard" style={{
            padding: '6px 14px',
            backgroundColor: 'transparent',
            color: '#6B7280',
            border: '1px solid #1A3A1A',
            borderRadius: 999, fontSize: 12, fontWeight: 600,
            textDecoration: 'none',
          }}>
            🌐 Global
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px 0' }}>

        {isNationBattle ? (
          /* NATION BATTLE */
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, margin: '0 0 20px 0' }}>🌍 Nation Battle Standings</h2>
            {nationStandings.length === 0 ? (
              <p style={{ color: '#6B7280' }}>No nation data yet.</p>
            ) : (
              nationStandings.map((nation, i) => (
                <div key={nation.country} style={{
                  backgroundColor: '#0D2B14',
                  border: `1px solid ${i === 0 ? '#F59E0B' : i === 1 ? '#6B7280' : i === 2 ? '#CD7C2F' : '#1A3A1A'}`,
                  borderRadius: 12, padding: '16px 20px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? '#F59E0B' : '#6B7280', minWidth: 28, textAlign: 'center' }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 32 }}>{FLAG[nation.country] || '🌍'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{COUNTRY_NAMES[nation.country] || nation.country}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{nation.members} forecaster{nation.members !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>{nation.points.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>TOTAL REP</div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* COMPETITION LEADERBOARD */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, margin: 0 }}>
                {comp.icon} Top {comp.label} Forecasters
              </h2>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{topPredictors.length} forecasters ranked</span>
            </div>

            {topPredictors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <p style={{ color: '#6B7280' }}>No predictions settled yet for {comp.fullName}.</p>
                <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, marginTop: 12 }}>
                  Be first to predict →
                </a>
              </div>
            ) : (
              topPredictors.map((p, i) => {
                const compAcc = p.comp_total > 0 ? Math.round((p.comp_correct / p.comp_total) * 100) : 0;
                return (
                  <a key={p.id || i} href={`/u/${p.username}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      backgroundColor: '#0D2B14',
                      border: `1px solid ${i === 0 ? '#F59E0B' : i === 1 ? '#6B7280' : i === 2 ? '#CD7C2F' : '#1A3A1A'}`,
                      borderRadius: 12, padding: '14px 18px', marginBottom: 8,
                      display: 'flex', alignItems: 'center', gap: 14,
                      transition: 'border-color 0.15s',
                    }}>
                      {/* Rank */}
                      <div style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7C2F' : '#4B5563', minWidth: 28, textAlign: 'center' }}>
                        {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        backgroundColor: '#1A7A4A', border: '1.5px solid #2E9E5E',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, flexShrink: 0,
                      }}>
                        {p.username[0].toUpperCase()}
                      </div>

                      {/* Name + rank */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#2E9E5E' }}>@{p.username}</span>
                          {p.country && <span style={{ fontSize: 16 }}>{FLAG[p.country] || '🌍'}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                          {p.rank_icon} {p.rank}
                          {p.comp_total > 0 && <span> · {p.comp_correct}/{p.comp_total} correct ({compAcc}%)</span>}
                        </div>
                      </div>

                      {/* Points */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#F59E0B' }}>
                          {p.comp_points > 0 ? p.comp_points : p.total_points}
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280' }}>REP</div>
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        )}

        {/* SEO footer */}
        <div style={{ marginTop: 40, padding: '24px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 14 }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, margin: '0 0 10px 0', color: '#2E9E5E' }}>
            About the {comp.fullName} Leaderboard
          </h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {isNationBattle
              ? 'The Nation Battle tracks combined REP points earned by forecasters from each country across all competitions on Flipseer — EPL, UCL, ISL, Liga 1 Indonesia, and Ghana Premier League. Free to join. No betting. Pure football intelligence.'
              : `The ${comp.fullName} leaderboard ranks Flipseer forecasters by REP points earned from ${comp.fullName} predictions. Predictions lock permanently before kickoff — no editing after the whistle. Free forever. No betting. No card required.`}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
              Predict {comp.label} Now →
            </a>
            <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#6B7280', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 13, border: '1px solid #1A3A1A' }}>
              Global Leaderboard
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
