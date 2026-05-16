export default function About() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#2E9E5E', marginBottom: '8px' }}>⚽ About Flipseer</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '40px' }}>Built for real football fans. No betting. No AI tips. Just you.</p>

        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', color: '#2E9E5E', marginBottom: '12px' }}>What is Flipseer?</h2>
          <p style={{ color: '#D1FAE5', lineHeight: '1.7', fontSize: '15px' }}>
            Flipseer is a football forecasting platform where your prediction skills are permanently recorded. 
            Every correct call earns you reputation points. Every match is a chance to prove your football intelligence — on record, forever.
          </p>
        </div>

        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', color: '#2E9E5E', marginBottom: '12px' }}>Why we built this</h2>
          <p style={{ color: '#D1FAE5', lineHeight: '1.7', fontSize: '15px' }}>
            Every fan has opinions. But opinions fade. We wanted to create a place where your football knowledge 
            becomes a permanent record — a Forecast Journal that shows the world how good your football instincts really are.
          </p>
        </div>

        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', color: '#2E9E5E', marginBottom: '12px' }}>Our values</h2>
          <ul style={{ color: '#D1FAE5', lineHeight: '2', fontSize: '15px', paddingLeft: '20px' }}>
            <li>🚫 No betting. No money involved.</li>
            <li>🤖 No AI tips. Your predictions only.</li>
            <li>📖 Permanent record. Every call is logged.</li>
            <li>🌍 Global & national leaderboards.</li>
            <li>⚽ Pure football reputation.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', color: '#2E9E5E', marginBottom: '12px' }}>World Cup 2026</h2>
          <p style={{ color: '#D1FAE5', lineHeight: '1.7', fontSize: '15px' }}>
            Flipseer launches with the FIFA World Cup 2026 — the biggest football tournament on earth. 
            64 matches. 48 teams. One chance to build your legacy as a forecaster before the world watches.
          </p>
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
