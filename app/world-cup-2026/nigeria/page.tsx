import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Cup 2026 Predictions — Flipseer | Forecast Every Match',
  description: 'Predict every FIFA World Cup 2026 match. 64 games. 32 nations. Build your permanent football forecasting record. Free. No betting. Ever.',
  keywords: 'world cup 2026 predictions, FIFA world cup 2026, world cup 2026 forecast, world cup 2026 predictor, world cup 2026 matches, world cup 2026 groups',
  openGraph: {
    title: 'World Cup 2026 — Predict Every Match on Flipseer',
    description: '64 matches. 32 nations. Your predictions. Permanent. Public. Forever.',
    url: 'https://flipseer.com/world-cup-2026',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Predictions — Flipseer',
    description: '64 matches. 32 nations. Predict them all.',
  },
  alternates: {
    canonical: 'https://flipseer.com/world-cup-2026',
  },
}

const GROUPS = [
  { group: 'A', teams: ['USA', 'Mexico', 'Panama', 'Iceland'] },
  { group: 'B', teams: ['Spain', 'Croatia', 'Morocco', 'Japan'] },
  { group: 'C', teams: ['Brazil', 'Switzerland', 'Serbia', 'Guinea'] },
  { group: 'D', teams: ['England', 'Slovakia', 'South Africa', 'Tunisia'] },
  { group: 'E', teams: ['France', 'Netherlands', 'Algeria', 'Kenya'] },
  { group: 'F', teams: ['Portugal', 'Argentina', 'Iraq', 'Paraguay'] },
  { group: 'G', teams: ['Germany', 'Belgium', 'Australia', 'New Zealand'] },
  { group: 'H', teams: ['Italy', 'Senegal', 'Cameroon', 'Canada'] },
  { group: 'I', teams: ['Colombia', 'Uruguay', 'Ecuador', 'Saudi Arabia'] },
  { group: 'J', teams: ['Nigeria', 'Egypt', 'South Korea', 'Costa Rica'] },
  { group: 'K', teams: ['Denmark', 'Iran', 'Ghana', 'Honduras'] },
  { group: 'L', teams: ['Poland', 'Chile', 'DR Congo', 'Thailand'] },
]

const TOP_COUNTRIES = [
  { flag: '🇧🇷', name: 'Brazil', slug: 'brazil', odds: 'Favorites', color: '#F59E0B' },
  { flag: '🇫🇷', name: 'France', slug: 'france', odds: 'Contenders', color: '#3B82F6' },
  { flag: '🇦🇷', name: 'Argentina', slug: 'argentina', odds: 'Defending Champions', color: '#2E9E5E' },
  { flag: '🇬🇧', name: 'England', slug: 'england', odds: 'Contenders', color: '#EF4444' },
  { flag: '🇩🇪', name: 'Germany', slug: 'germany', odds: 'Dark Horse', color: '#6B7280' },
  { flag: '🇪🇸', name: 'Spain', slug: 'spain', odds: 'Contenders', color: '#F59E0B' },
  { flag: '🇵🇹', name: 'Portugal', slug: 'portugal', odds: 'Dark Horse', color: '#EF4444' },
  { flag: '🇮🇳', name: 'India', slug: 'india', odds: 'Passionate Fanbase', color: '#F59E0B' },
  { flag: '🇳🇬', name: 'Nigeria', slug: 'nigeria', odds: 'African Hopefuls', color: '#2E9E5E' },
  { flag: '🇲🇽', name: 'Mexico', slug: 'mexico', odds: 'Host Nation', color: '#2E9E5E' },
  { flag: '🇺🇸', name: 'USA', slug: 'usa', odds: 'Host Nation', color: '#3B82F6' },
  { flag: '🇨🇦', name: 'Canada', slug: 'canada', odds: 'Host Nation', color: '#EF4444' },
]

const STAGES = [
  { stage: 'Group Stage', dates: 'Jun 11 – Jul 2', matches: 48, icon: '⚽' },
  { stage: 'Round of 32', dates: 'Jul 4 – Jul 7', matches: 16, icon: '🎯' },
  { stage: 'Round of 16', dates: 'Jul 9 – Jul 12', matches: 8, icon: '⚡' },
  { stage: 'Quarter Finals', dates: 'Jul 15 – Jul 16', matches: 4, icon: '🔥' },
  { stage: 'Semi Finals', dates: 'Jul 19 – Jul 20', matches: 2, icon: '👑' },
  { stage: 'Final', dates: 'Jul 26', matches: 1, icon: '🏆' },
]

