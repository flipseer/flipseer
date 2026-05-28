import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'England World Cup 2026 Predictions | Flipseer - Three Lions',
  description: 'Predict FIFA World Cup 2026 matches and represent England on the global leaderboard. Is it coming home? Build your permanent football reputation.',
  alternates: { canonical: 'https://flipseer.com/world-cup-2026/england' },
}

export default function EnglandWorldCup2026() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '96px', marginBottom: '16px', lineHeight: 1 }}>&#x1F3F4;</div>
          <div style={{ display: 'inline-block', border: '1px solid #EF4444', borderRadius: '20px', padding: '6px 20px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 &middot; ENGLAND</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: '1.2', marginBottom: '16px' }}>It's Coming Home. Or Is It?</h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 32px' }}>
            England fans believe. Prove you called it.<br />
            <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation on Flipseer.</strong>
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#EF4444', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>Predict for England &#x2192;</a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>Join Free</a>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>FOOTBALL CULTURE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '24px' }}>Why England fans belong on Flipseer.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
            No fanbase in world football carries more hope, more heartbreak, and more history than England's. Decades of belief. Semi-final heartaches. And always &mdash; always &mdash; the belief that this time is different.
          </p>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8' }}>
            In 2026, England arrives as genuine contenders. The squad is deep, the manager is tested, and the moment feels right. Every England fan has an opinion. Flipseer is where you put yours on permanent record.
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>TEAMS TO WATCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '32px' }}>Teams England fans love.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { flag: '&#x1F3F4;', name: 'England' },
              { flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
              { flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' },
              { flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
              { flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' },
              { flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain' },
              { flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' },
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

      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>Represent England. Earn your legacy.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Predict Every Match', desc: 'Pick winners and exact scores before kick-off. Up to 8 predictions per day.' },
              { step: '02', title: 'Your Record Is Locked', desc: 'Once the whistle blows, your call is permanent. No edits. Your word stands.' },
              { step: '03', title: "Lift England's Ranking", desc: "Every correct prediction earns points for England's global leaderboard position." },
              { step: '04', title: 'Build Your Legacy', desc: 'Be the top predictor from England. Your record lasts forever.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '15px', color: '#EF4444', fontWeight: 'bold', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>NATIONAL LEADERBOARD</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Top England Predictors</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>Who is the #1 football mind in England? Join now to claim your spot.</p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold' }}>
              <span>RANK &middot; PREDICTOR</span><span>POINTS</span>
            </div>
            {['First to join becomes #1', 'Your spot is open', 'Claim it now'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#EF4444', fontWeight: 'bold', minWidth: '32px' }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>---</span>
              </div>
            ))}
          </div>
          <a href="/leaderboard" style={{ color: '#EF4444', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>View Global Leaderboard &#x2192;</a>
        </div>
      </section>

      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>Challenge your friends from England.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px' }}>It could be coming home. Share and prove you called it.</p>
          <a href="https://wa.me/?text=Predicting%20every%20World%20Cup%202026%20match%20on%20Flipseer!%20Representing%20England%20-%20It%20could%20be%20coming%20home!%20Join%20me%20https%3A%2F%2Fflipseer.com%2Fpredict%20Free.%20No%20betting.%20Pure%20football."
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Share on WhatsApp
          </a>
        </div>
      </section>

      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>&#x1F3F4;</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px', lineHeight: '1.3' }}>
            Make England Proud.<br /><span style={{ color: '#EF4444' }}>Start predicting now.</span>
          </h2>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#EF4444', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Join Free &#x2192; Predict for England &#x2192;
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '14px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>
    </main>
  )
}
