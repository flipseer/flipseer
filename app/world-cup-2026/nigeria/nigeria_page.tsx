import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nigeria World Cup 2026 Predictions | Flipseer — Super Eagles',
  description: 'Predict FIFA World Cup 2026 matches and represent Nigeria on the global leaderboard. Build your permanent football reputation. Free. No betting.',
  keywords: 'Nigeria world cup 2026 predictions, nigeria football predictor, FIFA world cup 2026 nigeria, nigeria football forecast',
  openGraph: {
    title: 'Nigeria World Cup 2026 Predictions | Flipseer — Super Eagles',
    description: 'Predict FIFA World Cup 2026 matches and represent Nigeria on the global leaderboard. Build your permanent football reputation. Free. No betting.',
    url: 'https://flipseer.com/world-cup-2026/nigeria',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nigeria World Cup 2026 Predictions | Flipseer — Super Eagles',
    description: 'Predict FIFA World Cup 2026 matches and represent Nigeria on the global leaderboard. Build your permanent football reputation. Free. No betting.',
  },
  alternates: {
    canonical: 'https://flipseer.com/world-cup-2026/nigeria',
  },
}

export default function NigeriaWorldCup2026() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '96px', marginBottom: '16px', lineHeight: 1 }}>🇳🇬</div>
          <div style={{ display: 'inline-block', backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '6px 20px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 · NIGERIA</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: '1.2', marginBottom: '16px' }}>
            Super Eagles Fans. World-Class Predictors.
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '32px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 32px' }}>
            Nigeria's football passion is unmatched. Prove it.<br />
            <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation on Flipseer.</strong>
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#2E9E5E', color: '#0D1F0F', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 30px #2E9E5E40' }}>
              Predict for Nigeria →
            </a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
              Join Free
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTBALL CULTURE ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>FOOTBALL CULTURE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '24px', lineHeight: '1.3' }}>
            Why Nigeria fans belong on Flipseer.
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px', textAlign: 'center' }}>
            Nigeria doesn't just produce football stars — it produces the most passionate fans on the planet. From Lagos to Abuja, football is life. The Super Eagles carry an entire nation's pride.
          </p>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8', textAlign: 'center' }}>
            Nigerian fans have always believed their football intelligence is world-class. Now Flipseer gives you the platform to prove it — permanently, publicly, and globally.
          </p>
        </div>
      </section>

      {/* ── FAVOURITE TEAMS ── */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>TEAMS TO WATCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            Teams Nigeria fans love.
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
            Predict their matches. Build your record.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇳🇬</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Nigeria</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇧🇷</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Brazil</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇦🇷</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Argentina</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>England</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇫🇷</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>France</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇸🇳</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Senegal</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇲🇦</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Morocco</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🇩🇪</div>
              <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>Germany</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS FOR NIGERIA ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>
            Represent Nigeria. Earn your legacy.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', icon: '🎯', title: 'Predict Every Match', desc: 'Pick winners and exact scores before kick-off. Up to 8 predictions per day.' },
              { step: '02', icon: '🔒', title: 'Your Record Is Locked', desc: 'Once the whistle blows, your call is permanent. No edits. Your word stands.' },
              { step: '03', icon: '🌍', title: 'Lift Nigeria's Ranking', desc: 'Every correct prediction earns points for Nigeria's position on the global leaderboard.' },
              { step: '04', icon: '👑', title: 'Build Your Legacy', desc: 'Tournament after tournament, your permanent record grows. Be the top predictor from Nigeria.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{}</div>
                <div style={{ fontSize: '15px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NATIONAL LEADERBOARD ── */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>NATIONAL LEADERBOARD</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>
            Top Nigeria Predictors
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>
            Who is the #1 football mind in Nigeria? Join now to claim your spot.
          </p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
              <span>RANK · PREDICTOR</span>
              <span>POINTS</span>
            </div>
            {[
              { rank: '🥇', label: 'First to join becomes #1', pts: '—' },
              { rank: '🥈', label: 'Your spot is open', pts: '—' },
              { rank: '🥉', label: 'Claim it now', pts: '—' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{item.rank}</span>
                <span style={{ flex: 1, fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>{item.pts}</span>
              </div>
            ))}
          </div>
          <a href="/leaderboard" style={{ color: '#2E9E5E', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
            View Global Leaderboard →
          </a>
        </div>
      </section>

      {/* ── WHATSAPP SHARE ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>
            Challenge your friends from Nigeria.
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Share Flipseer with your football friends.<br />
            Who has the best football brain in Nigeria?
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent('⚽ I dey predict FIFA World Cup 2026 matches for Flipseer!\n🇳🇬 Representing Nigeria on the global leaderboard.\nJoin me → https://flipseer.com/predict\nFree. No betting. Pure football.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            📱 Share on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🇳🇬</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px', lineHeight: '1.3' }}>
            Make Nigeria Proud.<br />
            <span style={{ color: '#2E9E5E' }}>Start predicting now.</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join Nigeria fans worldwide. Build your permanent<br />World Cup 2026 prediction record on Flipseer.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#2E9E5E', color: '#0D1F0F', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Join Free → Predict for Nigeria →
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '14px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>

    </main>
  )
}
