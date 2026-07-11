import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premier League Matchweek 1 Predictions 2026/27 | Flipseer',
  description: 'Predict all Premier League Matchweek 1 fixtures (August 21-24, 2026). Arsenal vs Coventry, Man Utd vs Hull, Man City vs Bournemouth. Free. No betting. Permanent record.',
  keywords: 'Premier League predictions Matchweek 1 2026, Arsenal vs Coventry prediction, Man United vs Hull prediction, EPL predictions free, Premier League 2026 27 predictions',
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
      { home: 'Arsenal', away: 'Coventry City', time: 'Evening', slug: 'arsenal-vs-coventry-city', interest: 'high' },
    ]
  },
  {
    date: 'Saturday, 22 August 2026',
    matches: [
      { home: 'Hull City', away: 'Manchester United', time: 'Afternoon', slug: 'hull-city-vs-manchester-united', interest: 'high' },
      { home: 'Everton', away: 'Crystal Palace', time: 'Afternoon', slug: 'everton-vs-crystal-palace', interest: 'medium' },
      { home: 'Ipswich Town', away: 'Sunderland', time: 'Afternoon', slug: 'ipswich-town-vs-sunderland', interest: 'medium' },
      { home: 'Nottingham Forest', away: 'Leeds United', time: 'Afternoon', slug: 'nottingham-forest-vs-leeds-united', interest: 'medium' },
      { home: 'Brentford', away: 'Tottenham Hotspur', time: 'Afternoon', slug: 'brentford-vs-tottenham-hotspur', interest: 'high' },
    ]
  },
  {
    date: 'Sunday, 23 August 2026',
    matches: [
      { home: 'Brighton', away: 'Aston Villa', time: 'Afternoon', slug: 'brighton-vs-aston-villa', interest: 'medium' },
      { home: 'Manchester City', away: 'Bournemouth', time: '14:00 BST', slug: 'manchester-city-vs-bournemouth', interest: 'high' },
      { home: 'Newcastle United', away: 'Liverpool', time: '16:30 BST', slug: 'newcastle-united-vs-liverpool', interest: 'high' },
    ]
  },
  {
    date: 'Monday, 24 August 2026',
    matches: [
      { home: 'Fulham', away: 'Chelsea', time: 'Evening', slug: 'fulham-vs-chelsea', interest: 'high' },
    ]
  },
];

const CLUB_NATIONS: Record<string, string> = {
  'Arsenal': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Coventry City': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Hull City': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Manchester United': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Everton': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Crystal Palace': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Brentford': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Tottenham Hotspur': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Brighton': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Aston Villa': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Manchester City': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Bournemouth': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Fulham': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Chelsea': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Ipswich Town': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Sunderland': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Nottingham Forest': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Leeds United': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
};

export default function EPLMatchweek1Page() {
  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        .match-card:hover{border-color:#8B5CF6!important;transform:translateY(-1px)}
        .match-card{transition:all 0.15s}
      `}</style>

      {/* Hero */}
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
          August 21–24, 2026. 9 matches. Arsenal, Man Utd, Man City, Chelsea and more.
          Predict every fixture and build your permanent Premier League reputation.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 24, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 28, fontSize: 13, color: '#8895A3',
        }}>
          {[
            { v: '9', l: 'Matches' },
            { v: 'Aug 21', l: 'First Kickoff' },
            { v: '🆓', l: 'Free Forever' },
            { v: '🔒', l: 'No Betting' },
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
            Predict Matchweek 1 →
          </a>
          <a href="/epl" style={{
            backgroundColor: 'transparent', color: '#9CA3AF',
            padding: '13px 20px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, border: '1px solid #1A3A1A',
          }}>
            EPL Overview →
          </a>
        </div>
      </section>

      {/* Fixtures by day */}
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
                {matches.map(({ home, away, time, slug, interest }) => (
                  <a key={slug} href={`/matches/${slug}`} className="match-card" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: '#0D2B14',
                    border: `1px solid ${interest === 'high' ? 'rgba(139,92,246,0.3)' : '#1A3A1A'}`,
                    borderRadius: 12, padding: '14px 18px',
                    textDecoration: 'none',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
                          {home}
                        </span>
                        <span style={{ fontSize: 11, color: '#6B7280' }}>vs</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
                          {away}
                        </span>
                        {interest === 'high' && (
                          <span style={{
                            fontSize: 9, color: '#8B5CF6', fontWeight: 700,
                            backgroundColor: 'rgba(139,92,246,0.1)',
                            padding: '2px 7px', borderRadius: 999, letterSpacing: '0.5px',
                          }}>
                            BIG MATCH
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>
                        Premier League · {time}
                      </div>
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

      {/* Why predict EPL */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textAlign: 'center' }}>
            WHY PREDICT EPL ON FLIPSEER
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '📖', title: 'Permanent record', desc: '380 EPL matches. Every prediction locked forever. Your football CV grows all season.' },
              { icon: '🌍', title: 'Nation Battle continues', desc: 'EPL points add to your World Cup total. One reputation across every competition.' },
              { icon: '🏅', title: 'EPL Founding Forecaster', desc: 'Predict in Matchweek 1 (Aug 21-24). Exclusive badge — never available again.' },
              { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card required. Pure football intelligence.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 12, padding: '18px 16px',
              }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Forecaster CTA */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏅</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>
            EPL Founding Forecaster Badge
          </h2>
          <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Predict at least 1 match in Matchweek 1 (August 21–24, 2026).
            Badge awarded permanently. Never available again after Matchweek 1 ends.
          </p>
          <a href="/epl" style={{
            display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white',
            padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, fontWeight: 700, marginBottom: 16,
            boxShadow: '0 0 24px rgba(139,92,246,0.3)',
          }}>
            Join EPL Waitlist →
          </a>

          {/* Internal links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {[
              { href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL Overview' },
              { href: '/england', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England Nation' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/how-to-predict-football', label: '🧠 Prediction Guide' },
              { href: '/football-reputation', label: '⭐ Football Reputation' },
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
