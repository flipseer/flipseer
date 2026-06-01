import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Flipseer -- The Football Reputation Platform',
  description: 'Flipseer was built to answer one question: who are the world\'s smartest football fans? Learn the story behind the platform.',
  alternates: { canonical: 'https://flipseer.com/about' },
  openGraph: {
    title: 'About Flipseer -- The Football Reputation Platform',
    description: 'Built to answer one question: who are the world\'s smartest football fans?',
    url: 'https://flipseer.com/about',
  }
}

export default function About() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '72px 20px 48px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>OUR STORY</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', lineHeight: '1.2', marginBottom: '20px' }}>
            Who are the world's<br />
            <span style={{ color: '#2E9E5E' }}>smartest football fans?</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '17px', lineHeight: '1.8', margin: 0 }}>
            That question is why Flipseer exists.
          </p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          <p style={{ fontSize: '16px', color: '#D1FAE5', lineHeight: '1.9', marginBottom: '20px' }}>
            Every day, millions of football supporters debate match results, players, and tournaments across social media.
          </p>

          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '20px' }}>
            But once the match ends, most predictions disappear.
          </p>

          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '14px', padding: '24px 28px', margin: '32px 0' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: 'white', lineHeight: '1.7', margin: '0 0 8px', fontStyle: 'italic' }}>
              "Nobody remembers who was right. Nobody keeps score."
            </p>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>That observation led to Flipseer.</p>
          </div>

          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '20px' }}>
            For years, football fans passionately discussed the game online. Everyone had opinions. Everyone claimed expertise. Yet there was no global system that could permanently track prediction accuracy and build football reputation over time.
          </p>

          <p style={{ fontSize: '16px', color: '#D1FAE5', lineHeight: '1.9', marginBottom: '20px', fontWeight: 'bold' }}>
            That felt like a missing category.
          </p>

          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '20px' }}>
            Most football products focus on watching matches, consuming content, fantasy sports, or betting. Flipseer takes a different approach.
          </p>

        </div>
      </section>

      {/* THREE QUESTIONS */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '24px', textAlign: 'center' }}>THE QUESTIONS WE ASKED</p>
          {[
            { q: 'What if every football fan had a public prediction record?', icon: '&#x1F4D6;' },
            { q: 'What if football intelligence could be measured over time?', icon: '&#x1F4CA;' },
            { q: 'What if fans competed with knowledge instead of money?', icon: '&#x1F3C6;' },
          ].map(({ q, icon }) => (
            <div key={q} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px 24px', marginBottom: '12px' }}>
              <div style={{ fontSize: '28px', minWidth: '40px' }} dangerouslySetInnerHTML={{ __html: icon }} />
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: 'white', lineHeight: '1.6', margin: 0 }}>{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT FLIPSEER IS */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>WHAT FLIPSEER IS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '20px', textAlign: 'center' }}>A reputation system for football fans.</h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '32px', textAlign: 'center' }}>
            Flipseer was never intended to be another betting platform or fantasy sports product. It was designed as a place where predictions are permanently recorded and performance is measured across tournaments and seasons.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { icon: '&#x26BD;', text: 'Predict World Cup matches' },
              { icon: '&#x1F3C6;', text: 'Compete on national leaderboards' },
              { icon: '&#x1F30D;', text: 'Climb global rankings' },
              { icon: '&#x1F4C8;', text: 'Build a public prediction history' },
              { icon: '&#x1F465;', text: 'Create prediction teams' },
              { icon: '&#x2705;', text: '100% Free. Always.' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <span style={{ fontSize: '14px', color: '#D1FAE5' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* No betting */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            {['&#x1F6AB; No Betting', '&#x1F6AB; No Gambling', '&#x1F6AB; No Money'].map(item => (
              <div key={item} style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #7F1D1D', borderRadius: '999px', padding: '6px 18px' }}>
                <span style={{ fontSize: '13px', color: '#FCA5A5', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE VISION */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>THE VISION</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '24px', textAlign: 'center' }}>Football fandom is evolving.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              { era: 'In the past', desc: 'Fans watched football.' },
              { era: 'Today', desc: 'Fans create football content.' },
              { era: 'Tomorrow', desc: 'Fans will compete through football intelligence.' },
            ].map(({ era, desc }, i) => (
              <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ fontSize: '22px', minWidth: '32px', textAlign: 'center', color: '#2E9E5E', fontWeight: 'bold' }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '2px' }}>{era.toUpperCase()}</div>
                  <div style={{ fontSize: '15px', color: 'white' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '24px' }}>
            With FIFA World Cup 2026 approaching, millions of fans across India, Nigeria, Indonesia, Saudi Arabia, and beyond will follow every match. For the first time, they may also have the opportunity to build a public football reputation and prove their forecasting ability on a global stage.
          </p>

          {/* The analogy */}
          <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '14px', padding: '28px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#D1FAE5', lineHeight: '1.7', margin: '0 0 12px' }}>
              "Social media created public social reputation."
            </p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#2E9E5E', fontWeight: 'bold', lineHeight: '1.7', margin: 0 }}>
              "Flipseer aims to create public football reputation."
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>OUR MISSION</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '16px', lineHeight: '1.3' }}>
            To build the world's largest<br />football prediction competition.
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: '1.9', marginBottom: '32px' }}>
            And become the global home for football forecasting.
          </p>

          <div style={{ backgroundColor: '#0D2B14', border: '2px solid #1A7A4A', borderRadius: '16px', padding: '32px' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: 'white', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }}>
              "In football, everyone has an opinion."
            </p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#2E9E5E', fontWeight: 'bold', margin: 0 }}>
              "Flipseer is where you prove it."
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: '64px 20px', backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>BUILT BY</p>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #2E9E5E, #1A7A4A)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
            &#x26BD;
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '6px' }}>Praveen Ballari</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>Founder, Flipseer &middot; Tumkur, Karnataka, India</p>
          <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.8', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Solo bootstrap founder. Built Flipseer from scratch in 2026 to give football fans a permanent home for their predictions and reputation.
          </p>
          <a href="mailto:contact@flipseer.com" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
            contact@flipseer.com
          </a>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Ready to prove it?</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '28px' }}>
            World Cup 2026 starts June 11. Your record starts now.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontSize: '17px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(46,158,94,0.3)' }}>
            Join Free &#x2192;
          </a>
          <p style={{ color: '#4B5563', fontSize: '12px', marginTop: '12px' }}>Free. No betting. Pure football.</p>
        </div>
      </section>

    </main>
  )
}
