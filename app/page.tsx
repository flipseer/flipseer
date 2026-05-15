'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date('2026-06-11T00:00:00Z');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) { clearInterval(interval); return; }
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((diff / (1000 * 60)) % 60));
      setSeconds(Math.floor((diff / 1000) % 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);
    setLoading(false);
    if (error) {
      if (error.code === '23505') {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', letterSpacing: '1px' }}>
          ⚽ WORLD CUP 2026 — BUILD YOUR REPUTATION BEFORE KICK-OFF
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 'bold', fontFamily: 'Georgia, serif', lineHeight: 1.15, maxWidth: '800px', margin: '0 auto 20px' }}>
          Build your forecasting<br />
          <span style={{ color: '#2E9E5E' }}>reputation in football.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Where correct calls earn you status among real fans. No betting. No AI tips. Just your football intelligence — on record.
        </p>
        {!submitted ? (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D2B14', color: 'white', fontSize: '16px', width: '280px', outline: 'none' }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: '14px 28px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Claim Your Spot →'}
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#1A7A4A', padding: '16px 32px', borderRadius: '8px', display: 'inline-block', marginBottom: '16px' }}>
            ✅ You're on the list. Your forecasting reputation starts June 11.
          </div>
        )}
        <p style={{ fontSize: '13px', color: '#6B7280' }}>No betting. No spam. Free to join.</p>
      </section>

      {/* COUNTDOWN */}
      <section style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ color: '#6B7280', fontSize: '13px', letterSpacing: '2px', marginBottom: '20px' }}>WORLD CUP 2026 KICKS OFF IN</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[['DAYS', days], ['HOURS', hours], ['MINS', minutes], ['SECS', seconds]].map(([label, val]) => (
            <div key={label as string} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px 28px', minWidth: '80px' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{String(val).padStart(2, '0')}</div>
              <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '48px' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { num: '01', title: 'Predict', desc: 'Submit your match predictions with a confidence percentage before kick-off.' },
            { num: '02', title: 'Earn Reputation', desc: 'Correct calls build your score. Upset calls earn bonus reputation. Streaks multiply it.' },
            { num: '03', title: 'Build Identity', desc: 'Your Forecast Journal grows every season. Share it. Own it. Forever.' },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>{num}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>{title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PREDICTION CARDS */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Real predictions. Real reputation.</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px' }}>Every call you make is permanently on record.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { match: 'Argentina vs Algeria', pick: 'Argentina Win', conf: 78, result: '✅ CORRECT', upset: false },
            { match: 'Germany vs Japan', pick: 'Japan Win', conf: 35, result: '✅ UPSET CALL', upset: true },
            { match: 'Brazil vs Mexico', pick: 'Brazil Win', conf: 82, result: '✅ CORRECT', upset: false },
          ].map(({ match, pick, conf, result, upset }) => (
            <div key={match} style={{ backgroundColor: '#0D2B14', border: `1px solid ${upset ? '#F59E0B' : '#1A7A4A'}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>⚽ World Cup 2026</div>
              <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '15px' }}>{match}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ backgroundColor: '#1A3A20', padding: '4px 10px', borderRadius: '6px', fontSize: '13px' }}>{pick}</span>
                <span style={{ fontSize: '13px', color: '#2E9E5E' }}>{conf}% confidence</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: upset ? '#F59E0B' : '#2E9E5E' }}>{result}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BADGES */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '12px' }}>Earn your badges</h2>
        <p style={{ color: '#6B7280', marginBottom: '40px' }}>Performance-based only. No shortcuts.</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
          {[
            { icon: '⚡', name: 'Upset Specialist', desc: '5+ correct upset calls' },
            { icon: '🎯', name: 'Consistency King', desc: '70%+ accuracy over 30 picks' },
            { icon: '🔥', name: 'Streak Master', desc: '10 correct in a row' },
            { icon: '🏟️', name: 'Derby Oracle', desc: '3+ correct derby calls' },
          ].map(({ icon, name, desc }) => (
            <div key={name} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', width: '150px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{name}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ backgroundColor: '#1A7A4A', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px' }}>
          The World Cup starts June 11.<br />Build your reputation before kick-off.
        </h2>
        <p style={{ color: '#E8F5ED', marginBottom: '32px' }}>28 days to establish your forecasting identity.</p>
        {!submitted ? (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '14px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0D2B14', color: 'white', fontSize: '16px', width: '260px' }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: '14px 28px', backgroundColor: '#0D1F0F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Get Early Access →'}
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>✅ You're in. See you on June 11. ⚽</div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '8px' }}>
          © 2026 Flipseer · flipseer.com · No betting. No gambling. Pure football reputation.
        </p>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Contact: <a href="mailto:contact@flipseer.com" style={{ color: '#2E9E5E', textDecoration: 'none' }}>contact@flipseer.com</a>
        </p>
      </footer>

    </main>
  );
}
