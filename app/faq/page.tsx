const FAQS = [
  {
    q: 'Is Flipseer free to use?',
    a: 'Yes, completely free. No subscription, no hidden fees, no betting involved.'
  },
  {
    q: 'Is this gambling or betting?',
    a: 'No. Flipseer is purely a reputation and skill platform. No money is involved at any point. You predict matches to earn points and build your forecasting record.'
  },
  {
    q: 'How do I earn points?',
    a: 'You earn points for correct predictions before kick-off. The more confident you are and the more accurate your prediction, the more points you earn. Exact score predictions earn bonus points.'
  },
  {
    q: 'What is an exact score prediction?',
    a: 'After picking a match outcome (Home Win / Draw / Away Win), you can also predict the exact scoreline (e.g. 2–1). If you get it right, you earn an extra 25 bonus points!'
  },
  {
    q: 'What is the upset bonus?',
    a: 'If a match result is considered an upset (the underdog wins) and you predicted it correctly, you earn an extra 12 bonus points. Rewards bold, brave calls.'
  },
  {
    q: 'When do predictions lock?',
    a: 'Predictions lock at kick-off time. You cannot change or submit predictions after the match starts.'
  },
  {
    q: 'What is the Forecast Journal?',
    a: 'Your Forecast Journal is your permanent prediction history — every match you predicted, your pick, confidence level, and points earned. It\'s your football reputation on record.'
  },
  {
    q: 'How does the leaderboard work?',
    a: 'Players are ranked by total points earned. There is a global leaderboard and national leaderboards so you can compete with fans from your country.'
  },
  {
    q: 'Can I change my prediction?',
    a: 'Yes, you can update your prediction any time before kick-off. Once the match starts, it locks permanently.'
  },
  {
    q: 'Which matches are available?',
    a: 'Currently Flipseer covers FIFA World Cup 2026 matches. More leagues and tournaments will be added after launch.'
  },
];

export default function FAQ() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#2E9E5E', marginBottom: '8px' }}>❓ FAQ</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '40px' }}>Everything you need to know about Flipseer.</p>

        {FAQS.map((faq, i) => (
          <div key={i} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#2E9E5E', marginBottom: '10px' }}>Q: {faq.q}</h3>
            <p style={{ color: '#D1FAE5', lineHeight: '1.7', fontSize: '14px', margin: 0 }}>{faq.a}</p>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="/auth" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>            Start Predicting →
          </a>
        </div>

      </div>
    </main>
  );
}
