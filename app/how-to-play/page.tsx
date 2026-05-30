import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Play | Flipseer — Football Prediction Guide',
  description: 'Learn how to predict football matches, earn points, and build your permanent reputation on Flipseer. Free. No betting.',
  alternates: { canonical: 'https://flipseer.com/how-to-play' },
}

const STEPS = [
  { number: '01', title: 'Sign Up Free', description: 'Create your free Flipseer account. Set your country to compete on national leaderboards.', icon: '&#x1F464;' },
  { number: '02', title: 'Pick Your Matches', description: 'Go to the Predict page. Choose matches from World Cup 2026. Pick Home Win, Draw, or Away Win.', icon: '&#x26BD;' },
  { number: '03', title: 'Set Your Confidence', description: 'Slide your confidence from 1% to 100%. Higher confidence = more points if correct, fewer if wrong.', icon: '&#x1F3AF;' },
  { number: '04', title: 'Predict the Exact Score', description: 'Predict the exact final scoreline for a massive bonus. e.g. Brazil 2-1 Morocco. Worth up to 55 pts!', icon: '&#x1F522;' },
  { number: '05', title: 'Lock In Before Kick-off', description: 'Predictions lock at kick-off. Once locked, your call is permanent. No edits. Your word stands forever.', icon: '&#x1F512;' },
  { number: '06', title: 'Earn Points and Climb', description: 'After each match, points are calculated and added to your record. Climb global and national leaderboards.', icon: '&#x1F3C6;' },
]

const SCORING = [
  { label: 'Correct outcome (Win/Draw/Loss)', points: '10 pts base', highlight: false },
  { label: 'Correct goal difference', points: '+18 pts', highlight: false },
  { label: 'Exact score (replaces goal diff)', points: '+55 pts', highlight: true },
  { label: 'Upset bonus (underdog wins)', points: '+12 pts', highlight: false },
  { label: 'Confidence 80%+', points: 'x1.4 multiplier', highlight: false },
  { label: 'Confidence 60-79%', points: 'x1.2 multiplier', highlight: false },
  { label: 'Confidence 40-59%', points: 'x1.0 multiplier', highlight: false },
  { label: 'Confidence below 40%', points: 'x0.8 multiplier', highlight: false },
  { label: 'Maximum points per match', points: '108 pts', highlight: true },
]

const BADGES = [
  { icon: '&#x1F947;', badge: 'Founding Forecaster', how: 'Joined Flipseer before the World Cup 2026 launch — forever on record', rarity: 'Legendary' },
  { icon: '&#x1F3AF;', badge: 'Score Master', how: 'Predict the exact final score correctly', rarity: 'Rare' },
  { icon: '&#x1F631;', badge: 'Upset King', how: 'Correctly predict an underdog victory', rarity: 'Rare' },
  { icon: '&#x26A1;', badge: 'Match Hero', how: 'Earn the highest points in a single match', rarity: 'Epic' },
  { icon: '&#x1F981;', badge: 'Bold Caller', how: 'Predict an upset with 80%+ confidence', rarity: 'Epic' },
  { icon: '&#x1F525;', badge: 'Hot Streak x5', how: 'Get 5 correct predictions in a row', rarity: 'Uncommon' },
  { icon: '&#x26A1;', badge: 'Hot Streak x7', how: 'Get 7 correct predictions in a row', rarity: 'Rare' },
  { icon: '&#x1F451;', badge: 'Hot Streak x10', how: 'Get 10 correct predictions in a row', rarity: 'Legendary' },
]

const RARITY_COLORS: { [key: string]: string } = {
  'Uncommon': '#2E9E5E',
  'Rare': '#3B82F6',
  'Epic': '#8B5CF6',
  'Legendary': '#F59E0B',
}

export default function HowToPlay() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>GUIDE</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', marginBottom: '12px' }}>How to Play</h1>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.7' }}>
            Your complete guide to predicting football matches and building your permanent reputation on Flipseer.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '24px', textAlign: 'center' }}>6 STEPS</p>
          {STEPS.map((step) => (
            <div key={step.number} style={{ display: 'flex', gap: '16px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px', minWidth: '40px' }} dangerouslySetInnerHTML={{ __html: step.icon }} />
              <div>
                <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '4px' }}>STEP {step.number}</div>
                <h3 style={{ fontSize: '17px', marginBottom: '6px', color: 'white' }}>{step.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DAILY LIMIT */}
      <section style={{ padding: '32px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #F59E0B', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '28px' }}>&#x26A0;</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '6px' }}>Daily Prediction Limit</div>
              <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                You can make up to <strong style={{ color: 'white' }}>8 new predictions per day</strong>. Updates to existing predictions do not count toward the limit. Resets at midnight UTC every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCORING */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>SCORING SYSTEM</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>How Points Work</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>Maximum 108 points per match. Skill + boldness = rewards.</p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            {SCORING.map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < SCORING.length - 1 ? '1px solid #1A3A20' : 'none', backgroundColor: row.highlight ? 'rgba(46,158,94,0.08)' : 'transparent' }}>
                <span style={{ color: row.highlight ? '#D1FAE5' : '#9CA3AF', fontSize: '14px' }}>{row.label}</span>
                <span style={{ color: row.highlight ? '#2E9E5E' : '#6B7280', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '16px' }}>{row.points}</span>
              </div>
            ))}
          </div>

          {/* Example */}
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>EXAMPLE &#x2014; MAXIMUM SCORE</p>
            <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '2.2' }}>
              <div>You predict: <strong style={{ color: 'white' }}>South Africa win</strong> (upset) &#x2713;</div>
              <div>Exact score: <strong style={{ color: 'white' }}>4-2</strong> &#x2713;</div>
              <div>Confidence: <strong style={{ color: 'white' }}>85%</strong></div>
              <div style={{ borderTop: '1px solid #1A3A1A', marginTop: '8px', paddingTop: '8px', color: '#D1FAE5' }}>
                10 + 55 (exact) + 12 (upset) = 77 &#xD7; 1.4 = <strong style={{ color: '#2E9E5E', fontSize: '18px' }}>107 pts!</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BADGES */}
      <section style={{ padding: '48px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>BADGES</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>How to Earn Badges</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
            Badges are permanent. They appear on your public profile forever.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BADGES.map(({ icon, badge, how, rarity }) => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ fontSize: '28px', minWidth: '36px', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', marginBottom: '3px' }}>{badge}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{how}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: RARITY_COLORS[rarity], padding: '3px 10px', borderRadius: '999px', border: `1px solid ${RARITY_COLORS[rarity]}`, whiteSpace: 'nowrap' }}>
                  {rarity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>Ready to build your record?</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '28px' }}>
            June 11. Mexico vs South Africa. First match. Your legacy starts now.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
              Start Predicting &#x2192;
            </a>
            <a href="/auth" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
              Join Free
            </a>
          </div>
          <p style={{ color: '#4B5563', fontSize: '12px', marginTop: '14px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>

    </main>
  )
}
