import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asian Cup 2027 Predictions | AFC Asian Cup 2027 | Flipseer',
  description: 'Predict every AFC Asian Cup 2027 match before kickoff. Asian Cup 2027 runs December 2027–January 2028 in Saudi Arabia. Build your permanent Football Reputation. Free forever.',
  keywords: 'Asian Cup 2027 predictions, AFC Asian Cup 2027 predictions, football prediction Asia, Asian Cup Saudi Arabia 2027',
  alternates: { canonical: 'https://flipseer.com/asian-cup-2027' },
  openGraph: {
    title: 'Asian Cup 2027 Predictions | AFC Asian Cup | Flipseer',
    description: 'Predict every Asian Cup 2027 match. Build your permanent Football Reputation.',
    url: 'https://flipseer.com/asian-cup-2027',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

const ASIAN_CUP_FACTS = [
  { icon: '🏆', label: 'Competition', value: 'AFC Asian Cup' },
  { icon: '📅', label: 'Dates', value: '23 Dec 2027 – 21 Jan 2028' },
  { icon: '🌏', label: 'Host', value: 'Saudi Arabia' },
  { icon: '⚽', label: 'Teams', value: '24 nations' },
  { icon: '🗓️', label: 'Fixtures', value: 'Coming late 2026' },
  { icon: '🆓', label: 'Cost', value: 'Free forever' },
]

const ASIAN_CUP_NATIONS = [
  'Saudi Arabia', 'Japan', 'South Korea', 'Australia', 'Iran', 'India',
  'Indonesia', 'Qatar', 'UAE', 'Uzbekistan', 'Jordan', 'Iraq',
  'China', 'Oman', 'Bahrain', 'Vietnam', 'Thailand', 'Palestine',
  'Syria', 'Kyrgyzstan', 'Tajikistan', 'Hong Kong', 'Myanmar', 'Yemen',
]

export default function AsianCup2027Page() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #001A2A 0%, #0D1F0F 100%)', padding: '48px 20px 40px', borderBottom: '1px solid #002A3A', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(14,165,233,0.1)', border: '1px solid #0EA5E9', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0EA5E9', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '2px' }}>🌏 ASIAN CUP 2027 · COMING DECEMBER 2027</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌏</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,48px)', marginBottom: '10px', lineHeight: 1.1 }}>
          AFC Asian Cup<br /><span style={{ color: '#0EA5E9' }}>2027 Predictions</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          24 Asian nations. One trophy. Predict every Asian Cup 2027 match before kickoff — your record is permanent, locked at kickoff.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#0EA5E9', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⚽ Predict Football Now →
          </a>
          <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #002A3A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Leaderboard
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* COMING SOON BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #001A2A 0%, #0D2B14 100%)', border: '2px solid #0EA5E9', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 0 40px rgba(14,165,233,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>FIXTURES COMING SOON</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '12px' }}>
            Asian Cup 2027 kicks off<br />
            <span style={{ color: '#0EA5E9' }}>23 December 2027 in Saudi Arabia.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
            Postponed to December 2027–January 2028 (AFC announcement, Nov 2026). Fixtures drop in mid-2027. Meanwhile, build your Football Reputation on ISL, Indonesian Super League, EPL and UCL — your record carries into the Asian Cup.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#0EA5E9', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            🌏 Start Predicting Now →
          </a>
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '10px' }}>Free forever · No betting · No card required</p>
        </div>

        {/* NATION BATTLE */}
        <div style={{ marginBottom: '32px', backgroundColor: '#0D2B14', border: '1px solid #002A3A', borderRadius: '14px', padding: '24px' }}>
          <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>NATION BATTLE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '12px' }}>Which country predicts Asian Cup best?</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7 }}>
            Every prediction you make counts for your nation's collective accuracy. During Asian Cup 2027, Indian fans vs Indonesian fans vs Japanese fans vs South Korean fans — whose forecasts are more accurate? Build your record now. Your country needs your predictions.
          </p>
        </div>

        {/* KEY FACTS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>COMPETITION FACTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {ASIAN_CUP_FACTS.map(({ icon, label, value }) => (
              <div key={label} style={{ backgroundColor: '#050E05', border: '1px solid #002A3A', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>ASIAN CUP 2027 NATIONS (PROVISIONAL)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ASIAN_CUP_NATIONS.map(nation => (
              <span key={nation} style={{ backgroundColor: '#0D2B14', border: '1px solid #002A3A', color: '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                {nation}
              </span>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>HOW IT WORKS</p>
          {[
            { n: '1', title: 'Predict the score', desc: 'Pick the match outcome and exact score before kickoff. Choose your confidence level from 50% to 100%.' },
            { n: '2', title: 'Prediction locks at kickoff', desc: 'Once the match starts your prediction is locked permanently. No edits, no deletions. Your honest call, forever.' },
            { n: '3', title: 'Earn REP points', desc: 'Correct predictions earn REP points that build your Football Reputation score across all competitions.' },
            { n: '4', title: 'Compete by nation', desc: 'Your Asian Cup predictions count toward your country\'s Nation Battle standing. Represent India, Indonesia, Japan or your nation.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#001A2A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0EA5E9', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <p style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>MORE ON FLIPSEER</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/indian-super-league', label: '🇮🇳 Indian Super League' },
              { href: '/indonesian-super-league', label: '🇮🇩 Indonesian Super League' },
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/afcon', label: '🌍 AFCON 2027' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #002A3A', color: '#9CA3AF', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
