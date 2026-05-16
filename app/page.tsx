'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    await supabase.from('waitlist').insert([{ email }]);
    setSubmitted(true);
  };

  const days = Math.ceil((new Date('2026-06-11').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '999px', marginBottom: '24px', letterSpacing: '1px' }}>
          ⚽ WORLD CUP 2026 — BUILD YOUR REPUTATION BEFORE KICK-OFF
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 'bold', lineHeight: 1.15, maxWidth: '800px', margin: '0 auto 24px' }}>
          Build your forecasting<br />
          <span style={{ color: '#2E9E5E' }}>reputation in football.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Where correct calls earn you status among real fans. No betting. No AI tips. Pure football reputation.
        </p>
        {!submitted ? (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D2B14', color: 'white', fontSize: '15px', width: '280px', outline: 'none' }} />
            <button onClick={handleSubmit}
              style={{ padding: '14px 28px', backgroundColor: '#2E9E5E', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Claim Your Spot →
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '12px', padding: '20px 40px', display: 'inline-block' }}>
            <p style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '16px' }}>✅ You're on the list!</p>
          </div>
        )}
        <div style={{ marginTop: '32px', fontSize: '14px', color: '#6B7280' }}>🏆 {days} days to World Cup 2026 kick-off</div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '8px' }}>How Flipseer Works</h2>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Simple. Addictive. Permanent.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            { num: '01', title: 'Predict', icon: '🎯', body: 'Submit your scoreline + confidence % before kick-off. Lock in your football brain — no edits, no excuses.' },
            { num: '02', title: 'Earn Reputation', icon: '⭐', body: 'Exact score → +30 pts · Correct winner → +10 pts · Bold calls (80%+) earn a confidence multiplier. Reputation updates instantly.' },
            { num: '03', title: 'Build Your Legacy', icon: '👑', body: 'Every prediction lives forever in your Forecast Journal. Collect badges. Climb global leaderboards. Your forecasting identity grows with every tournament.' },
          ].map(({ num, title, icon, body }) => (
            <div key={num} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '32px 24px' }}>
              <div style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>{num}</div>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '12px' }}>{title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '60px 20px 80px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '16px' }}>Ready to build your legacy?</h2>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>Join forecasters building their reputation before the World Cup.</p>
        <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#2E9E5E', color: 'white', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
          Start Predicting Now →
        </a>
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · flipseer.com · Pure football reputation.</p>
      </footer>
    </main>
  );
}
