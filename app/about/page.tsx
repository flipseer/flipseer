import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Flipseer — Built by a Football Fan, for Football Fans',
  description: 'Flipseer is a football reputation platform built by Praveen Ballari from Tumkur, India. Free forever. No betting. No gambling. Pure football intelligence.',
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
        <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>ABOUT FLIPSEER</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,7vw,56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
          Built by a football fan.<br /><span style={{ color: '#2E9E5E' }}>For football fans.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
          Flipseer started with one question: why does football knowledge disappear into WhatsApp groups? Every opinion, every prediction — forgotten the moment the final whistle blows.
        </p>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 24 }}>THE FOUNDER</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
              🇮🇳
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 800, marginBottom: 4, color: 'white' }}>Praveen Ballari</h2>
              <p style={{ fontSize: 13, color: '#2E9E5E', fontWeight: 700, marginBottom: 16 }}>Founder · Tumkur, Karnataka, India</p>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 16 }}>
                I built Flipseer because I was tired of football opinions with no accountability. I wanted a platform where football knowledge is measured, not just stated. Where predicting correctly over hundreds of matches means something permanent.
              </p>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 20 }}>
                Flipseer is built and operated solo — engineering, product, content and growth. Every feature you see was built with one goal: give football fans a permanent, honest record of their football intelligence.
              </p>
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

      {/* THE MISSION */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 24 }}>THE MISSION</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, marginBottom: 20 }}>Turn football opinions into measurable football intelligence.</h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 16 }}>
            Anyone can say they know football. Flipseer creates the infrastructure to prove it — a permanent prediction record built match by match, competition by competition, year by year.
          </p>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 32 }}>
            The same way Chess.com gives chess players an Elo rating, or GitHub gives developers a contribution graph — Flipseer gives football fans a reputation that reflects their actual knowledge, not their loudest opinion.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            {[
              { icon: '🔒', title: 'No editing', desc: 'Predictions lock at kickoff. Your record is honest.' },
              { icon: '🆓', title: 'Free forever', desc: 'No subscription. No card. No hidden fees.' },
              { icon: '🚫', title: 'No betting', desc: 'No money wagered. No odds. No gambling. Ever.' },
              { icon: '🌍', title: 'Global', desc: 'EPL, UCL, Liga 1, Ghana PL and more.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 12, padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 24 }}>GET IN TOUCH</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, marginBottom: 16 }}>We read every message.</h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 28 }}>
            Questions, feedback, partnership ideas, press enquiries — reach out directly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
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
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white', padding: '14px 40px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(46,158,94,0.3)' }}>
              ⚽ Start Predicting Free →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
