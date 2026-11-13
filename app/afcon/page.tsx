import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFCON 2027 Predictions | Africa Cup of Nations 2027 | Flipseer',
  description: 'Predict every AFCON 2027 match before kickoff. Africa Cup of Nations 2027 runs June–July 2027 in Kenya, Tanzania and Uganda. Build your permanent Football Reputation. Free forever.',
  keywords: 'AFCON 2027 predictions, Africa Cup of Nations 2027 predictions, football prediction Africa, AFCON 2027 June July',
  alternates: { canonical: 'https://flipseer.com/afcon' },
  openGraph: {
    title: 'AFCON 2027 Predictions | Africa Cup of Nations | Flipseer',
    description: 'Predict every AFCON 2027 match. Build your permanent Football Reputation.',
    url: 'https://flipseer.com/afcon',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

const AFCON_FACTS = [
  { icon: '🏆', label: 'Competition', value: 'Africa Cup of Nations' },
  { icon: '📅', label: 'Dates', value: '19 June – 17 July 2027' },
  { icon: '🌍', label: 'Host', value: 'Kenya / Tanzania / Uganda' },
  { icon: '⚽', label: 'Teams', value: '24 nations' },
  { icon: '🗓️', label: 'Fixtures', value: 'Coming Dec 2026' },
  { icon: '🆓', label: 'Cost', value: 'Free forever' },
]

const AFCON_NATIONS = [
  'Nigeria', 'Ghana', 'Egypt', 'Senegal', 'Morocco', 'Cameroon',
  'Ivory Coast', 'Algeria', 'Mali', 'South Africa', 'Tunisia', 'Kenya',
  'Uganda', 'Tanzania', 'DR Congo', 'Guinea', 'Burkina Faso', 'Cape Verde',
  'Zambia', 'Mozambique', 'Angola', 'Equatorial Guinea', 'Gabon', 'Benin',
]

export default function AFCONPage() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #1A0A00 0%, #0D1F0F 100%)', padding: '48px 20px 40px', borderBottom: '1px solid #2A1A00', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '2px' }}>🌍 AFCON 2027 · COMING JUNE 2027</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌍</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,48px)', marginBottom: '10px', lineHeight: 1.1 }}>
          Africa Cup of Nations<br /><span style={{ color: '#F59E0B' }}>2027 Predictions</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          24 African nations. One trophy. Predict every AFCON 2027 match before kickoff — your record is permanent, locked at kickoff.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#F59E0B', color: '#0D1F0F', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⚽ Predict Football Now →
          </a>
          <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #2A1A00', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Leaderboard
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* COMING SOON BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #0D2B14 100%)', border: '2px solid #F59E0B', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 0 40px rgba(245,158,11,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>FIXTURES COMING SOON</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '12px' }}>
            AFCON 2027 kicks off<br />
            <span style={{ color: '#F59E0B' }}>19 June 2027 in East Africa.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
            Hosted by Kenya, Tanzania and Uganda. Fixtures drop in early 2027. Meanwhile, build your Football Reputation on EPL, UCL, ISL and Ghana Premier League — your record carries into AFCON.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#F59E0B', color: '#0D1F0F', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            🌍 Start Predicting Now →
          </a>
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '10px' }}>Free forever · No betting · No card required</p>
        </div>

        {/* NATION BATTLE */}
        <div style={{ marginBottom: '32px', backgroundColor: '#0D2B14', border: '1px solid #2A1A00', borderRadius: '14px', padding: '24px' }}>
          <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>NATION BATTLE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '12px' }}>Which country predicts AFCON best?</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '0' }}>
            Every prediction you make counts for your nation's collective accuracy. During AFCON 2027, Nigerian fans vs Ghanaian fans vs Egyptian fans — whose forecasts are more accurate? Build your personal record now. Your country needs your predictions.
          </p>
        </div>

        {/* KEY FACTS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>COMPETITION FACTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {AFCON_FACTS.map(({ icon, label, value }) => (
              <div key={label} style={{ backgroundColor: '#050E05', border: '1px solid #2A1A00', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTICIPATING NATIONS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>AFCON 2027 NATIONS (PROVISIONAL)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {AFCON_NATIONS.map(nation => (
              <span key={nation} style={{ backgroundColor: '#0D2B14', border: '1px solid #2A1A00', color: '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                {nation}
              </span>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>HOW IT WORKS</p>
          {[
            { n: '1', title: 'Predict the score', desc: 'Pick the match outcome and exact score before kickoff. Choose your confidence level from 50% to 100%.' },
            { n: '2', title: 'Prediction locks at kickoff', desc: 'Once the match starts your prediction is locked permanently. No edits, no deletions. Your honest call, forever.' },
            { n: '3', title: 'Earn REP points', desc: 'Correct predictions earn REP points that build your Football Reputation score across all competitions.' },
            { n: '4', title: 'Compete by nation', desc: 'Your AFCON predictions count toward your country\'s Nation Battle standing. Represent your nation.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#2A1A00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#F59E0B', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>MORE ON FLIPSEER</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/ucl', label: '⭐ Champions League' },
              { href: '/ghana-premier-league', label: '🇬🇭 Ghana Premier League' },
              { href: '/asian-cup-2027', label: '🌏 Asian Cup 2027' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #2A1A00', color: '#9CA3AF', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
