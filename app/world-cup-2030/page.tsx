import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Cup 2030 Predictions | Build Your Record Now | Flipseer',
  description: 'World Cup 2030 is in Morocco, Spain, Portugal, Argentina, Uruguay and Paraguay. Start building your verified football prediction record now — 4 years before the tournament begins. Free forever.',
  keywords: 'World Cup 2030 predictions, World Cup 2030 football, Morocco World Cup 2030, Spain World Cup 2030, football prediction record',
  alternates: { canonical: 'https://flipseer.com/world-cup-2030' },
  openGraph: {
    title: 'World Cup 2030 Predictions | Flipseer',
    description: 'Build your verified football record now. 4 years before World Cup 2030 begins.',
    url: 'https://flipseer.com/world-cup-2030',
  },
}

export default function WorldCup2030Page() {
  const hostNations = [
    { flag: '🇲🇦', name: 'Morocco', href: '/morocco', desc: 'Host nation · Atlas Lions', color: '#C1272D' },
    { flag: '🇪🇸', name: 'Spain', href: '/spain', desc: 'Co-host · La Roja', color: '#AA151B' },
    { flag: '🇵🇹', name: 'Portugal', href: '/portugal', desc: 'Co-host · Selecção', color: '#006600' },
    { flag: '🇦🇷', name: 'Argentina', href: '/argentina', desc: 'Co-host · Defending champions', color: '#74ACDF' },
    { flag: '🇺🇾', name: 'Uruguay', href: '/predict', desc: 'Co-host · La Celeste', color: '#5EB6E4' },
    { flag: '🇵🇾', name: 'Paraguay', href: '/predict', desc: 'Co-host · La Albirroja', color: '#D52B1E' },
  ]

  const timeline = [
    { year: '2026', label: 'Now', desc: 'Start predicting EPL, UCL, ISL, Ghana PL. Build your record.' },
    { year: '2027', label: 'Year 1', desc: 'Full season of verified predictions. Your reputation grows.' },
    { year: '2028', label: 'Year 2', desc: 'Two years of data. Your Football Forecaster Passport develops.' },
    { year: '2029', label: 'Year 3', desc: 'World Cup qualifying begins. Predict your nation\'s matches.' },
    { year: '2030', label: 'World Cup', desc: 'You arrive with 4 years of verified football intelligence. Nobody can fake that.' },
  ]

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0A0014 0%, #0D2B14 50%, #0D1F0F 100%)', padding: '56px 20px 40px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌍</div>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>🏆 WORLD CUP 2030 · 4 YEARS AWAY</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,5vw,44px)', marginBottom: '12px', fontWeight: 800 }}>
          Build Your World Cup 2030 Record. Starting Now.
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.7 }}>
          World Cup 2030 is in Morocco, Spain, Portugal, Argentina, Uruguay and Paraguay.
          Start predicting today and build 4 years of verified football intelligence before the tournament begins.
          Your record cannot be faked.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px', fontSize: '32px' }}>
          {['🇲🇦', '🇪🇸', '🇵🇹', '🇦🇷', '🇺🇾', '🇵🇾'].map(f => (
            <span key={f}>{f}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#F59E0B', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
            ⚽ Start Building My Record →
          </a>
          <a href="/football-reputation" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            📊 What is Football Reputation?
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>

        {/* THE OPPORTUNITY */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '16px' }}>The Biggest Opportunity In Football Fan History</h2>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '12px' }}>
            No football fan has ever been able to prove their prediction record over multiple years. Opinions are temporary. Memories are unreliable. Screenshots can be faked.
          </p>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '12px' }}>
            Flipseer changes that. Every prediction locks before kickoff with a timestamp. Every result is verified automatically. Your record is permanent and impossible to fake.
          </p>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8 }}>
            By the time World Cup 2030 begins, fans who start now will have 4 years of verified football intelligence. That's a Football Forecaster Passport nobody else can claim.
          </p>
        </div>

        {/* TIMELINE */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '16px' }}>Your Road to World Cup 2030</h2>
          <div style={{ position: 'relative' }}>
            {timeline.map(({ year, label, desc }, i) => (
              <div key={year} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, textAlign: 'center', width: '56px' }}>
                  <div style={{ backgroundColor: i === 0 ? '#8B5CF6' : i === 4 ? '#F59E0B' : '#1A3A1A', color: i === 0 ? 'white' : i === 4 ? 'white' : '#6B7280', borderRadius: '8px', padding: '4px 6px', fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>{year}</div>
                  <div style={{ fontSize: '10px', color: i === 0 ? '#8B5CF6' : i === 4 ? '#F59E0B' : '#4B5563' }}>{label}</div>
                </div>
                <div style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (i === 0 ? '#8B5CF6' : i === 4 ? '#F59E0B' : '#1A3A1A') + '40', borderRadius: '10px', padding: '12px 16px', flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOST NATIONS */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '16px' }}>Six Host Nations — Start Predicting Now</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {hostNations.map(({ flag, name, href, desc, color }) => (
              <a key={name} href={href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '12px', padding: '20px 12px', textDecoration: 'none', gap: '8px' }}>
                <span style={{ fontSize: '36px' }}>{flag}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{name}</span>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{desc}</span>
                <span style={{ fontSize: '10px', backgroundColor: color + '20', color, padding: '2px 10px', borderRadius: '999px', fontWeight: 700, border: '1px solid ' + color + '40' }}>
                  Build record →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* WHAT YOU GET */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '16px', color: '#F59E0B' }}>Your Football Forecaster Passport by 2030</h2>
          {[
            '4 years of verified predictions — locked before kickoff',
            'Accuracy tracked across EPL, UCL, ISL and more',
            'Global reputation rank and nation battle standing',
            'Proof Cards for every correct call',
            'Private league history with friends',
            'The only verified football record that cannot be faked',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#F59E0B', flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#F59E0B', color: 'white', padding: '12px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              ⚽ Start My 2030 Record →
            </a>
          </div>
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>Explore Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/champions-league', label: '⭐ Champions League' },
              { href: '/football-prediction', label: '⚽ Football Prediction' },
              { href: '/football-reputation', label: '📊 Football Reputation' },
              { href: '/morocco', label: '🇲🇦 Morocco' },
              { href: '/spain', label: '🇪🇸 Spain' },
              { href: '/portugal', label: '🇵🇹 Portugal' },
              { href: '/argentina', label: '🇦🇷 Argentina' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/groups', label: '👥 Private Leagues' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
