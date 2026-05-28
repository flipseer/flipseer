import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mexico World Cup 2026 Predictions | Flipseer - El Tri Host Nation',
  description: 'Predict FIFA World Cup 2026 matches and represent Mexico on the global leaderboard. Host nation. Azteca roars again. Build your permanent football reputation.',
  alternates: { canonical: 'https://flipseer.com/world-cup-2026/mexico' },
}

export default function MexicoWorldCup2026() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '96px', marginBottom: '16px', lineHeight: 1 }}>&#x1F1F2;&#x1F1FD;</div>
          <div style={{ display: 'inline-block', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '6px 20px', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 &middot; MEXICO &middot; HOST NATION</span>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 'bold', backgroundColor: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: '999px', border: '1px solid #F59E0B' }}>
              Estadio Azteca · Estadio Akron · Estadio BBVA
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: '1.2', marginBottom: '16px' }}>El Tri en Casa. Mexico Hosts the World.</h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 32px' }}>
            Host nation. Azteca roars again. This is your moment.<br />
            <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation on Flipseer.</strong>
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>Predict for Mexico &#x2192;</a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>Join Free</a>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>FOOTBALL CULTURE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '24px' }}>Why Mexico fans belong on Flipseer.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
            Mexico is a host nation in 2026 &mdash; the first time the Azteca will host World Cup football since 1986. For Mexican fans, this is more than a tournament. It is a national celebration. A moment 40 years in the making.
          </p>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8' }}>
            El Tri fans are among the loudest, most passionate supporters in world football. The Estadio Azteca &mdash; the only stadium to host three World Cups &mdash; will shake again. This is Mexico's tournament.
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>TEAMS TO WATCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '32px' }}>Teams Mexico fans love.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { flag: '&#x1F1F2;&#x1F1FD;', name: 'Mexico' },
              { flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
              { flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' },
              { flag: '&#x1F1FA;&#x1F1F8;', name: 'USA' },
              { flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
              { flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' },
              { flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' },
              { flag: '&#x1F1FA;&#x1F1FE;', name: 'Uruguay' },
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
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>Represent Mexico. Earn your legacy.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Predict Every Match', desc: 'Pick winners and exact scores before kick-off. Up to 8 predictions per day.' },
              { step: '02', title: 'Your Record Is Locked', desc: 'Once the whistle blows, your call is permanent. No edits. Your word stands.' },
              { step: '03', title: "Lift Mexico's Ranking", desc: "Every correct prediction earns points for Mexico's global leaderboard position." },
              { step: '04', title: 'Build Your Legacy', desc: 'Be the top predictor from Mexico. Your record lasts forever.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '15px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Top Mexico Predictors</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>Who is the #1 football mind in Mexico? Join now to claim your spot.</p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold' }}>
              <span>RANK &middot; PREDICTOR</span><span>POINTS</span>
            </div>
            {['First to join becomes #1', 'Your spot is open', 'Claim it now'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#2E9E5E', fontWeight: 'bold', minWidth: '32px' }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>---</span>
              </div>
            ))}
          </div>
          <a href="/leaderboard" style={{ color: '#2E9E5E', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>View Global Leaderboard &#x2192;</a>
        </div>
      </section>

      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>Comparte con tus amigos de Mexico.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px' }}>Arriba Mexico! Share Flipseer with your football friends.</p>
          <a href="https://wa.me/?text=Estoy%20prediciendo%20todos%20los%20partidos%20del%20Mundial%202026%20en%20Flipseer!%20Mexico%20anfitri%C3%B3n%20-%20el%20Azteca%20ruge%20de%20nuevo!%20Unite%20https%3A%2F%2Fflipseer.com%2Fpredict%20Gratis.%20Sin%20apuestas."
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Share on WhatsApp
          </a>
        </div>
      </section>

      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>&#x1F1F2;&#x1F1FD;</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px', lineHeight: '1.3' }}>
            Arriba Mexico. Make Mexico Proud.<br /><span style={{ color: '#2E9E5E' }}>Start predicting now.</span>
          </h2>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Join Free &#x2192; Predict for Mexico &#x2192;
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '14px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>
    </main>
  )
}
