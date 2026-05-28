import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'India World Cup 2026 Predictions | Flipseer',
  description: 'Predict FIFA World Cup 2026 matches and represent India on the global leaderboard. Build your permanent football reputation. Free. No betting.',
  keywords: 'India world cup 2026 predictions, india football predictor, FIFA world cup 2026 india',
  openGraph: {
    title: 'India World Cup 2026 Predictions | Flipseer',
    description: 'Represent India. Build your permanent football reputation.',
    url: 'https://flipseer.com/world-cup-2026/india',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://flipseer.com/world-cup-2026/india' },
}

const FAV_TEAMS = [
  { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', name: 'England' },
  { flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands' },
]

export default function IndiaWorldCup2026() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '96px', marginBottom: '16px', lineHeight: 1 }}>&#x1F1EE;&#x1F1F3;</div>
          <div style={{ display: 'inline-block', backgroundColor: '#0D1F0F', border: '1px solid #F59E0B', borderRadius: '20px', padding: '6px 20px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 &middot; INDIA</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: '1.2', marginBottom: '16px' }}>
            Represent India on the World Stage.
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '32px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 32px' }}>
            Millions of Indian fans. One permanent record.<br />
            <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation on Flipseer.</strong>
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#F59E0B', color: '#0D1F0F', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
              Predict for India &#x2192;
            </a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
              Join Free
            </a>
          </div>
        </div>
      </section>

      {/* CULTURE */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>FOOTBALL CULTURE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '24px' }}>Why India fans belong on Flipseer.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
            From packed watch parties in Bengaluru and Mumbai to late-night debates in every small town, Indian fans live and breathe football. The ISL is growing fast, and the global stage is calling.
          </p>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8' }}>
            India does not just watch football &mdash; India feels it. Every goal, every tackle, every upset. Now it is time to prove your football intelligence is among the best in the world.
          </p>
        </div>
      </section>

      {/* FAV TEAMS */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>TEAMS TO WATCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>Teams India fans love.</h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>Predict their matches. Build your record.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
              { flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' },
              { flag: '&#x1F3F4;', name: 'England' },
              { flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' },
              { flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
              { flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' },
              { flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain' },
              { flag: '&#x1F1F3;&#x1F1F1;', name: 'Netherlands' },
            ].map(t => (
              <div key={t.name} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: t.flag }} />
                <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>Represent India. Earn your legacy.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', icon: 'Target', title: 'Predict Every Match', desc: 'Pick winners and exact scores before kick-off. Up to 8 predictions per day.' },
              { step: '02', icon: 'Lock', title: 'Your Record Is Locked', desc: 'Once the whistle blows, your call is permanent. No edits. Your word stands.' },
              { step: '03', icon: 'Globe', title: "Lift India's Ranking", desc: "Every correct prediction earns points for India's position on the global leaderboard." },
              { step: '04', icon: 'Crown', title: 'Build Your Legacy', desc: 'Tournament after tournament, your permanent record grows. Be the top predictor from India.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '15px', color: '#F59E0B', fontWeight: 'bold', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NATIONAL LEADERBOARD */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>NATIONAL LEADERBOARD</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Top India Predictors</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>
            Who is the #1 football mind in India? Join now to claim your spot.
          </p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
              <span>RANK &middot; PREDICTOR</span>
              <span>POINTS</span>
            </div>
            {[
              { rank: '#1', label: 'First to join becomes #1' },
              { rank: '#2', label: 'Your spot is open' },
              { rank: '#3', label: 'Claim it now' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#F59E0B', fontWeight: 'bold', minWidth: '32px' }}>{item.rank}</span>
                <span style={{ flex: 1, fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>---</span>
              </div>
            ))}
          </div>
          <a href="/leaderboard" style={{ color: '#F59E0B', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
            View Global Leaderboard &#x2192;
          </a>
        </div>
      </section>

      {/* WHATSAPP */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>Challenge your friends from India.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Who has the best football brain in India? Share and find out.
          </p>
          <a
            href="https://wa.me/?text=I%20am%20predicting%20every%20FIFA%20World%20Cup%202026%20match%20on%20Flipseer!%20Representing%20India%20on%20the%20global%20leaderboard.%20Join%20me%20%E2%86%92%20https%3A%2F%2Fflipseer.com%2Fpredict%20Free.%20No%20betting.%20Pure%20football."
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Share on WhatsApp
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>&#x1F1EE;&#x1F1F3;</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px', lineHeight: '1.3' }}>
            Make India Proud.<br />
            <span style={{ color: '#F59E0B' }}>Start predicting now.</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join India fans worldwide. Build your permanent World Cup 2026 prediction record on Flipseer.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#F59E0B', color: '#0D1F0F', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Join Free &#x2192; Predict for India &#x2192;
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '14px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>

    </main>
  )
}