const HOST_CITIES = [
  { city: 'New York / New Jersey', stadium: 'MetLife Stadium', capacity: '82,500' },
  { city: 'Los Angeles', stadium: 'SoFi Stadium', capacity: '70,240' },
  { city: 'Dallas', stadium: 'AT&T Stadium', capacity: '80,000' },
  { city: 'San Francisco', stadium: "Levi's Stadium", capacity: '68,500' },
  { city: 'Miami', stadium: 'Hard Rock Stadium', capacity: '65,326' },
  { city: 'Seattle', stadium: 'Lumen Field', capacity: '69,000' },
  { city: 'Boston', stadium: 'Gillette Stadium', capacity: '65,878' },
  { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium', capacity: '71,000' },
  { city: 'Houston', stadium: 'NRG Stadium', capacity: '72,220' },
  { city: 'Kansas City', stadium: 'Arrowhead Stadium', capacity: '76,416' },
  { city: 'Mexico City', stadium: 'Estadio Azteca', capacity: '87,523' },
  { city: 'Guadalajara', stadium: 'Estadio Akron', capacity: '49,850' },
  { city: 'Monterrey', stadium: 'Estadio BBVA', capacity: '53,500' },
  { city: 'Toronto', stadium: 'BMO Field', capacity: '45,000' },
  { city: 'Vancouver', stadium: 'BC Place', capacity: '54,500' },
]

const STATS = [
  { value: '48', label: 'Group Matches' },
  { value: '16', label: 'Knockout Matches' },
  { value: '32', label: 'Nations' },
  { value: '3', label: 'Host Countries' },
  { value: '16', label: 'Host Cities' },
  { value: '45', label: 'Days of Football' },
]

export default function WorldCup2026() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '6px 16px', marginBottom: '28px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '1px' }}>JUNE 11 – JULY 26, 2026</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', lineHeight: '1.15', marginBottom: '20px' }}>
            FIFA World Cup 2026<br />
            <span style={{ color: '#2E9E5E' }}>Predict Every Match.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '12px', lineHeight: '1.7' }}>
            64 matches. 32 nations. 3 host countries.<br />
            <strong style={{ color: '#D1FAE5' }}>Your predictions. Permanent. Public. Forever.</strong>
          </p>
          <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '40px', fontStyle: 'italic' }}>
            Not a bet. A record of who you are as a football mind.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(46,158,94,0.3)' }}>
              Start Predicting →
            </a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
              Create Free Account
            </a>
          </div>
        </div>
      </section>

      {/* ── TOURNAMENT STATS ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NO BETTING BANNER ── */}
      <section style={{ padding: '24px 20px', backgroundColor: '#0D2B14', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {['🚫 No Betting. Ever.', '💰 100% Free', '📖 Permanent Record', '🌍 Global Rankings'].map(item => (
            <span key={item} style={{ fontSize: '14px', color: '#2E9E5E', fontWeight: 'bold' }}>{item}</span>
          ))}
        </div>
      </section>

      {/* ── TOURNAMENT STAGES ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>TOURNAMENT STRUCTURE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>
            From Group Stage to Glory
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STAGES.map(({ stage, dates, matches, icon }) => (
              <div key={stage} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px', minWidth: '40px' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{stage}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{dates}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E9E5E' }}>{matches}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>matches</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROUPS ── */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>GROUP STAGE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            12 Groups. 48 Matches.
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>
            Predict every group stage match before kick-off.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {GROUPS.map(({ group, teams }) => (
              <div key={group} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>
                  GROUP {group}
                </div>
                {teams.map(team => (
                  <div key={team} style={{ fontSize: '14px', color: '#D1FAE5', padding: '4px 0', borderBottom: '1px solid #1A3A1A' }}>
                    {team}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP NATIONS ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>NATIONS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            Which nation will you represent?
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>
            Every prediction moves your nation up the global leaderboard.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {TOP_COUNTRIES.map(({ flag, name, slug, odds, color }) => (
              <a key={slug} href={`/world-cup-2026/${slug}`} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', textDecoration: 'none', display: 'block', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{flag}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '11px', color, fontWeight: 'bold' }}>{odds}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CITIES ── */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>HOST VENUES</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            16 Cities. 3 Nations.
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>
            USA 🇺🇸 · Mexico 🇲🇽 · Canada 🇨🇦
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {HOST_CITIES.map(({ city, stadium, capacity }) => (
              <div key={city} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{city}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{stadium}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', textAlign: 'right' }}>
                  {capacity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>HOW FLIPSEER WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '40px' }}>
            Predict. Lock. Earn. Repeat.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', icon: '🎯', title: 'Predict the match', desc: 'Pick winner + exact score before kick-off' },
              { step: '02', icon: '🔒', title: 'It locks forever', desc: 'No edits after whistle. Your word stands.' },
              { step: '03', icon: '⚡', title: 'Earn reputation', desc: 'Correct calls earn points and badges' },
              { step: '04', icon: '👑', title: 'Build your legacy', desc: 'Permanent public record. Forever.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontSize: '15px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px', lineHeight: '1.3' }}>
            June 11. The whistle blows.<br />
            <span style={{ color: '#2E9E5E' }}>Will your record be ready?</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join thousands of forecasters building their permanent<br />World Cup 2026 prediction record on Flipseer.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 40px rgba(46,158,94,0.35)' }}>
            Start Predicting Free →
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '14px' }}>
            Free. No betting. No risk. Pure football.
          </p>
        </div>
      </section>

    </main>
  )
}
