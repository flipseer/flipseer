import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Football Reputation | Permanent Football Record | Flipseer',
  description: 'Football Reputation is your permanent record of football prediction accuracy. Every correct call, exact score and upset earns reputation that grows forever. No betting.',
  keywords: 'football reputation, permanent football record, football prediction reputation, football intelligence score, football forecaster, build football reputation',
  alternates: { canonical: 'https://flipseer.com/football-reputation' },
  openGraph: {
    title: 'What is Football Reputation? | Flipseer',
    description: 'Your permanent record of football intelligence. Every prediction locked before kickoff. No edits. No deletions. Forever.',
    url: 'https://flipseer.com/football-reputation',
  },
};

export default function FootballReputationPage() {
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
        <div style={{ fontSize: 'clamp(48px,12vw,72px)', marginBottom: 16 }}>⭐</div>
        <h1 style={{
          fontSize: 'clamp(28px,6vw,48px)',
          fontWeight: 900, letterSpacing: '-1px',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          What is<br/>
          <span style={{ color: '#2E9E5E' }}>Football Reputation?</span>
        </h1>
        <p style={{
          fontSize: 'clamp(14px,2.5vw,17px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 28px',
        }}>
          Football Reputation is your permanent, public record of football prediction accuracy.
          It grows with every correct call and never resets. It's your football identity — forever.
        </p>
        <a href="/predict" style={{
          display: 'inline-block',
          backgroundColor: '#2E9E5E', color: 'white',
          padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
          fontSize: 15, fontWeight: 700,
          boxShadow: '0 0 24px rgba(46,158,94,0.3)',
        }}>
          Build Your Reputation Free →
        </a>
      </section>

      {/* What it is */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            THE CONCEPT
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20, lineHeight: 1.2 }}>
            Like a chess rating. But for football intelligence.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {[
              {
                comparison: 'Chess.com',
                what: 'Elo rating',
                flipseer: 'Football Reputation Score',
                desc: 'Chess players have a permanent rating that reflects their skill. Flipseer gives football fans the same — a score that reflects your prediction intelligence across every competition.',
              },
              {
                comparison: 'LinkedIn',
                what: 'Professional reputation',
                flipseer: 'Football reputation',
                desc: 'LinkedIn shows your professional history permanently. Flipseer shows your football prediction history permanently — every call you\'ve made, locked in time.',
              },
              {
                comparison: 'GitHub',
                what: 'Developer contributions',
                flipseer: 'Prediction history',
                desc: 'GitHub shows what developers have built over years. Flipseer shows what predictions you\'ve made — your football intelligence record over every competition.',
              },
            ].map(({ comparison, what, flipseer, desc }) => (
              <div key={comparison} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 12, padding: '20px',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, letterSpacing: '1px' }}>{comparison}</span>
                  <span style={{ fontSize: 11, color: '#1A3A1A' }}>→</span>
                  <span style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700 }}>{what}</span>
                </div>
                <div style={{ fontSize: 13, color: '#8895A3', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            HOW REPUTATION IS BUILT
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎯', pts: '+10', label: 'Correct outcome', desc: 'Predict the right winner or draw' },
              { icon: '📊', pts: '+18', label: 'Goal difference bonus', desc: 'Predict the correct margin of victory' },
              { icon: '✨', pts: '+55', label: 'Exact score bonus', desc: 'Predict the exact final score' },
              { icon: '😱', pts: '+12', label: 'Upset bonus', desc: 'Correctly call an underdog victory' },
              { icon: '🔥', pts: '×1.4', label: 'Confidence multiplier', desc: 'Higher confidence on correct calls = more points' },
            ].map(({ icon, pts, label, desc }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#8895A3' }}>{desc}</div>
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 800, color: '#F59E0B',
                  backgroundColor: 'rgba(245,158,11,0.1)',
                  padding: '4px 10px', borderRadius: 8, flexShrink: 0,
                }}>
                  {pts}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#4B5563', marginTop: 12, textAlign: 'center' }}>
            Maximum 108 points per match · Reputation never resets
          </p>
        </div>
      </section>

      {/* Rank system */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textAlign: 'center' }}>
            REPUTATION RANKS
          </p>
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

      {/* Permanent record */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textAlign: 'center' }}>
            WHY PERMANENT?
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20, textAlign: 'center', lineHeight: 1.2 }}>
            Your football memory fades.<br/>Your football reputation doesn't.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Every prediction locked before kickoff — no editing after the whistle',
              'Your full prediction history visible on your public profile forever',
              'World Cup → EPL → Champions League → La Liga — one record, every competition',
              'Your reputation follows you across every football season permanently',
              'Share your journal — your friends can see your actual record, not just your claims',
            ].map((point, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '12px 16px',
              }}>
                <span style={{ color: '#2E9E5E', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#8895A3', lineHeight: 1.6 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '56px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, marginBottom: 12 }}>
            Start your permanent football record today.
          </h2>
          <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Free forever. No betting. Predict World Cup 2026 and EPL 2026/27.
            Your reputation starts with your first prediction.
          </p>
          <a href="/predict" style={{
            display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white',
            padding: '15px 40px', borderRadius: 10, textDecoration: 'none',
            fontSize: 16, fontWeight: 700, marginBottom: 24,
            boxShadow: '0 0 24px rgba(46,158,94,0.3)',
          }}>
            Start Predicting Free →
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              { href: '/how-to-predict-football', label: '🧠 How to Predict' },
              { href: '/world-cup-2026', label: '🏆 World Cup 2026' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/leaderboard', label: '📊 Leaderboard' },
              { href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27' },
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
