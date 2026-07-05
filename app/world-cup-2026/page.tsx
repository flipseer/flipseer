import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Predictions | All 104 Matches | Flipseer',
  description: 'Predict all 104 FIFA World Cup 2026 matches. 48 nations. USA, Canada & Mexico hosts. Build your permanent football reputation. Free. No betting.',
  keywords: 'FIFA World Cup 2026, World Cup 2026 predictions, World Cup 2026 host cities, World Cup 2026 format, predict world cup matches, football prediction 2026',
  alternates: { canonical: 'https://flipseer.com/world-cup-2026' },
  openGraph: {
    title: 'FIFA World Cup 2026 | Match Predictions | Flipseer',
    description: 'Predict all 104 FIFA World Cup 2026 matches. 48 nations competing. Build your permanent football reputation. Free.',
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
    { data: upcomingMatches },
    { data: completedMatches },
    { count: totalMatches },
    { data: topForecasters },
  ] = await Promise.all([
    supabase.from('matches')
      .select('id, home_team, away_team, kickoff, status, league')
      .eq('competition', 'World Cup 2026')
      .in('status', ['upcoming', 'locked'])
      .order('kickoff', { ascending: true })
      .limit(8),
    supabase.from('matches')
      .select('id, home_team, away_team, kickoff, home_score, away_score, status')
      .eq('competition', 'World Cup 2026')
      .eq('status', 'completed')
      .order('kickoff', { ascending: false })
      .limit(6),
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
    location: {
      '@type': 'Place',
      name: 'USA, Canada & Mexico',
      address: 'North America',
    },
    description: 'The 23rd FIFA World Cup featuring 48 nations across 16 host cities in USA, Canada and Mexico.',
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: 'https://flipseer.com/world-cup-2026',
  };

  const HOST_CITIES = [
    { city: 'New York/New Jersey', country: 'USA', flag: '🇺🇸', matches: 8 },
    { city: 'Los Angeles', country: 'USA', flag: '🇺🇸', matches: 8 },
    { city: 'Dallas', country: 'USA', flag: '🇺🇸', matches: 7 },
    { city: 'San Francisco', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Miami', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Atlanta', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Seattle', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Houston', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Kansas City', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Boston', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Philadelphia', country: 'USA', flag: '🇺🇸', matches: 6 },
    { city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', matches: 7 },
    { city: 'Guadalajara', country: 'Mexico', flag: '🇲🇽', matches: 5 },
    { city: 'Monterrey', country: 'Mexico', flag: '🇲🇽', matches: 5 },
    { city: 'Toronto', country: 'Canada', flag: '🇨🇦', matches: 7 },
    { city: 'Vancouver', country: 'Canada', flag: '🇨🇦', matches: 6 },
  ];

  const KEY_FACTS = [
    { icon: '🌍', label: 'Nations', value: '48' },
    { icon: '⚽', label: 'Total Matches', value: '104' },
    { icon: '🏟️', label: 'Host Cities', value: '16' },
    { icon: '🌎', label: 'Host Countries', value: '3' },
    { icon: '📅', label: 'Tournament Start', value: 'June 11' },
    { icon: '🏆', label: 'Final', value: 'July 19' },
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
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
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
            background: 'radial-gradient(ellipse,rgba(46,158,94,0.08) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}/>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #2E9E5E',
            borderRadius: 999, padding: '6px 20px', marginBottom: 20,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
            <span style={{ fontSize: 12, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px' }}>
              LIVE · FIFA WORLD CUP 2026
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

          <p style={{
            fontSize: 'clamp(14px,2.5vw,18px)',
            color: '#9CA3AF', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 24px',
          }}>
            The 23rd FIFA World Cup. 48 nations. 104 matches. 16 host cities across
            USA, Canada and Mexico. The biggest football tournament in history.
          </p>

          {/* Key facts */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 8, maxWidth: 480, margin: '0 auto 28px',
          }}>
            {KEY_FACTS.map(({ icon, label, value }) => (
              <div key={label} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '12px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.5px' }}>{value}</div>
                <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '0.5px' }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{
              backgroundColor: '#2E9E5E', color: 'white',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 0 24px rgba(46,158,94,0.35)',
            }}>
              ⚽ Predict Matches →
            </a>
            <a href="/leaderboard" style={{
              backgroundColor: 'transparent', color: '#9CA3AF',
              padding: '14px 24px', borderRadius: 10, textDecoration: 'none',
              fontSize: 15, border: '1px solid #1A3A1A',
            }}>
              🏆 Leaderboard →
            </a>
          </div>
        </section>

        {/* ── ABOUT FIFA WORLD CUP 2026 ── */}
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
                {
                  title: 'Expanded Format',
                  content: 'For the first time, 48 nations compete — up from 32. The expanded format adds 16 more teams and 40 more matches, giving more nations than ever a chance to compete on the world stage.',
                },
                {
                  title: 'Three Host Nations',
                  content: 'USA, Canada and Mexico co-host the tournament across 16 cities — the first World Cup to be hosted across three nations simultaneously. The USA hosts 11 cities, Mexico 3, and Canada 2.',
                },
                {
                  title: 'Tournament Format',
                  content: '12 groups of 4 teams each. Top 2 from each group plus 8 best third-placed teams advance to the Round of 32. Then knockout rounds through to the Final on July 19 at MetLife Stadium, New Jersey.',
                },
                {
                  title: 'Historic Significance',
                  content: '2026 marks the 23rd FIFA World Cup and the centenary of the USA\'s first World Cup participation. The tournament is expected to generate $11 billion in economic impact across the three host nations.',
                },
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

        {/* ── UPCOMING MATCHES ── */}
        {upcomingMatches && upcomingMatches.length > 0 && (
          <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px' }}>
                  UPCOMING MATCHES
                </p>
                <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
                  Predict all →
                </a>
              </div>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: 14, overflow: 'hidden' }}>
                {upcomingMatches.map((match: any, i: number) => {
                  const kickoff = new Date(match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z');
                  const slug = `${match.home_team.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
                  return (
                    <a key={match.id} href={`/matches/${slug}`} className="match-row" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 20px', textDecoration: 'none',
                      borderTop: i === 0 ? 'none' : '1px solid #1A3A1A',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                          {match.home_team} vs {match.away_team}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          {kickoff.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
                        </div>
                      </div>
                      <div style={{
                        fontSize: 11, color: '#2E9E5E', fontWeight: 700,
                        backgroundColor: 'rgba(46,158,94,0.1)',
                        padding: '4px 10px', borderRadius: 999,
                      }}>
                        Predict →
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── RECENT RESULTS ── */}
        {completedMatches && completedMatches.length > 0 && (
          <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
                RECENT RESULTS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {completedMatches.map((match: any) => {
                  const winner = match.home_score > match.away_score ? 'home' :
                    match.away_score > match.home_score ? 'away' : 'draw';
                  return (
                    <div key={match.id} style={{
                      backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                      borderRadius: 10, padding: '14px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{
                        fontSize: 14, fontWeight: winner === 'home' ? 700 : 400,
                        color: winner === 'home' ? 'white' : '#6B7280', flex: 1,
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
                        fontSize: 14, fontWeight: winner === 'away' ? 700 : 400,
                        color: winner === 'away' ? 'white' : '#6B7280', flex: 1, textAlign: 'right',
                      }}>
                        {match.away_team}
                      </span>
                    </div>
                  );
                })}
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

        {/* ── PREDICT ON FLIPSEER ── */}
        <section style={{ padding: '48px 20px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
              Predict every World Cup match on Flipseer
            </h2>
            <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              Every prediction is locked before kickoff. No edits. No deletions.
              Your World Cup 2026 record is permanent — forever.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                { icon: '🆓', text: 'Free forever' },
                { icon: '🚫', text: 'No betting' },
                { icon: '🌍', text: 'Represent your nation' },
                { icon: '📖', text: 'Permanent record' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                  borderRadius: 999, padding: '5px 12px',
                  fontSize: 12, color: '#8895A3',
                }}>
                  {icon} {text}
                </div>
              ))}
            </div>
            <a href="/predict" style={{
              display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white',
              padding: '15px 40px', borderRadius: 10, textDecoration: 'none',
              fontSize: 16, fontWeight: 700,
              boxShadow: '0 0 24px rgba(46,158,94,0.3)',
            }}>
              Start Predicting Free →
            </a>
            <p style={{ fontSize: 11, color: '#4B5563', marginTop: 10 }}>
              {totalMatches} matches · 48 nations · Free forever
            </p>

            {/* Internal links */}
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {[
                { href: '/nations', label: '🌍 Nation Battle' },
                { href: '/leaderboard', label: '🏆 Leaderboard' },
                { href: '/india', label: '🇮🇳 India' },
                { href: '/indonesia', label: '🇮🇩 Indonesia' },
                { href: '/nigeria', label: '🇳🇬 Nigeria' },
                { href: '/brazil', label: '🇧🇷 Brazil' },
                { href: '/argentina', label: '🇦🇷 Argentina' },
                { href: '/england', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
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
