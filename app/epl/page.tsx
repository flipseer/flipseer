'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const MATCHWEEK1 = [
  { home: 'Arsenal', away: 'Coventry City', date: 'Fri 21 Aug', time: '20:00 BST', slug: 'arsenal-vs-coventry-city' },
  { home: 'Hull City', away: 'Manchester United', date: 'Sat 22 Aug', time: '12:30 BST', slug: 'hull-city-vs-manchester-united' },
  { home: 'Brentford', away: 'Tottenham Hotspur', date: 'Sat 22 Aug', time: '17:30 BST', slug: 'brentford-vs-tottenham-hotspur' },
  { home: 'Brighton', away: 'Aston Villa', date: 'Sun 23 Aug', time: '14:00 BST', slug: 'brighton-vs-aston-villa' },
  { home: 'Manchester City', away: 'Bournemouth', date: 'Sun 23 Aug', time: '14:00 BST', slug: 'manchester-city-vs-bournemouth' },
  { home: 'Newcastle United', away: 'Liverpool', date: 'Sun 23 Aug', time: '16:30 BST', slug: 'newcastle-united-vs-liverpool' },
  { home: 'Fulham', away: 'Chelsea', date: 'Mon 24 Aug', time: '20:00 BST', slug: 'fulham-vs-chelsea' },
];

