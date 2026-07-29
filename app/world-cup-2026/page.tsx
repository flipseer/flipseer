import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Results | Spain Champions | Flipseer',
  description: 'FIFA World Cup 2026 final results. Spain beat France 2-0 in the final. 48 nations, 104 matches, 16 host cities. See all results and top forecasters.',
  keywords: 'FIFA World Cup 2026 results, World Cup 2026 winner, Spain World Cup 2026, World Cup 2026 final score, football prediction 2026',
  alternates: { canonical: 'https://flipseer.com/world-cup-2026' },
  openGraph: {
    title: 'FIFA World Cup 2026 | Spain are Champions | Flipseer',
    description: 'Spain beat France 2-0 in the World Cup 2026 Final. See all 104 match results and top forecasters on Flipseer.',
    url: 'https://flipseer.com/world-cup-2026',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
};

export default async function WorldCup2026Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: recentResults },
    { count: totalMatches },
    { data: topForecasters },
  ] = await Promise.all([
    supabase.from('matches')
      .select('id, home_team, away_team, kickoff, home_score, away_score, status, winner')
      .eq('competition', 'World Cup 2026')
      .eq('status', 'completed')
      .order('kickoff', { ascending: false })
      .limit(10),
    supabase.from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('competition', 'World Cup 2026'),
    supabase.from('profiles')
      .select('username, total_points, accuracy_pct, prediction_count, rank_icon, country')
      .gt('prediction_count', 0)
      .order('total_points', { ascending: false })
      .limit(5),
  ]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    sport: 'Football',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: { '@type': 'Place', name: 'USA, Canada & Mexico', address: 'North America' },
    description: 'The 23rd FIFA World Cup. Spain won the 2026 World Cup, beating France 2-0 in the final.',
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    url: 'https://flipseer.com/world-cup-2026',
  };

  const HOST_CITIES = [
    { city: 'New York/New Jersey', flag: '🇺🇸', matches: 8 },
    { city: 'Los Angeles', flag: '🇺🇸', matches: 8 },
    { city: 'Dallas', flag: '🇺🇸', matches: 7 },
    { city: 'Mexico City', flag: '🇲🇽', matches: 7 },
    { city: 'Toronto', flag: '🇨🇦', matches: 7 },
    { city: 'San Francisco', flag: '🇺🇸', matches: 6 },
    { city: 'Miami', flag: '🇺🇸', matches: 6 },
    { city: 'Atlanta', flag: '🇺🇸', matches: 6 },
    { city: 'Seattle', flag: '🇺🇸', matches: 6 },
    { city: 'Houston', flag: '🇺🇸', matches: 6 },
    { city: 'Kansas City', flag: '🇺🇸', matches: 6 },
    { city: 'Boston', flag: '🇺🇸', matches: 6 },
    { city: 'Philadelphia', flag: '🇺🇸', matches: 6 },
    { city: 'Vancouver', flag: '🇨🇦', matches: 6 },
    { city: 'Guadalajara', flag: '🇲🇽', matches: 5 },
    { city: 'Monterrey', flag: '🇲🇽', matches: 5 },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main style={{
        backgroundColor: '#0D1F0F', minHeight: '100vh',
        fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
        color: 'white', paddingBottom: 80,
      }}>
        <style>{`
          .match-row:hover{background:rgba(46,158,94,0.08)!important}
          .match-row{transition:background 0.1s}
          .city-card:hover{border-color:#2E9E5E!important}
          .city-card{transition:border-color 0.15s}
        `}</style>

        {/* ── HERO ── */}
        <section style={{
          background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
          padding: 'clamp(48px,10vw,80px) 20px clamp(40px,8vw,64px)',
          borderBottom: '1px solid #1A3A1A',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '70%', height: '100%',
            background: 'radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}/>

          {/* COMPLETE badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B',
            borderRadius: 999, padding: '6px 20px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, letterSpacing: '2px' }}>
              ✓ COMPLETE · FIFA WORLD CUP 2026
            </span>
          </div>

          <div style={{ fontSize: 'clamp(56px,14vw,96px)', marginBottom: 16, lineHeight: 1 }}>🏆</div>

          <h1 style={{
            fontSize: 'clamp(28px,7vw,56px)',
            fontWeight: 900, letterSpacing: '-1.5px',
            lineHeight: 1.05, marginBottom: 16,
          }}>
            FIFA World Cup 2026
          </h1>

          {/* Spain Champions banner */}
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(245,158,11,0.1)',
            border: '2px solid #F59E0B',
            borderRadius: 14, padding: '16px 32px',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🇪🇸</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B', marginBottom: 4 }}>
              Spain are World Champions!
            </div>
            <div style={{ fontSize: 14, color: '#9CA3AF' }}>
              Final: Spain 2–0 France · July 19, 2026
            </div>
          </div>

          {/* Key facts */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 8, maxWidth: 480, margin: '0 auto 28px',
          }}>
            {[
              { icon: '🌍', label: 'Nations', value: '48' },
              { icon: '⚽', label: 'Total Matches', value: String(totalMatches || 104) },
              { icon: '🏟️', label: 'Host Cities', value: '16' },
              { icon: '🌎', label: 'Host Countries', value: '3' },
              { icon: '📅', label: 'Started', value: 'Jun 11' },
              { icon: '🏆', label: 'Champions', value: '🇪🇸' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '12px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.5px' }}>{value}</div>
                <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '0.5px' }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/leaderboard" style={{
              backgroundColor: '#2E9E5E', color: 'white',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 0 24px rgba(46,158,94,0.35)',
            }}>
              🏆 Final Leaderboard →
            </a>
            <a href="/epl" style={{
              backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6',
              padding: '14px 24px', borderRadius: 10, textDecoration: 'none',
              fontSize: 15, border: '1px solid #8B5CF6', fontWeight: 700,
            }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL Starts Aug 21 →
            </a>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
              ABOUT FIFA WORLD CUP 2026
            </p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, lineHeight: 1.2 }}>
              The biggest World Cup in history.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
              {[
                { title: 'Expanded Format', content: 'For the first time, 48 nations competed — up from 32. The expanded format added 16 more teams and 40 more matches, giving more nations than ever a chance on the world stage.' },
                { title: 'Three Host Nations', content: 'USA, Canada and Mexico co-hosted the tournament across 16 cities — the first World Cup hosted across three nations simultaneously.' },
                { title: 'Tournament Format', content: '12 groups of 4 teams each. Top 2 from each group plus 8 best third-placed teams advanced to the Round of 32, then knockout rounds to the Final.' },
                { title: 'Historic Result', content: 'Spain became World Champions for the 5th time, beating France 2-0 in the Final at MetLife Stadium, New Jersey on July 19, 2026.' },
              ].map(({ title, content }) => (
                <div key={title} style={{
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                  borderRadius: 12, padding: '20px',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#2E9E5E', marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#8895A3', lineHeight: 1.7 }}>{content}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECENT RESULTS ── */}
        {recentResults && recentResults.length > 0 && (
          <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px' }}>
                  MATCH RESULTS
                </p>
                <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
                  View all →
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentResults.map((match: any) => (
                  <a key={match.id}
                    href={`/matches/${match.home_team.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    className="match-row"
                    style={{
                      backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                      borderRadius: 10, padding: '14px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      textDecoration: 'none',
                    }}>
                    <span style={{
                      fontSize: 14, fontWeight: match.winner === 'home' ? 700 : 400,
                      color: match.winner === 'home' ? 'white' : '#6B7280', flex: 1,
                    }}>
                      {match.home_team}
                    </span>
                    <span style={{
                      fontSize: 18, fontWeight: 800, color: '#F59E0B',
                      letterSpacing: '-0.5px', padding: '0 12px',
                    }}>
                      {match.home_score} – {match.away_score}
                    </span>
                    <span style={{
                      fontSize: 14, fontWeight: match.winner === 'away' ? 700 : 400,
                      color: match.winner === 'away' ? 'white' : '#6B7280', flex: 1, textAlign: 'right',
                    }}>
                      {match.away_team}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TOP FORECASTERS ── */}
        {topForecasters && topForecasters.length > 0 && (
          <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px' }}>
                  TOP FORECASTERS
                </p>
                <a href="/leaderboard" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
                  Full leaderboard →
                </a>
              </div>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: 14, overflow: 'hidden' }}>
                {topForecasters.map((p: any, i: number) => (
                  <a key={i} href={`/u/${p.username}`} className="match-row" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', textDecoration: 'none',
                    borderTop: i === 0 ? 'none' : '1px solid #1A3A1A',
                  }}>
                    <span style={{ fontSize: i < 3 ? 20 : 13, minWidth: 28, textAlign: 'center', color: '#6B7280', fontWeight: 700 }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                        {p.rank_icon} @{p.username}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>
                        {p.prediction_count} predictions · {p.accuracy_pct}% accuracy
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#2E9E5E' }}>
                      {p.total_points}pts
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── HOST CITIES ── */}
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 8 }}>
              HOST CITIES
            </p>
            <h2 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20 }}>
              16 cities across 3 nations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
              {HOST_CITIES.map(({ city, flag, matches }) => (
                <div key={city} className="city-card" style={{
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{flag}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{city}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{matches} matches</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EPL CTA ── */}
        <section style={{ padding: '48px 20px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
              Your reputation continues in the EPL
            </h2>
            <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              World Cup points carry forward. Premier League 2026/27 starts August 21.
              380 matches. One permanent record. Forever.
            </p>
            <a href="/epl/matchweek-1" style={{
              display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white',
              padding: '15px 40px', borderRadius: 10, textDecoration: 'none',
              fontSize: 16, fontWeight: 700,
              boxShadow: '0 0 24px rgba(139,92,246,0.3)',
              marginBottom: 24,
            }}>
              View EPL Matchweek 1 →
            </a>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {[
                { href: '/nations', label: '🌍 Nation Battle' },
                { href: '/leaderboard', label: '🏆 Leaderboard' },
                { href: '/india', label: '🇮🇳 India' },
                { href: '/indonesia', label: '🇮🇩 Indonesia' },
                { href: '/nigeria', label: '🇳🇬 Nigeria' },
                { href: '/brazil', label: '🇧🇷 Brazil' },
                { href: '/argentina', label: '🇦🇷 Argentina' },
                { href: '/england', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
                { href: '/spain', label: '🇪🇸 Spain' },
              ].map(({ href, label }) => (
                <a key={href} href={href} style={{
                  display: 'inline-block',
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                  borderRadius: 8, padding: '7px 14px',
                  textDecoration: 'none', fontSize: 12, color: '#8895A3',
                }}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
