import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Football Reputation — Like a Chess Rating for Football | Flipseer',
  description: 'Build your permanent Football Reputation. Like an Elo rating for football intelligence. Every prediction locked before kickoff. Your record grows across every competition. Free forever.',
  keywords: 'football reputation, football prediction rating, football intelligence score, EPL predictions, football forecaster ranking',
  alternates: { canonical: 'https://flipseer.com/football-reputation' },
  openGraph: {
    title: 'Football Reputation — Like a Chess Rating for Football | Flipseer',
    description: 'Your permanent football intelligence record. Predict. Prove. Repeat.',
    url: 'https://flipseer.com/football-reputation',
  },
}

export default function FootballReputationPage() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .card:hover { border-color: rgba(139,92,246,0.6) !important; transform: translateY(-2px); }
        .card { transition: all 0.2s ease; }
      `}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(64px,12vw,100px) 20px clamp(48px,8vw,80px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(139,92,246,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px' }}>FOOTBALL REPUTATION</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,8vw,72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 20 }}>
          Like a chess rating.<br /><span style={{ color: '#8B5CF6' }}>But for football intelligence.</span>
        </h1>
        <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px' }}>
          Chess players have a permanent Elo rating. Flipseer gives football fans the same — a score that reflects your prediction intelligence across every competition. Forever.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,44px)', fontSize: 'clamp(14px,2.5vw,17px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 40px rgba(139,92,246,0.35)' }}>
            ⚽ Start Building Your Reputation →
          </a>
          <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,28px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🏆 View Leaderboard →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 14 }}>Free forever · No betting · No card required</p>
      </section>

      {/* THREE ANALOGIES */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 8, textAlign: 'center' }}>THE CONCEPT</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', textAlign: 'center', marginBottom: 48, fontWeight: 800 }}>You already understand this.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              {
                platform: 'Chess.com',
                icon: '♟️',
                color: '#F59E0B',
                concept: 'Elo Rating',
                desc: 'Chess players have a permanent rating that reflects their skill. It rises when you win, falls when you lose. Everyone knows what 1800 means.',
                flipseer: 'Flipseer gives football fans the same — a score that reflects your prediction intelligence. Rising with every correct call. Permanent. Honest.',
              },
              {
                platform: 'LinkedIn',
                icon: '💼',
                color: '#0A66C2',
                concept: 'Professional Reputation',
                desc: 'LinkedIn shows your professional history permanently. Every job, every achievement — on record forever. Your career in one place.',
                flipseer: 'Flipseer shows your football prediction history permanently. Every call you made — locked in time. Your football intelligence in one place.',
              },
              {
                platform: 'GitHub',
                icon: '⌨️',
                color: '#8B5CF6',
                concept: 'Contribution Graph',
                desc: 'GitHub shows what developers have built over years. A green graph of consistent work — proof of who you are as a developer.',
                flipseer: 'Flipseer shows what predictions you have made — your football intelligence record over every competition. Proof of who you are as a football mind.',
              },
            ].map(({ platform, icon, color, concept, desc, flipseer }) => (
              <div key={platform} className="card" style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle,${color}15 0%,transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '2px', marginBottom: 4 }}>{platform}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: 'white', marginBottom: 12, fontWeight: 700 }}>{concept}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 14 }}>{desc}</p>
                <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: 14 }}>
                  <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: '2px', marginBottom: 6 }}>FLIPSEER</div>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>{flipseer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 8, textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', textAlign: 'center', marginBottom: 40, fontWeight: 800 }}>Simple. Honest. Permanent.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { step: '01', title: 'Predict before kickoff', desc: 'Pick the outcome. Set your confidence. Submit. Your call is now on record.', color: '#8B5CF6' },
              { step: '02', title: 'Predictions lock at kickoff', desc: 'No editing. No second chances. Your intelligence is tested honestly — exactly like a chess move.', color: '#F59E0B' },
              { step: '03', title: 'Points awarded after full time', desc: 'Correct outcome, exact score, upset calls, confidence multipliers — all calculated automatically.', color: '#2E9E5E' },
              { step: '04', title: 'Your reputation grows permanently', desc: 'Every prediction adds to your permanent record. EPL + UCL + Liga 1 + Ghana PL — one score, forever.', color: '#CE1126' },
              { step: '05', title: 'Rank globally and by nation', desc: 'See how you compare with every football fan on Flipseer. Compete individually and represent your nation.', color: '#A78BFA' },
            ].map(({ step, title, desc, color }, i) => (
              <div key={step} style={{ display: 'flex', gap: 20, padding: '20px 0', borderBottom: i < 4 ? '1px solid #1A3A1A' : 'none', animation: `slideUp 0.4s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: 12, color, fontWeight: 900, fontFamily: 'Georgia, serif', minWidth: 28, paddingTop: 2 }}>{step}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOUR REPUTATION SHOWS */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 8, textAlign: 'center' }}>YOUR FOOTBALL REPUTATION SHOWS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', textAlign: 'center', marginBottom: 40, fontWeight: 800 }}>Everything. Permanently.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '🏆', label: 'Total Points', desc: 'Cumulative score across all competitions' },
              { icon: '🎯', label: 'Accuracy %', desc: 'What percentage of your predictions were correct' },
              { icon: '⭐', label: 'Exact Scores', desc: 'Times you called the precise scoreline' },
              { icon: '🔥', label: 'Current Streak', desc: 'Consecutive correct predictions right now' },
              { icon: '📈', label: 'Global Rank', desc: 'Where you stand among all Flipseer forecasters' },
              { icon: '🌍', label: 'Nation Rank', desc: 'Your contribution to your country in Nation Battle' },
              { icon: '🏅', label: 'Badges', desc: 'Achievements earned — upset caller, exact score king, streak holder' },
              { icon: '📅', label: 'Full History', desc: 'Every prediction ever made — locked in time' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 12, padding: '18px 16px' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 8 }}>ONE REPUTATION. EVERY COMPETITION.</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,32px)', marginBottom: 12, fontWeight: 800 }}>Your points never reset.</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Every competition adds to the same permanent score. Your Football Reputation grows year after year.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { label: 'World Cup 2026', color: '#2E9E5E', status: 'Archive' },
              { label: 'EPL 2026/27', color: '#8B5CF6', status: 'Live' },
              { label: 'Liga 1 2026/27', color: '#CE1126', status: 'Live' },
              { label: 'Ghana PL 2026/27', color: '#F59E0B', status: 'Live' },
              { label: 'UCL 2026/27', color: '#A78BFA', status: 'Sep 17' },
              { label: 'ISL 2026/27', color: '#FF6B35', status: 'Oct 10' },
              { label: 'NPFL 2026/27', color: '#008751', status: 'Jan 2027' },
            ].map(({ label, color, status }) => (
              <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: color + '15', border: `1px solid ${color}50`, borderRadius: 999, padding: '6px 16px' }}>
                <span style={{ fontSize: 12, color, fontWeight: 700 }}>{label}</span>
                <span style={{ fontSize: 9, backgroundColor: color, color: 'white', padding: '2px 6px', borderRadius: 999, fontWeight: 700 }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: 'clamp(64px,10vw,96px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚽</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, lineHeight: 1.1 }}>
            Don&apos;t just say you know football.<br /><span style={{ color: '#8B5CF6' }}>Prove it.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Predict. Prove. Repeat. Your Football Reputation starts with your first prediction.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '16px 48px', borderRadius: 12, textDecoration: 'none', fontSize: 17, fontWeight: 700, boxShadow: '0 0 40px rgba(139,92,246,0.35)', marginBottom: 16 }}>
            ⚽ Start Predicting Free →
          </a>
          <br />
          <a href="/leaderboard" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
            View global leaderboard →
          </a>
        </div>
      </section>
    </main>
  )
}