export default function EPLPage() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick(t => t + 1), 1000);

    // Fetch user rank if logged in
    const fetchRank = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, total_points')
          .eq('id', session.user.id)
          .single();
        if (!profile) return;
        setUsername(profile.username);
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('total_points')
          .gt('total_points', 0)
          .order('total_points', { ascending: false });
        const rank = (allProfiles || []).findIndex(
          (p: any) => p.total_points <= profile.total_points
        ) + 1;
        if (rank > 0) setUserRank(rank);
      } catch {}
    };
    fetchRank();
    return () => clearInterval(interval);
  }, []);

  const getCountdown = () => {
    const eplStart = new Date('2026-08-21T19:00:00Z');
    const diff = eplStart.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, mins, secs };
  };

  const countdown = mounted ? getCountdown() : null;

  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .match-row:hover{background:rgba(139,92,246,0.08)!important}
        .match-row{transition:background 0.1s}
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)',
        borderBottom: '1px solid #1A3A1A',
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '100%',
          background: 'radial-gradient(ellipse,rgba(139,92,246,0.07) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: 999, padding: '6px 20px', marginBottom: 24,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
          <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px' }}>
            PREMIER LEAGUE 2026/27 · STARTS AUGUST 21
          </span>
        </div>

        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>

        <h1 style={{
          fontSize: 'clamp(32px,8vw,64px)',
          fontWeight: 900, letterSpacing: '-2px',
          lineHeight: 1.05, marginBottom: 16,
        }}>
          Premier League<br/>
          <span style={{ color: '#8B5CF6' }}>Reputation</span> is Here.
        </h1>

        <p style={{
          fontSize: 'clamp(15px,2.5vw,18px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 540, margin: '0 auto 32px',
        }}>
          {userRank && username ? (
            <>Your World Cup <strong style={{ color: '#F59E0B' }}>#{userRank} global ranking</strong> carries forward. EPL 2026/27 predictions begin August 21. One permanent record. Every competition. Forever.</>
          ) : (
            <>Your football reputation doesn't stop at the World Cup final whistle. EPL 2026/27 predictions begin August 21. One permanent record. Every competition. Forever.</>
          )}
        </p>

        {/* Countdown */}
        {mounted && countdown && (
          <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
              {[
                { v: countdown.days, l: 'DAYS' },
                { v: countdown.hours, l: 'HRS' },
                { v: countdown.mins, l: 'MIN' },
                { v: countdown.secs, l: 'SEC' },
              ].map(({ v, l }) => (
                <div key={l} style={{
                  backgroundColor: '#0D2B14', border: '1px solid rgba(139,92,246,0.4)',
                  borderRadius: 12, padding: '14px 16px', textAlign: 'center', minWidth: 64,
                }}>
                  <div style={{
                    fontSize: 'clamp(28px,7vw,48px)', fontWeight: 900,
                    color: '#8B5CF6', letterSpacing: '-1px', lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {String(v).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 9, color: '#8895A3', letterSpacing: '2px', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 700 }}>
              ⚽ Arsenal vs Coventry City · Friday 21 August · 20:00 BST
            </div>
          </div>
        )}

        {/* Animated pitch */}
        {mounted && (
          <div style={{
            maxWidth: 480, margin: '0 auto 28px',
            backgroundColor: '#071408', border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden',
          }}>
            <svg viewBox="0 0 400 200" style={{ width: '100%', opacity: 0.5 }}>
              <rect width="400" height="200" fill="#0a1f0a" rx="8"/>
              <rect x="2" y="2" width="396" height="196" fill="none" stroke="#1A7A4A" strokeWidth="2" rx="6"/>
              <circle cx="200" cy="100" r="40" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <circle cx="200" cy="100" r="3" fill="#2E9E5E"/>
              <line x1="200" y1="2" x2="200" y2="198" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="2" y="55" width="70" height="90" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="2" y="75" width="25" height="50" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="328" y="55" width="70" height="90" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
              <rect x="373" y="75" width="25" height="50" fill="none" stroke="#1A7A4A" strokeWidth="1.5"/>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 'clamp(32px,8vw,48px)', animation: 'float 3s ease infinite' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
              <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
                PREMIER LEAGUE
              </div>
              <div style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px' }}>
                2026 / 27 SEASON
              </div>
              <div style={{
                backgroundColor: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: 999, padding: '4px 14px',
                fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '1px', marginTop: 4,
              }}>
                380 MATCHES · FREE · PERMANENT
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/epl/matchweek-1" style={{
            backgroundColor: '#8B5CF6', color: 'white',
            border: 'none', borderRadius: 12,
            padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)',
            fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 0 32px rgba(139,92,246,0.35)',
          }}>
            View Matchweek 1 Fixtures →
          </a>
          <a href="/leaderboard" style={{
            backgroundColor: 'transparent', color: '#9CA3AF',
            padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)',
            borderRadius: 12, textDecoration: 'none',
            fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A',
          }}>
            🏆 Leaderboard →
          </a>
        </div>

        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>
          Free forever · No betting · No card required
        </p>
      </section>

      {/* ── MATCHWEEK 1 PREVIEW ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px' }}>
              MATCHWEEK 1 — AUG 21-24
            </p>
            <a href="/epl/matchweek-1" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </a>
          </div>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, overflow: 'hidden' }}>
            {MATCHWEEK1.map((match, i) => (
              <a key={match.slug} href={`/matches/${match.slug}`} className="match-row" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 18px', textDecoration: 'none',
                borderTop: i === 0 ? 'none' : '1px solid #1A3A1A',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                    {match.home} <span style={{ color: '#4B5563', fontWeight: 400 }}>vs</span> {match.away}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{match.date} · {match.time}</div>
                </div>
                <div style={{
                  fontSize: 11, color: '#8B5CF6', fontWeight: 700,
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  padding: '4px 10px', borderRadius: 999, flexShrink: 0,
                }}>
                  Predict →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S COMING ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>
            WHAT'S COMING
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '⚽', title: '380 EPL Matches', desc: 'Every Premier League match, every gameweek. Predict before kickoff — locked forever.' },
              { icon: '🌍', title: 'Nation Battle Continues', desc: 'EPL points add to your World Cup total. One reputation. Every competition.' },
              { icon: '🏅', title: 'EPL Founding Forecaster', desc: 'Predict in Gameweek 1 (Aug 21-24). Badge awarded permanently. Never available again.' },
              { icon: '📖', title: 'Journal Grows', desc: 'World Cup + EPL predictions in one permanent timeline. Your full football record.' },
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

      {/* ── FOUNDING FORECASTER ── */}
      <section style={{ padding: '48px 20px', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏅</div>
          <h2 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
            EPL Founding Forecaster
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            Available only during Gameweek 1 — August 21–24, 2026.
            Never available again. No points. No referral. Pure legacy.
          </p>
          <div style={{
            backgroundColor: '#0D2B14', border: '1px solid #8B5CF6',
            borderRadius: 14, padding: '20px 24px', marginBottom: 24,
            display: 'inline-block', textAlign: 'left',
          }}>
            <div style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px', marginBottom: 8 }}>
              BADGE DETAILS
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.8 }}>
              ✓ Predict at least 1 EPL match in Gameweek 1<br/>
              ✓ Badge awarded permanently to your profile<br/>
              ✓ Visible on your public journal forever<br/>
              ✓ Combined with World Cup Founding Forecaster = legend status
            </div>
          </div>
          <div>
            <a href="/epl/matchweek-1" style={{
              display: 'inline-block',
              backgroundColor: '#8B5CF6', color: 'white',
              padding: '14px 32px', borderRadius: 10,
              textDecoration: 'none', fontSize: 15, fontWeight: 700,
              boxShadow: '0 0 24px rgba(139,92,246,0.3)',
            }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 View Matchweek 1 Fixtures →
            </a>
            <p style={{ fontSize: 12, color: '#4B5563', marginTop: 10 }}>
              Free forever · No betting · No card required
            </p>
          </div>
        </div>
      </section>

      {/* ── ONE RECORD ── */}
      <section style={{ padding: '48px 20px', borderTop: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            ONE RECORD. EVERY COMPETITION.
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>
            Your points never reset.
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, flexWrap: 'wrap', marginBottom: 20,
            fontSize: 'clamp(13px,2.5vw,15px)', color: '#9CA3AF',
          }}>
            <span style={{ color: '#2E9E5E', fontWeight: 700 }}>World Cup 2026</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#8B5CF6', fontWeight: 700 }}>EPL 2026/27</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>Champions League</span>
          </div>
          <p style={{ color: '#4B5563', fontSize: 13, marginBottom: 20 }}>
            = Your permanent football reputation. Growing forever.
          </p>
          <a href="/football-reputation" style={{
            fontSize: 13, color: '#8B5CF6', textDecoration: 'none', fontWeight: 600,
          }}>
            What is Football Reputation? →
          </a>
        </div>
      </section>

    </main>
  );
}
