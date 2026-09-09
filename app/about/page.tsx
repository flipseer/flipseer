import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Flipseer — Built by a Football Fan, for Football Fans',
  description: 'Flipseer is an independent, founder-led football reputation platform. Free forever. No betting. No gambling. Pure football intelligence.',
  alternates: { canonical: 'https://flipseer.com/about' },
  openGraph: {
    title: 'About Flipseer',
    description: 'Built by a football fan, for football fans. Free forever. No betting.',
    url: 'https://flipseer.com/about',
  },
}

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(64px,10vw,96px) 20px clamp(40px,6vw,64px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)' }}>
        <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>⚽ ABOUT FLIPSEER</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,7vw,56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 24 }}>
          Built by a football fan.<br /><span style={{ color: '#2E9E5E' }}>For football fans.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 16px' }}>
          Flipseer started with one simple question:
        </p>
        <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
          Why does football knowledge disappear into WhatsApp groups and social media feeds?
        </p>
        <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: '#6B7280', lineHeight: 1.9, maxWidth: 520, margin: '0 auto' }}>
          Every opinion. Every prediction. Every &ldquo;I told you so.&rdquo;<br />
          Forgotten the moment the final whistle blows.<br /><br />
          <strong style={{ color: '#9CA3AF' }}>Flipseer was built to change that.</strong>
        </p>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 28 }}>THE FOUNDER</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
              🇮🇳
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 800, marginBottom: 4, color: 'white' }}>Praveen Ballari</h2>
              <p style={{ fontSize: 13, color: '#2E9E5E', fontWeight: 700, marginBottom: 20 }}>Founder of Flipseer · Karnataka, India 🇮🇳</p>
              <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.9, marginBottom: 16 }}>
                I built Flipseer because I was tired of football opinions without accountability.
              </p>
              <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.9, marginBottom: 16 }}>
                I wanted to create a platform where football knowledge is measured, not merely claimed — where consistently predicting matches correctly over time builds something permanent: a genuine reputation.
              </p>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderLeft: '3px solid #2E9E5E', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                  Flipseer is independently built and founder-led — with a clear mission: to create a persistent reputation layer for football knowledge.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="https://linkedin.com/in/praveen-b-ballari-58b2133b1" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 8, padding: '8px 14px', textDecoration: 'none', fontSize: 12, color: '#9CA3AF' }}>
                  💼 LinkedIn
                </a>
                <a href="mailto:contact@flipseer.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 8, padding: '8px 14px', textDecoration: 'none', fontSize: 12, color: '#9CA3AF' }}>
                  ✉️ contact@flipseer.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 20 }}>THE MISSION</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            Turn football opinions into measurable football intelligence.
          </h2>
          <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.9, marginBottom: 12 }}>
            Anyone can say they know football.
          </p>
          <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.9, marginBottom: 24 }}>
            Flipseer creates the infrastructure to help prove it. A persistent prediction record — built:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              { icon: '⚽', text: 'Match by match' },
              { icon: '🏆', text: 'Competition by competition' },
              { icon: '📈', text: 'Season by season' },
              { icon: '🧠', text: 'Prediction by prediction' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 15, color: 'white', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.9 }}>
            Over time, your persistent record becomes your reputation. The same way a chess player&apos;s history reflects their performance, or a developer&apos;s contribution history reflects their work — Flipseer gives football fans a reputation based on their actual track record, not the loudness of their opinions.
          </p>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 28 }}>HONEST BY DESIGN</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: '🔒', title: 'No editing', desc: 'Predictions lock before the relevant event. Your historical record remains transparent.' },
              { icon: '🆓', title: 'Free to participate', desc: 'No subscription required to start building your football reputation.' },
              { icon: '🚫', title: 'No betting', desc: 'No money wagered. No odds. No gambling. Flipseer is about football knowledge — not gambling.' },
              { icon: '🌍', title: 'Built for football fans everywhere', desc: 'Follow competitions, build your track record and discover how your football knowledge compares over time.' },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} style={{ display: 'flex', gap: 16, paddingBottom: 20, borderBottom: i < 3 ? '1px solid #1A3A1A' : 'none' }}>
                <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 20 }}>GET IN TOUCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, marginBottom: 12 }}>We read every message.</h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 28 }}>
            Questions, feedback, partnership ideas or press enquiries — we&apos;d love to hear from you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, marginBottom: 40 }}>
            {[
              { label: 'General', value: 'contact@flipseer.com', href: 'mailto:contact@flipseer.com' },
              { label: 'Website', value: 'flipseer.com', href: 'https://flipseer.com' },
            ].map(({ label, value, href }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '14px 18px' }}>
                <span style={{ fontSize: 11, color: '#4B5563', fontWeight: 700, letterSpacing: '1px' }}>{label.toUpperCase()}</span>
                <a href={href} style={{ fontSize: 13, color: '#2E9E5E', textDecoration: 'none', fontWeight: 600 }}>{value}</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white', padding: '16px 48px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(46,158,94,0.3)', marginBottom: 12 }}>
              ⚽ Start Predicting. Build Your Reputation.
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
