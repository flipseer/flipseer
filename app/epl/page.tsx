import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPL Predictions 2026/27 | Flipseer — Premier League Forecasting',
  description: 'Predict every Premier League match. Build your permanent EPL forecasting record. Climb national and global leaderboards. Free. No betting. Pure football reputation.',
  keywords: 'EPL predictions, Premier League predictions, football predictor, EPL forecast, Premier League 2026, football leaderboard',
  openGraph: {
    title: 'EPL Predictions — Flipseer | Premier League Forecasting',
    description: 'Predict every EPL match. Build your permanent football reputation. Free. No betting.',
    url: 'https://flipseer.com/epl',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPL Predictions — Flipseer',
    description: 'Predict every Premier League match. Build your permanent football reputation.',
  },
  alternates: { canonical: 'https://flipseer.com/epl' },
}

const EPL_CLUBS = [
  { flag: '&#x1F534;', name: 'Arsenal' },
  { flag: '&#x1F535;', name: 'Chelsea' },
  { flag: '&#x1F534;', name: 'Man United' },
  { flag: '&#x1F535;', name: 'Man City' },
  { flag: '&#x1F534;', name: 'Liverpool' },
  { flag: '&#x1F535;', name: 'Tottenham' },
  { flag: '&#x1F535;', name: 'Newcastle' },
  { flag: '&#x1F535;', name: 'Aston Villa' },
]

const FEATURES = [
  { icon: '&#x1F3AF;', title: 'Real Skill Competition', desc: 'No betting. No luck. Pure football intelligence. Predict match outcomes before kick-off and earn points based on accuracy.' },
  { icon: '&#x1F4D6;', title: 'Permanent History', desc: 'Every prediction you make is locked forever. Build a season-by-season record that proves your football knowledge over time.' },
  { icon: '&#x1F30D;', title: 'National Rankings', desc: 'Compete on your country\'s EPL leaderboard. Represent India, Nigeria, England, or wherever you call home.' },
  { icon: '&#x1F3C6;', title: 'Season Badges', desc: 'Earn exclusive badges for hot streaks, exact scores, upset calls, and legendary predictions across the season.' },
  { icon: '&#x1F465;', title: 'Private Groups', desc: 'Create groups with friends, colleagues, or rivals. Weekly bragging rights. Season-long dominance.' },
  { icon: '&#x1F4AF;', title: 'Max 108 pts Per Match', desc: 'Exact score + upset call + 80% confidence = 108 points. The scoring rewards real football knowledge.' },
]

