'use client';

export default function About() {
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px', background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', borderBottom: '1px solid #1A7A4A' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>⚽</div>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>ABOUT FLIPSEER</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: '1.2', marginBottom: '20px', maxWidth: '700px', margin: '0 auto 20px' }}>
          <span style={{ color: '#2E9E5E' }}>Football's Reputation Marketplace.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Not a betting site. Not a fantasy game. Something entirely new —
          a permanent, public record of your football intelligence.
        </p>
      </section>

      {/* ORIGIN STORY */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>THE STORY</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '24px', lineHeight: '1.3' }}>
          Every fan has an opinion.<br />Few have a record.
        </h2>
        <div style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.9', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            Football fans have always predicted matches — in living rooms, WhatsApp groups, offices, and stadiums. But those predictions disappear. No record. No proof. No legacy.
          </p>
          <p>
            Flipseer was built to change that. We give every football fan a permanent, verifiable record of their football intelligence — built match by match, tournament by tournament, decade by decade.
          </p>
          <p style={{ color: '#D1FAE5', fontStyle: 'italic', borderLeft: '3px solid #2E9E5E', paddingLeft: '20px', fontSize: '17px' }}>
            "I don't follow football. I foresee it."
          </p>
          <p>
            That's the Flipseer forecaster. Someone who doesn't just watch the game — they read it, anticipate it, and prove it. Before the world catches up.
          </p>
        </div>
      </section>

      {/* WHAT WE ARE / WHAT WE ARE NOT */}
      <section style={{ backgroundColor: '#0D2B14', borderTop: '1px solid #1A7A4A', borderBottom: '1px solid #1A7A4A', padding: '64px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '32px', textAlign: 'center' }}>THE DIFFERENCE</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* What we ARE */}
            <div style={{ backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#2E9E5E', marginBottom: '16px' }}>Flipseer IS</h3>
              {[
                'A permanent reputation system',
                'A football intelligence platform',
                'A global & national leaderboard',
                'A record that lives forever',
                'Pure. Clean. Football.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#2E9E5E', fontSize: '14px' }}>→</span>
                  <span style={{ color: '#D1FAE5', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* What we ARE NOT */}
            <div style={{ backgroundColor: '#0D1F0F', border: '1px solid #7F1D1D', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🚫</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#FCA5A5', marginBottom: '16px' }}>Flipseer is NOT</h3>
              {[
                'A betting platform',
                'A gambling site',
                'A fantasy football game',
                'An AI tips service',
                'A clone of anything.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#FCA5A5', fontSize: '14px' }}>✕</span>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* GROWTH POTENTIAL */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>THE VISION</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '32px' }}>Where Flipseer is going</h2>

        {[
          {
            icon: '📈',
            title: 'Growth Potential',
            rating: '8/10 → 9.5/10',
            desc: 'Strong foundations today. As social proof emerges — real users, real predictions, real results — growth accelerates to near-perfect. Every World Cup match is a growth event.',
            color: '#2E9E5E',
          },
          {
            icon: '🌍',
            title: 'Popularity Potential',
            rating: 'Very High Internationally',
            desc: 'Football is the world\'s game. Flipseer speaks to every football nation. When visuals become elite and sharing becomes addictive, international popularity explodes.',
            color: '#3B82F6',
          },
          {
            icon: '🏗️',
            title: 'Ecosystem Strength',
            rating: 'Extremely Strong',
            desc: 'Leaderboards + reputation history + permanent records = a moat no competitor can replicate overnight. The longer a user stays, the more valuable their profile becomes.',
            color: '#F59E0B',
          },
          {
            icon: '👑',
            title: 'Destiny Path',
            rating: 'The LinkedIn of Football Reputation',
            desc: 'A platform where your football intelligence is publicly verified, professionally presented, and permanently recorded. Your Flipseer profile becomes your football CV.',
            color: '#A855F7',
          },
        ].map(({ icon, title, rating, desc, color }) => (
          <div key={title} style={{ backgroundColor: '#0D2B14', border: `1px solid ${color}30`, borderLeft: `4px solid ${color}`, borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{title}</div>
                <div style={{ fontSize: '12px', color, fontWeight: 'bold' }}>{rating}</div>
              </div>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* ROADMAP */}
      <section style={{ backgroundColor: '#0D2B14', borderTop: '1px solid #1A7A4A', borderBottom: '1px solid #1A7A4A', padding: '64px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px', textAlign: 'center' }}>ROADMAP</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '32px', textAlign: 'center' }}>The journey ahead</h2>

          {[
            { phase: 'Phase 1', date: 'June 2026', title: 'World Cup Launch', desc: '64 matches. Global leaderboards. Building the first wave of football forecasters.', done: false, current: true },
            { phase: 'Phase 2', date: 'Aug 2026', title: 'EPL & Champions League', desc: 'Europe\'s biggest leagues. Your reputation builds year-round, not just tournaments.', done: false, current: false },
            { phase: 'Phase 3', date: 'Jul 2026', title: 'Flipseer Pro', desc: 'Advanced analytics, AI insights, exclusive badges, and premium features.', done: false, current: false },
            { phase: 'Phase 4', date: 'Sep 2026', title: 'La Liga, Serie A, Bundesliga', desc: 'Full European football coverage. The complete football reputation platform.', done: false, current: false },
            { phase: 'Phase 5', date: '2027+', title: 'Brand Partnerships & Legacy', desc: 'Sponsorships, verified forecaster badges, and the football reputation economy.', done: false, current: false },
          ].map(({ phase, date, title, desc, current }) => (
            <div key={phase} style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: current ? '#2E9E5E' : '#1A3A20', border: `2px solid ${current ? '#2E9E5E' : '#1A7A4A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: current ? 'white' : '#6B7280' }}>
                  {current ? '→' : '○'}
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: current ? 'rgba(46,158,94,0.08)' : 'transparent', border: current ? '1px solid rgba(46,158,94,0.3)' : '1px solid transparent', borderRadius: '12px', padding: current ? '16px' : '4px 16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold' }}>{phase}</span>
                  <span style={{ fontSize: '11px', color: '#2E9E5E', backgroundColor: '#0D1F0F', padding: '2px 8px', borderRadius: '999px' }}>{date}</span>
                  {current && <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold' }}>← NOW</span>}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ textAlign: 'center', padding: '80px 24px', maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '24px' }}>OUR MANIFESTO</p>
        <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: '22px', lineHeight: '1.7', color: 'white', fontStyle: 'italic', marginBottom: '32px' }}>
          "Football is not just a game. It's history.<br/>
          And history deserves a record.<br/>
          <span style={{ color: '#2E9E5E' }}>Flipseer is that record.</span>"
        </blockquote>
        <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8', marginBottom: '40px' }}>
          Every correct prediction. Every upset called. Every exact score.<br />
          Written into your permanent profile. Forever.
        </p>
        <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '16px 48px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px', boxShadow: '0 0 32px rgba(46,158,94,0.3)' }}>          Start Building Your Legacy →
        </a>
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation. No betting. Ever.</p>
      </footer>

    </main>
  );
}
