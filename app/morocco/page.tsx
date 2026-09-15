import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Morocco Football Predictions | EPL & UCL | Flipseer',
  description: 'Moroccan football fans predict EPL, UCL and African football on Flipseer. Represent Morocco in the global Nation Battle. Free forever.',
  alternates: { canonical: 'https://flipseer.com/morocco' },
  openGraph: {
    title: 'Morocco Football Predictions | EPL & UCL | Flipseer',
    description: 'Moroccan football fans predict EPL, UCL and African football on Flipseer. Represent Morocco in the global Nation Battle. Free forever.',
    url: 'https://flipseer.com/morocco',
  },
}

export default function MoroccoPage() {
  const steps = [
    { num: '1', title: 'Predict', desc: 'Pick match outcomes before kickoff across EPL, UCL, Liga 1 and Ghana PL.' },
    { num: '2', title: 'Lock', desc: 'Your prediction locks at kickoff. Permanent record — no edits ever.' },
    { num: '3', title: 'Earn REP', desc: 'Correct predictions earn REP points for you and for Morocco in the Nation Battle.' },
  ]
  const competitions = [
    { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'EPL 2026/27', status: 'LIVE', href: '/epl', color: '#8B5CF6' },
    { flag: '⭐', name: 'UCL 2026/27', status: 'Live Oct 13', href: '/ucl', color: '#A78BFA' },
    { flag: '🇮🇩', name: 'Liga 1 Indonesia', status: 'LIVE', href: '/indonesia', color: '#CE1126' },
    { flag: '🇬🇭', name: 'Ghana Premier League', status: 'LIVE', href: '/ghana', color: '#F59E0B' },
  ]
  const links = [
    { href: '/predict', label: '⚽ Predict Matches' },
    { href: '/leaderboard', label: '🏆 Leaderboard' },
    { href: '/nations', label: '🌍 Nation Battle' },
    { href: '/groups', label: '👥 Private Leagues' },
    { href: '/football-reputation', label: '📊 Football Reputation' },
    { href: '/about', label: 'About Flipseer' },
  ]
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🇲🇦</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,44px)', marginBottom: '10px', fontWeight: 800 }}>
          Morocco Football Predictions
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.7 }}>
          Morocco's Atlas Lions shocked the world at the 2022 World Cup. Moroccan forecasters on Flipseer predict EPL, UCL and international football — building a permanent Football Reputation and competing in the global Nation Battle.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#C1272D', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⚽ Predict EPL matches for Morocco →
          </a>
          <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 View Leaderboard
          </a>
        </div>
      </div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '16px' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '9px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px', marginBottom: '6px' }}>STEP {num}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '16px' }}>Live competitions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {competitions.map((comp) => (
              <a key={comp.name} href={comp.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '12px 16px', textDecoration: 'none' }}>
                <span style={{ fontSize: '20px' }}>{comp.flag}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'white', flex: 1 }}>{comp.name}</span>
                <span style={{ fontSize: '10px', backgroundColor: comp.color, color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>{comp.status}</span>
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>Explore Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {links.map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
