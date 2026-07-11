import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premier League Matchweek 1 Predictions 2026/27 | Flipseer',
  description: 'Predict all Premier League Matchweek 1 fixtures (August 21-24, 2026). Arsenal vs Coventry, Man Utd vs Hull, Newcastle vs Liverpool, Man City vs Bournemouth. Free. No betting.',
  keywords: 'Premier League Matchweek 1 predictions 2026, Arsenal vs Coventry prediction, Man United vs Hull prediction, Newcastle vs Liverpool prediction, EPL predictions free',
  alternates: { canonical: 'https://flipseer.com/epl/matchweek-1' },
  openGraph: {
    title: 'Premier League Matchweek 1 Predictions 2026/27 | Flipseer',
    description: 'Predict all 10 Matchweek 1 Premier League fixtures. Build your permanent football reputation. Free.',
    url: 'https://flipseer.com/epl/matchweek-1',
  },
};

const FIXTURES = [
  {
    date: 'Friday, 21 August 2026',
    matches: [
      { home: 'Arsenal', away: 'Coventry City', time: '20:00 BST', slug: 'arsenal-vs-coventry-city', big: true },
    ]
  },
  {
    date: 'Saturday, 22 August 2026',
    matches: [
      { home: 'Hull City', away: 'Manchester United', time: '12:30 BST', slug: 'hull-city-vs-manchester-united', big: true },
      { home: 'Everton', away: 'Crystal Palace', time: '15:00 BST', slug: 'everton-vs-crystal-palace', big: false },
      { home: 'Ipswich Town', away: 'Sunderland', time: '15:00 BST', slug: 'ipswich-town-vs-sunderland', big: false },
      { home: 'Nottingham Forest', away: 'Leeds United', time: '15:00 BST', slug: 'nottingham-forest-vs-leeds-united', big: false },
      { home: 'Brentford', away: 'Tottenham Hotspur', time: '17:30 BST', slug: 'brentford-vs-tottenham-hotspur', big: true },
    ]
  },
  {
    date: 'Sunday, 23 August 2026',
    matches: [
      { home: 'Brighton', away: 'Aston Villa', time: '14:00 BST', slug: 'brighton-vs-aston-villa', big: false },
      { home: 'Manchester City', away: 'Bournemouth', time: '14:00 BST', slug: 'manchester-city-vs-bournemouth', big: true },
      { home: 'Newcastle United', away: 'Liverpool', time: '16:30 BST', slug: 'newcastle-united-vs-liverpool', big: true },
    ]
  },
  {
    date: 'Monday, 24 August 2026',
    matches: [
      { home: 'Fulham', away: 'Chelsea', time: '20:00 BST', slug: 'fulham-vs-chelsea', big: true },
    ]
  },
];

export default function EPLMatchweek1Page() {
  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`.match-row:hover{background:rgba(139,92,246,0.08)!important}.match-row{transition:background 0.1s}`}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        padding: 'clamp(48px,10vw,80px) 20px clamp(40px,8vw,64px)',
        borderBottom: '1px solid #1A3A1A', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: 999, padding: '6px 20px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER LEAGUE 2026/27 · MATCHWEEK 1
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(26px,6vw,48px)',
          fontWeight: 900, letterSpacing: '-1px',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          Premier League<br/>
          <span style={{ color: '#8B5CF6' }}>Matchweek 1 Predictions</span>
        </h1>

        <p style={{
          fontSize: 'clamp(14px,2.5vw,17px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 24px',
        }}>
          August 21–24, 2026. 10 matches. Arsenal, Man Utd, Man City,
          Newcastle vs Liverpool, Chelsea and more. Predict every fixture
          and build your permanent Premier League reputation.
        </p>

        {/* Key stats */}
        <div style={{
          display: 'flex', gap: 24, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 28, fontSize: 13, color: '#8895A3',
        }}>
          {[
            { v: '10', l: 'Matches' },
            { v: 'Aug 21', l: 'First Kickoff' },
            { v: '🏅', l: 'Founding Badge' },
            { v: '🆓', l: 'Free Forever' },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#8B5CF6', marginBottom: 2 }}>{v}</div>
              <div>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{
            backgroundColor: '#8B5CF6', color: 'white',
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 0 24px rgba(139,92,246,0.35)',
          }}>
            Start Predicting Free →
          </a>
          <a href="/epl" style={{
            backgroundColor: 'transparent', color: '#9CA3AF',
            padding: '13px 20px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, border: '1px solid #1A3A1A',
          }}>
            ← EPL Overview
          </a>
        </div>
      </section>

      {/* ── FIXTURES ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 20 }}>
            MATCHWEEK 1 FIXTURES
          </p>

          {FIXTURES.map(({ date, matches }) => (
            <div key={date} style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#8895A3',
                letterSpacing: '0.5px', marginBottom: 10,
                paddingBottom: 8, borderBottom: '1px solid #1A3A1A',
              }}>
                {date}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matches.map(({ home, away, time, slug, big }) => (
                  <a key={slug} href={`/matches/${slug}`} className="match-row" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: '#0D2B14',
                    border: `1px solid ${big ? 'rgba(139,92,246,0.3)' : '#1A3A1A'}`,
                    borderRadius: 12, padding: '14px 18px', textDecoration: 'none',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{home}</span>
                        <span style={{ fontSize: 11, color: '#6B7280' }}>vs</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{away}</span>
                        {big && (
                          <span style={{
                            fontSize: 9, color: '#8B5CF6', fontWeight: 700,
                            backgroundColor: 'rgba(139,92,246,0.1)',
                            padding: '2px 7px', borderRadius: 999,
                          }}>BIG MATCH</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Premier League · {time}</div>
                    </div>
                    <div style={{
                      fontSize: 12, color: '#8B5CF6', fontWeight: 700,
                      backgroundColor: 'rgba(139,92,246,0.1)',
                      padding: '5px 12px', borderRadius: 999, flexShrink: 0,
                    }}>
                      Predict →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDING FORECASTER REMINDER ── */}
      <section style={{ padding: '48px 20px', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
          <h2 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, marginBottom: 10 }}>
            EPL Founding Forecaster Badge
          </h2>
          <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Predict at least 1 match this gameweek (Aug 21–24).
            Badge awarded permanently. Never available again.
          </p>
          <a href="/predict" style={{
            display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white',
            padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, fontWeight: 700, marginBottom: 16,
          }}>
            Start Predicting Free →
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              { href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL Overview' },
              { href: '/england', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/how-to-predict-football', label: '🧠 Prediction Guide' },
              { href: '/football-reputation', label: '⭐ Reputation' },
              { href: '/world-cup-2026', label: '🏆 World Cup 2026' },
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
  );
}
