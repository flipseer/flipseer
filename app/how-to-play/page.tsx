const STEPS = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your free Flipseer account. Set your country to compete on national leaderboards.',
    icon: '👤',
  },
  {
    number: '02',
    title: 'Pick Your Matches',
    description: 'Go to the Predict page and choose matches from World Cup 2026. Pick Home Win, Draw, or Away Win.',
    icon: '⚽',
  },
  {
    number: '03',
    title: 'Set Your Confidence',
    description: 'Slide your confidence from 1% to 100%. Higher confidence = more points if correct, fewer if wrong.',
    icon: '🎚️',
  },
  {
    number: '04',
    title: 'Add Exact Score (Optional)',
    description: 'Predict the exact scoreline for a bonus +25 points. E.g. Brazil 2–1 Croatia.',
    icon: '🎯',
  },
  {
    number: '05',
    title: 'Lock In Before Kick-off',
    description: 'Predictions lock at kick-off. Make sure you submit before the match starts!',
    icon: '🔒',
  },
  {
    number: '06',
    title: 'Earn Points & Climb',
    description: 'After each match, points are calculated automatically. Climb the global and national leaderboards.',
    icon: '🏆',
  },
];

const SCORING = [
  { label: 'Correct outcome', points: '10 pts base' },
  { label: 'Correct goal difference', points: '18 pts' },
  { label: 'Exact score', points: '30 pts' },
  { label: 'Exact score bonus', points: '+25 pts' },
  { label: 'Upset bonus (underdog wins)', points: '+12 pts' },
  { label: 'High confidence multiplier (80%+)', points: '×1.4' },
  { label: 'Medium confidence (60–79%)', points: '×1.2' },
  { label: 'Low confidence (below 40%)', points: '×0.8' },
];

export default function HowToPlay() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#2E9E5E', marginBottom: '8px' }}>🎮 How to Play</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '40px' }}>Your guide to building football forecasting reputation on Flipseer.</p>

        {/* Steps */}
        {STEPS.map((step) => (
          <div key={step.number} style={{ display: 'flex', gap: '16px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', minWidth: '40px' }}>{step.icon}</div>
            <div>
              <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '4px' }}>STEP {step.number}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step.description}</p>
            </div>
          </div>
        ))}

        {/* Scoring */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '12px', padding: '24px', marginTop: '32px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', color: '#2E9E5E', marginBottom: '16px' }}>📊 Scoring System</h2>
          {SCORING.map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < SCORING.length - 1 ? '1px solid #1A3A20' : 'none' }}>
              <span style={{ color: '#D1FAE5', fontSize: '14px' }}>{row.label}</span>
              <span style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '14px' }}>{row.points}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Start Predicting →
          </a>
        </div>

      </div>
    </main>
  );
}