export default function EPLPage() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* COMING SOON BANNER */}
      <div style={{ backgroundColor: '#1C1A3A', borderBottom: '1px solid #3B82F6', padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', color: '#93C5FD', fontWeight: 'bold' }}>
          &#x23F3; EPL 2026/27 Season Predictions launching August 2026 &mdash; Register now to get early access
        </span>
      </div>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '80px 20px 60px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', border: '1px solid #8B5CF6', borderRadius: '20px', padding: '6px 20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>PREMIER LEAGUE 2026/27</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', lineHeight: '1.15', marginBottom: '20px' }}>
            The Premier League is Back.<br />
            <span style={{ color: '#8B5CF6' }}>Your Reputation Continues.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto 12px' }}>
            Your World Cup journey does not end here.<br />
            <strong style={{ color: '#D1FAE5' }}>Every match. Every weekend. Every point counts.</strong>
          </p>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '40px', fontStyle: 'italic' }}>
            While others just watch &mdash; you predict, you earn, you build your name.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
              Get Early Access &#x2192;
            </a>
            <a href="/world-cup-2026" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
              World Cup 2026 First &#x2192;
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            {[
              { value: '380', label: 'EPL Matches' },
              { value: '20', label: 'Clubs' },
              { value: '38', label: 'Matchweeks' },
              { value: '108', label: 'Max Pts / Match' },
              { value: '0', label: 'Cost to Join' },
              { value: '0', label: 'Bets. Ever.' },
            ].map(({ value, label }) => (
              <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B5CF6', fontFamily: 'Georgia, serif' }}>{value}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FLIPSEER FOR EPL */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>WHY FLIPSEER FOR EPL</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', textAlign: 'center', marginBottom: '8px' }}>
            Built for serious football fans.
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '40px', fontSize: '15px' }}>
            Not a betting app. Not a fantasy game. A permanent football reputation platform.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.7' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CLUBS */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>THE BIG CLUBS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            All 20 EPL clubs. Every match.
          </h2>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
            Predict every fixture from Gameweek 1 to the final day.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {EPL_CLUBS.map(({ flag, name }) => (
              <div key={name} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: flag }} />
                <div style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 'bold' }}>{name}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#4B5563', fontSize: '13px', textAlign: 'center' }}>+ 12 more clubs &mdash; all 20 EPL teams available</p>
        </div>
      </section>

      {/* HOW REPUTATION CARRIES OVER */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>ONE REPUTATION. ALL COMPETITIONS.</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '24px', lineHeight: '1.3' }}>
            World Cup &#x2192; EPL &#x2192; Champions League.<br />
            <span style={{ color: '#8B5CF6' }}>One permanent record.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Your Flipseer reputation is not tied to one tournament. Every correct prediction across every competition builds your permanent football identity. World Cup glory. EPL dominance. Champions League mastery.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'World Cup 2026', color: '#2E9E5E', href: '/world-cup-2026' },
              { label: 'EPL 2026/27', color: '#8B5CF6', href: '/epl' },
              { label: 'Champions League', color: '#F59E0B', href: '#' },
              { label: 'La Liga', color: '#EF4444', href: '#' },
            ].map(({ label, color, href }) => (
              <a key={label} href={href} style={{ backgroundColor: '#0D2B14', border: `1px solid ${color}`, borderRadius: '999px', padding: '8px 20px', textDecoration: 'none', fontSize: '13px', color, fontWeight: 'bold' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EARLY ACCESS CTA */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>SEASON STARTS AUGUST 2026</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '24px' }}>
            Early predictors get the advantage.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              { icon: '&#x26A1;', text: 'First to predict Gameweek 1 matches before lines are drawn' },
              { icon: '&#x1F3C6;', text: 'Early-bird badge for founding EPL predictors' },
              { icon: '&#x1F4CA;', text: 'Head start on the global EPL leaderboard' },
              { icon: '&#x1F465;', text: 'Invite friends now and build your private group before the season' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '24px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <span style={{ fontSize: '14px', color: '#D1FAE5' }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
              Register for Early Access &#x2192;
            </a>
            <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '12px' }}>Free. No betting. Pure football.</p>
          </div>
        </div>
      </section>

      {/* WHATSAPP */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>Build your EPL group.</h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Invite your friends before the season starts.<br />
            Weekly bragging rights. Season-long rivalry.
          </p>
          <a href="https://wa.me/?text=The%20EPL%20is%20back%20and%20I%20am%20predicting%20every%20match%20on%20Flipseer!%20Build%20your%20permanent%20football%20reputation.%20Join%20me%20https%3A%2F%2Fflipseer.com%2Fepl%20Free.%20No%20betting.%20Pure%20football."
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', backgroundColor: '#25D366', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Share on WhatsApp
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>&#x26BD;</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', marginBottom: '16px', lineHeight: '1.3' }}>
            From World Cup glory<br />to EPL dominance.<br />
            <span style={{ color: '#8B5CF6' }}>One reputation. Forever.</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join thousands of serious football fans building their permanent forecasting record on Flipseer.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '18px 56px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 0 50px rgba(139,92,246,0.4)' }}>
            Join Free &#x2192;
          </a>
          <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '16px' }}>Free. No betting. No risk. Pure football reputation.</p>
        </div>
      </section>

    </main>
  )
}
