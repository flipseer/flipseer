export default function DisclaimerPage() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#2E9E5E', marginBottom: '8px' }}>⚖️ Disclaimer</h1>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '40px' }}>Last Updated: May 26, 2026</p>

        <p style={{ color: '#D1FAE5', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
          Flipseer.com is a <strong style={{ color: 'white' }}>completely free football prediction and reputation platform</strong> designed for entertainment and skill-based competition.
        </p>

        {[
          {
            title: '1. Flipseer is NOT a Gambling or Betting Platform',
            items: [
              'Flipseer does not involve any form of betting, gambling, wagering, or monetary transactions.',
              'No money is wagered, won, or lost on this platform.',
              'All points, rankings, badges, and streaks have zero monetary value.',
              'Predictions are for entertainment and reputation-building purposes only.',
            ],
          },
          {
            title: '2. Entertainment & Skill-Based Platform',
            body: 'Flipseer is a football forecasting community where users compete based on their football knowledge and prediction accuracy. It operates purely as a skill-based reputation system.',
          },
          {
            title: '3. No Financial Advice',
            body: 'Predictions made on Flipseer are user opinions and should not be used as financial, betting, or investment advice. Flipseer makes no guarantees regarding the accuracy of any prediction.',
          },
          {
            title: '4. Match Data & Information',
            body: 'Match schedules, scores, statistics, and other football data are sourced from public information and third-party providers. While we strive for accuracy, Flipseer does not guarantee the completeness or timeliness of this information.',
          },
          {
            title: '5. Leaderboard & Reputation System',
            items: [
              'Leaderboards and rankings are calculated automatically based on user predictions.',
              'Flipseer reserves the right to remove or adjust rankings in cases of suspected fraud, multiple accounts, or abuse of the system.',
              'All prediction records are permanent and publicly visible.',
            ],
          },
          {
            title: '6. No Affiliation',
            body: 'Flipseer is an independent platform and is not affiliated, endorsed, or sponsored by FIFA, any national football federation, or official tournament organizers.',
          },
          {
            title: '7. User Responsibility',
            body: 'Users are solely responsible for their account activity and predictions. You must be at least 13 years old to use Flipseer.',
          },
        ].map(({ title, body, items }) => (
          <div key={title} style={{ marginBottom: '32px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#2E9E5E', marginBottom: '12px' }}>{title}</h2>
            {body && <p style={{ color: '#D1FAE5', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{body}</p>}
            {items && (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {items.map((item, i) => (
                  <li key={i} style={{ color: '#D1FAE5', fontSize: '14px', lineHeight: '1.8' }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Agreement box */}
        <div style={{ backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #2E9E5E', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <p style={{ color: '#D1FAE5', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            By using Flipseer.com, you acknowledge that you have read, understood, and agreed to this Disclaimer, along with our{' '}
            <a href="/terms" style={{ color: '#2E9E5E' }}>Terms of Service</a> and{' '}
            <a href="/privacy" style={{ color: '#2E9E5E' }}>Privacy Policy</a>.
          </p>
        </div>

        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '32px' }}>
          If you have any questions regarding this Disclaimer, please contact us at{' '}
          <a href="mailto:contact@flipseer.com" style={{ color: '#2E9E5E' }}>contact@flipseer.com</a>.
        </p>

        <div style={{ borderTop: '1px solid #1A7A4A', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '16px', margin: 0 }}>
            Flipseer – Predict. Compete. Build Your Legacy.
          </p>
        </div>

      </div>
    </main>
  );
}
