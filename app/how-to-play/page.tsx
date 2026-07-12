import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Flipseer Works | Football Prediction Scoring Guide',
  description: 'Learn how Flipseer football prediction scoring works. Earn points for correct outcomes, exact scores, upsets and confidence. Build your permanent football reputation. Free.',
  keywords: 'how football prediction scoring works, FIFA World Cup prediction rules, EPL prediction leaderboard, best football prediction platform free, football prediction reputation system',
  alternates: { canonical: 'https://flipseer.com/how-to-play' },
  openGraph: {
    title: 'How Flipseer Works | Football Prediction Scoring',
    description: 'How football prediction scoring works on Flipseer. Earn up to 108 points per match. Build permanent football reputation. Free.',
    url: 'https://flipseer.com/how-to-play',
  },
};

export default function HowToPlayPage() {
  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        padding: 'clamp(48px,10vw,80px) 20px clamp(40px,8vw,64px)',
        borderBottom: '1px solid #1A3A1A', textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(28px,6vw,48px)',
          fontWeight: 900, letterSpacing: '-1px',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          How Flipseer Works
        </h1>
        <p style={{
          fontSize: 'clamp(14px,2.5vw,17px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 24px',
        }}>
          Predict football matches before kickoff. Earn reputation points.
          Build your permanent Football Reputation. Free forever. No betting.
        </p>
        <a href="/predict" style={{
          display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white',
          padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
          fontSize: 14, fontWeight: 700,
        }}>
          Start Predicting Free →
        </a>
      </section>

      {/* Featured snippet sections — each answers one search query */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Snippet 1 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            How does football prediction scoring work on Flipseer?
          </h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 12 }}>
            Flipseer awards points based on prediction accuracy and confidence. Correct outcome earns 10 points, exact score earns 55 bonus points, upset bonus adds 12 points, and confidence multipliers range from 0.8× to 1.4×. Maximum 108 points per match.
          </p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
            {[
              { label: 'Correct outcome', pts: '+10 pts' },
              { label: 'Goal difference bonus', pts: '+18 pts' },
              { label: 'Exact score bonus', pts: '+55 pts' },
              { label: 'Upset bonus', pts: '+12 pts' },
              { label: 'Confidence 80%+', pts: '×1.4' },
              { label: 'Confidence 60-79%', pts: '×1.2' },
              { label: 'Confidence 40-59%', pts: '×1.0' },
              { label: 'Confidence below 40%', pts: '×0.8' },
              { label: 'Maximum per match', pts: '108 pts' },
            ].map(({ label, pts }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 16px',
                borderTop: i === 0 ? 'none' : '1px solid #1A3A1A',
                backgroundColor: i === 8 ? 'rgba(46,158,94,0.08)' : 'transparent',
              }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>{pts}</span>
              </div>
            ))}
          </div>

          {/* Snippet 2 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            What is the best football prediction platform for free?
          </h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 12 }}>
            Flipseer is the only free football prediction platform that builds a permanent reputation record. Unlike betting sites or fantasy apps, Flipseer tracks your prediction accuracy across every competition forever — World Cup, EPL, Champions League — with no ads, no prizes, and no gambling.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginBottom: 32 }}>
            {[
              { icon: '🆓', title: 'Free forever', desc: 'No subscription, no premium tier' },
              { icon: '🚫', title: 'No betting', desc: 'Zero gambling. Pure football knowledge' },
              { icon: '📖', title: 'Permanent record', desc: 'Your predictions locked forever' },
              { icon: '🌍', title: 'Nation Battle', desc: 'Compete globally for your country' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '14px' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#8895A3' }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Snippet 3 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            How does the EPL prediction leaderboard work?
          </h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 12 }}>
            The EPL prediction leaderboard on Flipseer ranks forecasters by total points earned across all Premier League matches. Points accumulate from World Cup 2026 and continue into EPL 2026/27 — one permanent reputation across every competition. Nation Battle shows which country has the most accurate collective forecasters.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { href: '/leaderboard', label: '🏆 Global Leaderboard' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                display: 'inline-block', backgroundColor: '#0D2B14',
                border: '1px solid #1A7A4A', borderRadius: 8, padding: '8px 16px',
                textDecoration: 'none', fontSize: 13, color: '#2E9E5E', fontWeight: 600,
              }}>{label}</a>
            ))}
          </div>

          {/* Snippet 4 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            What is Football Reputation?
          </h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 12 }}>
            Football Reputation is your permanent public record of prediction accuracy on Flipseer. Like a chess Elo rating, it reflects your football intelligence over time — every correct prediction, exact score, and upset called correctly builds your reputation permanently across World Cup, EPL, and Champions League.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { href: '/football-reputation', label: '⭐ What is Football Reputation?' },
              { href: '/how-to-predict-football', label: '🧠 Prediction Guide' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                display: 'inline-block', backgroundColor: '#0D2B14',
                border: '1px solid #1A7A4A', borderRadius: 8, padding: '8px 16px',
                textDecoration: 'none', fontSize: 13, color: '#2E9E5E', fontWeight: 600,
              }}>{label}</a>
            ))}
          </div>

          {/* Snippet 5 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            FIFA World Cup 2026 prediction rules
          </h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 12 }}>
            On Flipseer, FIFA World Cup 2026 predictions must be submitted before kickoff. Once the match starts, predictions lock permanently — no edits, no deletions. Predict the outcome (home/draw/away), optional exact score, and set your confidence level (1-100%). Points are awarded after the final whistle.
          </p>
          <a href="/world-cup-2026" style={{
            display: 'inline-block', backgroundColor: '#0D2B14',
            border: '1px solid #1A7A4A', borderRadius: 8, padding: '8px 16px',
            textDecoration: 'none', fontSize: 13, color: '#2E9E5E', fontWeight: 600,
            marginBottom: 32,
          }}>🏆 World Cup 2026 Hub →</a>

        </div>
      </section>

      {/* Rank system */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Football Reputation Ranks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
            {[
              { icon: '🥉', rank: 'Rookie', pts: '0–49 pts', color: '#9CA3AF' },
              { icon: '🎯', rank: 'Predictor', pts: '50–199 pts', color: '#2E9E5E' },
              { icon: '🔥', rank: 'Expert', pts: '200–499 pts', color: '#F59E0B' },
              { icon: '⭐', rank: 'Elite', pts: '500–999 pts', color: '#8B5CF6' },
              { icon: '👑', rank: 'Legend', pts: '1000+ pts', color: '#EF4444' },
            ].map(({ icon, rank, pts, color }) => (
              <div key={rank} style={{
                backgroundColor: '#0D2B14', border: `1px solid ${color}30`,
                borderRadius: 12, padding: '16px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color, marginBottom: 4 }}>{rank}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{pts}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <a href="/predict" style={{
            display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white',
            padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, fontWeight: 700, marginBottom: 20,
            boxShadow: '0 0 24px rgba(46,158,94,0.3)',
          }}>
            Start Predicting Free →
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              { href: '/world-cup-2026', label: '🏆 World Cup 2026' },
              { href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27' },
              { href: '/leaderboard', label: '📊 Leaderboard' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/how-to-predict-football', label: '🧠 Prediction Guide' },
              { href: '/football-reputation', label: '⭐ Football Reputation' },
              { href: '/india', label: '🇮🇳 India' },
              { href: '/nigeria', label: '🇳🇬 Nigeria' },
              { href: '/indonesia', label: '🇮🇩 Indonesia' },
              { href: '/england', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                display: 'inline-block', backgroundColor: '#0D2B14',
                border: '1px solid #1A3A1A', borderRadius: 8, padding: '7px 14px',
                textDecoration: 'none', fontSize: 12, color: '#8895A3',
              }}>{label}</a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
