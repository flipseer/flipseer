export default function TermsOfService() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '60px 20px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#2E9E5E', marginBottom: '8px' }}>Terms of Service</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Effective Date: May 21, 2026 · Last Updated: May 21, 2026</p>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>flipseer.com · contact@flipseer.com</p>
        </div>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using Flipseer at flipseer.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.'
          },
          {
            title: '2. Description of Service',
            content: 'Flipseer is a FREE football prediction reputation platform. Users predict match outcomes and build a permanent public record. Flipseer is NOT a gambling platform — no money is wagered, won, or lost. All predictions are for reputation purposes only.'
          },
          {
            title: '3. Account Registration',
            content: null,
            bullets: [
              'Valid email address required for account creation',
              'Username is permanent and public — choose carefully',
              'Must be at least 13 years old',
              'One account per person — multiple accounts are prohibited',
              'You are responsible for your account security',
              'Do not impersonate other users or public figures',
            ]
          },
          {
            title: '4. Predictions and Permanent Records',
            content: null,
            bullets: [
              'Predictions are permanently recorded and cannot be deleted or modified',
              'Predictions are publicly visible to all users and visitors',
              'Once a match kicks off, predictions are locked permanently',
              'Your prediction history is your permanent public reputation record',
              'Flipseer may display predictions in leaderboards and promotional materials',
            ]
          },
          {
            title: '5. Prohibited Conduct',
            content: null,
            bullets: [
              'Creating multiple accounts to manipulate leaderboards',
              'Using bots or automated tools to submit predictions',
              'Attempting to predict after match kickoff by any technical means',
              'Harassing, abusing, or threatening other users',
              'Uploading malicious code or attempting to compromise security',
              'Using the platform for commercial purposes without written consent',
              'Reverse engineering or copying the platform',
            ]
          },
          {
            title: '6. Points, Rankings & Badges',
            content: 'Points, rankings, badges, and streaks have NO monetary value and cannot be exchanged for cash or prizes. They represent reputation only. Flipseer reserves the right to adjust scoring systems and correct calculation errors.'
          },
          {
            title: '7. No Gambling',
            content: 'Flipseer is explicitly NOT a gambling service. No money is wagered. No financial reward is offered. The platform operates purely as a reputation and skill-tracking service.'
          },
          {
            title: '8. Intellectual Property',
            content: 'The Flipseer platform, design, code, and branding is owned by Flipseer. You retain ownership of your prediction data but grant Flipseer a license to display and use this data to operate the platform.'
          },
          {
            title: '9. Disclaimer of Warranties',
            content: 'Flipseer is provided "as is" without warranties. We do not guarantee uninterrupted service, accuracy of match data, or availability of historical records. Match data is sourced from third parties and may occasionally contain errors.'
          },
          {
            title: '10. Limitation of Liability',
            content: 'To the maximum extent permitted by law, Flipseer shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform.'
          },
          {
            title: '11. Account Termination',
            content: 'Flipseer reserves the right to suspend or terminate accounts that violate these Terms, engage in cheating, or are used for abuse. Request account deletion at contact@flipseer.com.'
          },
          {
            title: '12. Changes to Terms',
            content: 'We may modify these Terms at any time. Continued use after changes constitutes acceptance. We will notify users of significant changes via email.'
          },
          {
            title: '13. Contact',
            content: 'For questions about these Terms: contact@flipseer.com'
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
          <a href="/privacy" style={{ color: '#2E9E5E', fontSize: '13px', marginRight: '24px' }}>Privacy Policy</a>
          <a href="/" style={{ color: '#2E9E5E', fontSize: '13px' }}>← Back to Home</a>
        </div>

        <p style={{ textAlign: 'center', color: '#4B5563', fontSize: '12px', marginTop: '24px' }}>
          © 2026 Flipseer · Pure football reputation. No betting. Ever.
        </p>
      </div>
    </main>
  );
}
