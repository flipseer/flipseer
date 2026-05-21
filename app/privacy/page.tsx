export default function PrivacyPolicy() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#2E9E5E', marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Effective Date: May 21, 2026 · Last Updated: May 21, 2026</p>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>flipseer.com · contact@flipseer.com</p>
        </div>

        {[
          {
            title: '1. Introduction',
            content: 'Welcome to Flipseer. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our football prediction platform at flipseer.com.'
          },
          {
            title: '2. Information We Collect',
            content: null,
            bullets: [
              'Email address (required for account creation)',
              'Username (permanent public identity)',
              'Password (stored encrypted, never visible to us)',
              'Country and favorite club (optional)',
              'Prediction data (match selections, confidence, timestamps)',
              'Usage data (pages visited, session duration)',
              'Device information and IP address (security purposes)',
            ]
          },
          {
            title: '3. How We Use Your Information',
            content: null,
            bullets: [
              'To create and manage your account and permanent prediction record',
              'To display your predictions, points, and badges on public profiles',
              'To send transactional emails (confirmation, reset, match notifications)',
              'To calculate leaderboard rankings (individual and national)',
              'To detect and prevent fraud, cheating, and abuse',
              'To improve our platform based on usage patterns',
            ]
          },
          {
            title: '4. Public Information',
            content: 'Flipseer is built on permanent public records. The following is publicly visible by design: your username, prediction history, points, badges, streaks, country, and public profile URL (flipseer.com/u/username). Your email address is NEVER publicly displayed.'
          },
          {
            title: '5. Third-Party Services',
            content: 'We use Supabase (database), Vercel (hosting), Resend (email), Upstash (caching), API-Football (match data), and PostHog (analytics). We do NOT sell your data. We do NOT share data with advertisers. Flipseer is ad-free.'
          },
          {
            title: '6. Data Retention',
            content: 'Your prediction history is retained indefinitely — this is core to our permanent record promise. Account data is retained while your account is active. Personal data is deleted within 30 days of account deletion request.'
          },
          {
            title: '7. Your Rights',
            content: null,
            bullets: [
              'Access the personal data we hold about you',
              'Request correction of inaccurate data',
              'Request deletion of your account',
              'Export your prediction history',
              'Withdraw consent at any time',
            ]
          },
          {
            title: '8. Security',
            content: 'We implement encrypted passwords, Row Level Security (RLS) on all database tables, HTTPS connections, and email verification. No method of internet transmission is 100% secure.'
          },
          {
            title: '9. Children\'s Privacy',
            content: 'Flipseer is not directed to children under 13. We do not knowingly collect data from children under 13. Contact us at contact@flipseer.com if you believe a child has provided their information.'
          },
          {
            title: '10. Contact Us',
            content: 'For privacy questions: contact@flipseer.com'
          },
        ].map(({ title, content, bullets }) => (
          <div key={title} style={{ marginBottom: '32px', borderBottom: '1px solid #1A3A1A', paddingBottom: '24px' }}>
            <h2 style={{ color: '#2E9E5E', fontSize: '18px', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>{title}</h2>
            {content && <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8' }}>{content}</p>}
            {bullets && (
              <ul style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                {bullets.map((b, i) => <li key={i} style={{ marginBottom: '6px' }}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="/terms" style={{ color: '#2E9E5E', fontSize: '13px', marginRight: '24px' }}>Terms of Service</a>
          <a href="/" style={{ color: '#2E9E5E', fontSize: '13px' }}>← Back to Home</a>
        </div>

        <p style={{ textAlign: 'center', color: '#4B5563', fontSize: '12px', marginTop: '24px' }}>
          © 2026 Flipseer · Pure football reputation. No betting. Ever.
        </p>
      </div>
    </main>
  );
}
