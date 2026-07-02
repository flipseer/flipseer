'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const EPL_CLUBS = [
  { name: 'Arsenal', color: '#EF0107', flag: '🔴' },
  { name: 'Aston Villa', color: '#95BFE5', flag: '🔵' },
  { name: 'Chelsea', color: '#034694', flag: '🔵' },
  { name: 'Liverpool', color: '#C8102E', flag: '🔴' },
  { name: 'Man City', color: '#6CABDD', flag: '🔵' },
  { name: 'Man United', color: '#DA291C', flag: '🔴' },
  { name: 'Newcastle', color: '#241F20', flag: '⚫' },
  { name: 'Spurs', color: '#132257', flag: '⚪' },
  { name: 'Brighton', color: '#0057B8', flag: '🔵' },
  { name: 'West Ham', color: '#7A263A', flag: '🔴' },
];

export default function EPLPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [daysUntilEPL, setDaysUntilEPL] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Days until EPL start — August 16, 2026
    const eplStart = new Date('2026-08-16T12:00:00Z');
    const diff = Math.ceil((eplStart.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysUntilEPL(Math.max(0, diff));

    // Tick every second for live countdown
    const tickInterval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(tickInterval);

    // Fetch waitlist count
    const fetchCount = async () => {
      const { count } = await supabase
        .from('epl_waitlist')
        .select('*', { count: 'exact', head: true });
      setWaitlistCount(count || 0);
    };
    fetchCount();
  }, []);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('epl_waitlist')
        .insert({ email: email.toLowerCase().trim(), created_at: new Date().toISOString() });

      if (dbError && dbError.code !== '23505') { // ignore duplicate
        setError('Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
        setWaitlistCount(prev => prev + 1);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(46,158,94,0.2)}50%{box-shadow:0 0 40px rgba(46,158,94,0.5)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .countdown-box{animation:glow 2s ease infinite}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .club-pill:hover{border-color:#38a169!important;transform:translateY(-1px)}
        .club-pill{transition:all 0.15s}
      `}</style>

      {/* Club ticker */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', overflow: 'hidden', padding: '8px 0' }} aria-hidden="true">
        <div style={{ display: 'flex', gap: '8px', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...EPL_CLUBS, ...EPL_CLUBS].map((club, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 12px', borderRadius: 999,
              border: `1px solid ${club.color}30`,
              backgroundColor: `${club.color}10`,
              fontSize: 12, color: '#9CA3AF', flexShrink: 0,
            }}>
              {club.flag} {club.name}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)',
        borderBottom: '1px solid #1A3A1A',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '100%',
          background: 'radial-gradient(ellipse, rgba(56,161,105,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Coming soon badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backgroundColor: 'rgba(56,161,105,0.1)', border: '1px solid #2E9E5E',
          borderRadius: 999, padding: '6px 20px', marginBottom: 24,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
          <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, letterSpacing: '2px' }}>
            COMING AUGUST 16, 2026
          </span>
        </div>

        {/* EPL badge */}
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>

        <h1 style={{
          fontSize: 'clamp(32px,8vw,64px)',
          fontWeight: 900, letterSpacing: '-2px',
          lineHeight: 1.05, marginBottom: 16,
        }}>
          Premier League<br/>
          <span style={{ color: '#2E9E5E' }}>Reputation</span> is Coming.
        </h1>

        <p style={{
          fontSize: 'clamp(15px,2.5vw,18px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 540, margin: '0 auto 32px',
        }}>
          Your World Cup record doesn't stop at the final whistle.
          EPL 2026/27 predictions begin August 16.
          One permanent record. Every competition. Forever.
        </p>

        {/* Animated countdown */}
        {mounted && daysUntilEPL > 0 && (
          <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
            {/* Main countdown display */}
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8, marginBottom: 12,
            }}>
              {(() => {
                const eplStart = new Date('2026-08-16T12:00:00Z');
                const diff = eplStart.getTime() - Date.now();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                return [
                  { v: days, l: 'DAYS' },
                  { v: hours, l: 'HRS' },
                  { v: mins, l: 'MIN' },
                  { v: secs, l: 'SEC' },
                ].map(({ v, l }) => (
                  <div key={l} style={{
                    backgroundColor: '#0D2B14',
                    border: '1px solid #1A7A4A',
                    borderRadius: 12, padding: '14px 16px',
                    textAlign: 'center', minWidth: 64,
                  }}>
                    <div style={{
                      fontSize: 'clamp(28px,7vw,48px)',
                      fontWeight: 900, color: '#F59E0B',
                      letterSpacing: '-1px', lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {String(v).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 9, color: '#8895A3', letterSpacing: '2px', marginTop: 4 }}>{l}</div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ fontSize: 13, color: '#2E9E5E', fontWeight: 700 }}>
              ⚽ Premier League 2026/27 · August 16, 2026
            </div>
          </div>
        )}

        {/* Animated pitch visual */}
        {mounted && (
          <div style={{
            maxWidth: 480, margin: '0 auto 28px',
            backgroundColor: '#071408',
            border: '1px solid #1A7A4A',
            borderRadius: 16, padding: '20px',
            position: 'relative', overflow: 'hidden',
            animation: 'fadeUp 0.5s ease 0.2s both',
          }}>
            {/* Football pitch SVG */}
            <svg viewBox="0 0 400 200" style={{ width: '100%', opacity: 0.6 }}>
              {/* Pitch background */}
              <rect width="400" height="200" fill="#0a1f0a" rx="8"/>
              {/* Pitch lines */}
              <rect x="2" y="2" width="396" height="196" fill="none" stroke="#1A7A4A" strokeWidth="2" rx="6"/>
              {/* Center circle */}
              <circle cx="200" cy="100" r="40" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <circle cx="200" cy="100" r="3" fill="#2E9E5E"/>
              {/* Center line */}
              <line x1="200" y1="2" x2="200" y2="198" stroke="#1A7A4A" strokeWidth="1.5"/>
              {/* Left penalty box */}
              <rect x="2" y="55" width="70" height="90" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="2" y="75" width="25" height="50" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              {/* Right penalty box */}
              <rect x="328" y="55" width="70" height="90" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="373" y="75" width="25" height="50" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              {/* Corner arcs */}
              <path d="M2,18 Q18,2 18,2" fill="none" stroke="#1A7A4A" strokeWidth="1"/>
              <path d="M382,2 Q398,2 398,18" fill="none" stroke="#1A7A4A" strokeWidth="1"/>
              <path d="M2,182 Q2,198 18,198" fill="none" stroke="#1A7A4A" strokeWidth="1"/>
              <path d="M398,182 Q398,198 382,198" fill="none" stroke="#1A7A4A" strokeWidth="1"/>
            </svg>

            {/* Overlay text on pitch */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 6,
            }}>
              <div style={{ fontSize: 'clamp(32px,8vw,48px)', animation: 'float 3s ease infinite' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
              <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
                PREMIER LEAGUE
              </div>
              <div style={{ fontSize: 12, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px' }}>
                2026 / 27 SEASON
              </div>
              <div style={{
                backgroundColor: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: 999, padding: '4px 14px',
                fontSize: 11, color: '#F59E0B', fontWeight: 700,
                letterSpacing: '1px', marginTop: 4,
              }}>
                380 MATCHES · FREE · PERMANENT
              </div>
            </div>
          </div>
        )}

        {/* Waitlist form */}
        {!submitted ? (
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 13, color: '#8895A3', marginBottom: 12 }}>
              Join the waitlist — get notified on August 16 and earn the
              <strong style={{ color: '#F59E0B' }}> EPL Founding Forecaster</strong> badge.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                style={{
                  flex: 1, minWidth: 200,
                  backgroundColor: '#0D2B14', border: '1px solid #1A7A4A',
                  borderRadius: 10, padding: '13px 16px',
                  color: 'white', fontSize: 14,
                  outline: 'none',
                }}
              />
              <button onClick={handleSubmit} disabled={loading} style={{
                backgroundColor: '#2E9E5E', color: 'white',
                border: 'none', borderRadius: 10,
                padding: '13px 24px', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 24px rgba(46,158,94,0.3)',
              }}>
                {loading ? 'Joining...' : 'Notify Me →'}
              </button>
            </div>
            {error && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>{error}</p>}
            {waitlistCount > 0 && (
              <p style={{ fontSize: 12, color: '#4B5563', marginTop: 10 }}>
                🔥 <strong style={{ color: '#F59E0B' }}>{waitlistCount}</strong> forecasters already on the waitlist
              </p>
            )}
            <p style={{ fontSize: 11, color: '#4B5563', marginTop: 8 }}>
              Free forever · No betting · No card required
            </p>
          </div>
        ) : (
          <div style={{
            maxWidth: 420, margin: '0 auto',
            backgroundColor: '#0D2B14', border: '1px solid #2E9E5E',
            borderRadius: 14, padding: '24px',
            animation: 'fadeUp 0.3s ease',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>You're on the list!</h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>
              We'll email you on August 16 when EPL predictions open.
              Your <strong style={{ color: '#F59E0B' }}>EPL Founding Forecaster</strong> badge
              will be waiting.
            </p>
            <a href="/predict" style={{
              display: 'inline-block', marginTop: 16,
              backgroundColor: '#1A7A4A', color: 'white',
              padding: '10px 24px', borderRadius: 8,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
            }}>
              Predict World Cup now →
            </a>
          </div>
        )}
      </section>

      {/* What's coming */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>
            WHAT'S COMING
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '⚽', title: '380 EPL Matches', desc: 'Every Premier League match, every gameweek. Predict before kickoff — locked forever.' },
              { icon: '🌍', title: 'Nation Battle Continues', desc: 'Points from EPL add to your World Cup total. One reputation. Every competition.' },
              { icon: '🏅', title: 'EPL Founding Forecaster', desc: 'Predict in the first EPL gameweek. Badge awarded permanently. Never available again.' },
              { icon: '📖', title: 'Journal Grows', desc: 'World Cup + EPL predictions in one permanent timeline. Your full football record.' },
              { icon: '🏆', title: 'Club Leaderboards', desc: 'Best Arsenal predictor. Best Liverpool predictor. New rankings for the new season.' },
              { icon: '🔒', title: 'Same Rules', desc: 'Locked before kickoff. No edits. No deletions. Permanent record. Free forever.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 12, padding: '18px 16px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPL Founding Forecaster CTA */}
      <section style={{ padding: '56px 20px', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏅</div>
          <h2 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
            EPL Founding Forecaster
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            Available only during the first EPL gameweek — August 16–24, 2026.
            Never available again. No points. No referral. Pure legacy.
          </p>
          <div style={{
            backgroundColor: '#0D2B14', border: '1px solid #F59E0B',
            borderRadius: 14, padding: '20px 24px', marginBottom: 24,
            display: 'inline-block',
          }}>
            <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, letterSpacing: '2px', marginBottom: 8 }}>
              BADGE DETAILS
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.8, textAlign: 'left' }}>
              ✓ Predict at least 1 EPL match before Aug 24<br/>
              ✓ Badge awarded permanently to your profile<br/>
              ✓ Visible on your public journal forever<br/>
              ✓ Combined with World Cup Founding Forecaster = legend status
            </div>
          </div>

          {/* Already have WC predictions CTA */}
          <div style={{ marginBottom: 20 }}>
            <a href="/predict" style={{
              display: 'inline-block',
              backgroundColor: '#2E9E5E', color: 'white',
              padding: '14px 32px', borderRadius: 10,
              textDecoration: 'none', fontSize: 15, fontWeight: 700,
              boxShadow: '0 0 24px rgba(46,158,94,0.3)',
              marginBottom: 10,
            }}>
              ⚽ Predict World Cup Now →
            </a>
            <p style={{ fontSize: 12, color: '#4B5563', marginTop: 8 }}>
              World Cup predictions build your reputation until EPL starts
            </p>
          </div>
        </div>
      </section>

      {/* Points carry-over */}
      <section style={{ padding: '56px 20px', borderTop: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            ONE RECORD. EVERY COMPETITION.
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>
            Your points never reset.
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, flexWrap: 'wrap', marginBottom: 24,
            fontSize: 'clamp(13px,2.5vw,15px)', color: '#9CA3AF',
          }}>
            <span style={{ color: '#2E9E5E', fontWeight: 700 }}>World Cup 2026</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#8B5CF6', fontWeight: 700 }}>EPL 2026/27</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>Champions League</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#EF4444', fontWeight: 700 }}>La Liga</span>
          </div>
          <p style={{ color: '#4B5563', fontSize: 13 }}>
            = Your permanent football reputation. Growing forever.
          </p>
        </div>
      </section>

    </main>
  );
}
