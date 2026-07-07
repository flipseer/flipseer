import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Predict Football Accurately | Football Intelligence Guide | Flipseer',
  description: 'Learn how to predict football matches accurately. Tips on reading form, home advantage, confidence calibration and building a permanent football reputation. Free guide.',
  keywords: 'how to predict football, football prediction tips, predict football accurately, football betting free, football intelligence, World Cup predictions tips',
  alternates: { canonical: 'https://flipseer.com/how-to-predict-football' },
  openGraph: {
    title: 'How to Predict Football Accurately | Flipseer',
    description: 'Learn the science of football prediction. Build your permanent reputation. Free guide.',
    url: 'https://flipseer.com/how-to-predict-football',
  },
};

const TIPS = [
  {
    number: '01',
    icon: '📊',
    title: 'Study recent form — not reputation',
    content: 'A team\'s last 5 matches matter more than their historical reputation. Brazil may be 5-time World Cup winners, but if they\'ve lost 3 of their last 5, their current form is weak. Always check recent results, not legacy.',
    stat: 'Teams in good form (W3+ of last 5) win 68% of matches as favourites.',
  },
  {
    number: '02',
    icon: '🏠',
    title: 'Home advantage is real — but varies',
    content: 'Home advantage adds roughly 0.3-0.5 goals to the expected margin. However in neutral-venue tournaments like the World Cup, this effect disappears. At the World Cup, focus on quality and form over home/away splits.',
    stat: 'Home teams win 46% of league matches vs 38% at neutral venues.',
  },
  {
    number: '03',
    icon: '🎯',
    title: 'Calibrate your confidence correctly',
    content: 'Most predictors are overconfident. If you predict at 80% confidence, you should be correct 80% of the time on those calls. Track your accuracy vs confidence over time — this gap reveals your calibration errors.',
    stat: 'Top forecasters on Flipseer show <10% gap between confidence and accuracy.',
  },
  {
    number: '04',
    icon: '😱',
    title: 'Upsets follow patterns',
    content: 'True upsets are rare but not random. They happen more in: knockout rounds (pressure), extreme weather, when favourites have key injuries, or when underdogs are playing for survival. Identifying these contexts increases upset prediction accuracy.',
    stat: 'Correctly calling an upset at 40% confidence earns 3× more points on Flipseer.',
  },
  {
    number: '05',
    icon: '🔒',
    title: 'Lock in before kickoff — no changing',
    content: 'The best predictors commit to their call and don\'t second-guess. Last-minute team news can change everything, but the discipline of locking in a prediction before kickoff separates genuine football intelligence from reactive guessing.',
    stat: 'Flipseer locks all predictions at kickoff — no edits, no deletions. Permanent record.',
  },
  {
    number: '06',
    icon: '📈',
    title: 'Track your record — learn from losses',
    content: 'The most valuable thing you can do is review your wrong predictions. Were you overconfident? Did you ignore form? Did you pick based on fan bias? Your prediction journal is a learning tool, not just a scoreboard.',
    stat: 'Users who review their journal weekly improve accuracy by 12% over 3 months.',
  },
];

export default function HowToPredictPage() {
  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        .tip-card:hover{border-color:#2E9E5E!important}
        .tip-card{transition:border-color 0.15s}
      `}</style>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        padding: 'clamp(48px,10vw,80px) 20px clamp(40px,8vw,64px)',
        borderBottom: '1px solid #1A3A1A', textAlign: 'center',
      }}>
        <div style={{ fontSize: 'clamp(48px,12vw,72px)', marginBottom: 16 }}>🧠</div>
        <h1 style={{
          fontSize: 'clamp(28px,6vw,48px)',
          fontWeight: 900, letterSpacing: '-1px',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          How to Predict Football<br/>
          <span style={{ color: '#2E9E5E' }}>Accurately</span>
        </h1>
        <p style={{
          fontSize: 'clamp(14px,2.5vw,17px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 28px',
        }}>
          Football prediction is a skill, not luck. The best predictors study form,
          understand probability, and track their record over time. Here's how.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{
            backgroundColor: '#2E9E5E', color: 'white',
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, fontWeight: 700,
          }}>
            Start Predicting Free →
          </a>
          <a href="/leaderboard" style={{
            backgroundColor: 'transparent', color: '#9CA3AF',
            padding: '13px 20px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, border: '1px solid #1A3A1A',
          }}>
            See Top Predictors →
          </a>
        </div>
      </section>

      {/* Tips */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>
            6 PRINCIPLES OF ACCURATE FOOTBALL PREDICTION
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TIPS.map(({ number, icon, title, content, stat }) => (
              <div key={number} className="tip-card" style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 14, padding: '24px 20px',
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: 11, color: '#2E9E5E', fontWeight: 700,
                    letterSpacing: '1px', minWidth: 28, paddingTop: 3,
                  }}>
                    {number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{icon}</span>
                      <h2 style={{ fontSize: 16, fontWeight: 800, color: 'white', margin: 0 }}>{title}</h2>
                    </div>
                    <p style={{ fontSize: 14, color: '#8895A3', lineHeight: 1.7, marginBottom: 10 }}>{content}</p>
                    <div style={{
                      backgroundColor: 'rgba(46,158,94,0.08)', border: '1px solid #1A7A4A',
                      borderRadius: 8, padding: '8px 12px',
                      fontSize: 12, color: '#2E9E5E', lineHeight: 1.5,
                    }}>
                      📊 {stat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Flipseer */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16, textAlign: 'center' }}>
            WHY FLIPSEER IS DIFFERENT
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20, textAlign: 'center' }}>
            Your predictions become a permanent record.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '🔒', title: 'Locked before kickoff', desc: 'No editing after the whistle. Your call stands forever.' },
              { icon: '📖', title: 'Permanent journal', desc: 'Every prediction in a public timeline. Your football CV.' },
              { icon: '🌍', title: 'Nation Battle', desc: 'Predictions earn points for your nation globally.' },
              { icon: '🆓', title: 'Free forever', desc: 'No betting. No prizes. Pure football intelligence.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 12, padding: '18px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links + CTA */}
      <section style={{ padding: '56px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, marginBottom: 12 }}>
            Start building your football reputation today.
          </h2>
          <p style={{ color: '#8895A3', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Free forever. No betting. No card required. Just pure football intelligence.
          </p>
          <a href="/predict" style={{
            display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white',
            padding: '15px 40px', borderRadius: 10, textDecoration: 'none',
            fontSize: 16, fontWeight: 700, marginBottom: 24,
            boxShadow: '0 0 24px rgba(46,158,94,0.3)',
          }}>
            Predict World Cup 2026 Free →
          </a>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              { href: '/world-cup-2026', label: '🏆 World Cup 2026' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/leaderboard', label: '📊 Leaderboard' },
              { href: '/football-reputation', label: '⭐ Football Reputation' },
              { href: '/india', label: '🇮🇳 India' },
              { href: '/nigeria', label: '🇳🇬 Nigeria' },
              { href: '/indonesia', label: '🇮🇩 Indonesia' },
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
