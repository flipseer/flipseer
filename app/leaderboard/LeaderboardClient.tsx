'use client';
// LeaderboardClient — receives SSR data as prop, handles interactive filtering
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

type Leader = {
  id: string;
  username: string;
  total_points: number;
  prediction_count: number;
  correct_count: number;
  accuracy_pct: number;
  rank: string;
  rank_icon: string;
  country: string;
  streak?: number;
  best_streak?: number;
  currentRank?: number;
  movement?: 'rising' | 'falling' | 'same' | 'new';
  movementAmount?: number;
  exactScoreCount?: number;
};

const FLAG: { [key: string]: string } = {
  'IN': '&#x1F1EE;&#x1F1F3;', 'ID': '&#x1F1EE;&#x1F1E9;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'GB': '&#x1F3F4;',
  'FR': '&#x1F1EB;&#x1F1F7;', 'DE': '&#x1F1E9;&#x1F1EA;',
  'ES': '&#x1F1EA;&#x1F1F8;', 'PT': '&#x1F1F5;&#x1F1F9;',
  'MX': '&#x1F1F2;&#x1F1FD;', 'US': '&#x1F1FA;&#x1F1F8;',
  'GH': '&#x1F1EC;&#x1F1ED;', 'MA': '&#x1F1F2;&#x1F1E6;',
  'JP': '&#x1F1EF;&#x1F1F5;', 'KR': '&#x1F1F0;&#x1F1F7;',
  'AU': '&#x1F1E6;&#x1F1FA;', 'PK': '&#x1F1F5;&#x1F1F0;',
  'BD': '&#x1F1E7;&#x1F1E9;', 'SA': '&#x1F1F8;&#x1F1E6;',
  'TR': '&#x1F1F9;&#x1F1F7;', 'EG': '&#x1F1EA;&#x1F1EC;',
  'SN': '&#x1F1F8;&#x1F1F3;', 'ZA': '&#x1F1FF;&#x1F1E6;',
  'NO': '&#x1F1F3;&#x1F1F4;', 'SE': '&#x1F1F8;&#x1F1EA;',
  'HR': '&#x1F1ED;&#x1F1F7;', 'CO': '&#x1F1E8;&#x1F1F4;',
};

const FILTERS = [
  { code: '', label: 'Global' },
  { code: 'IN', label: 'India' },
  { code: 'ID', label: 'Indonesia' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'BR', label: 'Brazil' },
  { code: 'AR', label: 'Argentina' },
  { code: 'GB', label: 'England' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'PT', label: 'Portugal' },
  { code: 'MX', label: 'Mexico' },
  { code: 'US', label: 'USA' },
  { code: 'GH', label: 'Ghana' },
  { code: 'MA', label: 'Morocco' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'S.Korea' },
  { code: 'PK', label: 'Pakistan' },
  { code: 'BD', label: 'Bangladesh' },
  { code: 'TR', label: 'Turkey' },
];

const RANK_COLORS: { [key: number]: { border: string; bg: string; glow: string } } = {
  0: { border: '#F59E0B', bg: 'rgba(245,158,11,0.06)', glow: '0 0 24px rgba(245,158,11,0.15)' },
  1: { border: '#9CA3AF', bg: 'rgba(156,163,175,0.06)', glow: '0 0 24px rgba(156,163,175,0.1)' },
  2: { border: '#CD7F32', bg: 'rgba(205,127,50,0.06)', glow: '0 0 24px rgba(205,127,50,0.1)' },
};

export default function LeaderboardClient({ initialLeaders = [] }: { initialLeaders?: any[] }) {
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders as Leader[]);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState('');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<Leader | null>(null);
  const [totalForecasters, setTotalForecasters] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [highlights, setHighlights] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    loadUserContext();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeCountry]);

  const loadUserContext = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, total_points, prediction_count, correct_count, accuracy_pct, rank, rank_icon, country')
      .eq('id', session.user.id)
      .single();
    if (profile) setUserEntry(profile as Leader);
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = activeCountry ? `/api/leaderboard-alive?country=${activeCountry}` : `/api/leaderboard-alive`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && !data.error) {
        setLeaders(data.leaders || []);
        setHighlights(data.highlights || null);
        setTotalForecasters((data.leaders || []).length);
        if (userEntry) {
          const idx = (data.leaders || []).findIndex((l: Leader) => l.id === userEntry.id);
          setUserRank(idx >= 0 ? idx + 1 : null);
        }
      }
    } catch (err) {
      console.error('Leaderboard error:', err);
    }
    setLoading(false);
  };

  const maxPoints = leaders[0]?.total_points || 1;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0D1F0F', color: 'white', fontFamily: 'Arial, sans-serif', paddingBottom: '80px' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200px 0}100%{background-position:200px 0} }
        .lb-row { transition: transform 0.15s ease, border-color 0.15s ease; }
        .lb-row:hover { transform: translateX(4px); }
        .filter-btn { transition: all 0.15s ease; }
        .filter-btn:hover { border-color: #2E9E5E !important; color: white !important; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(180deg, #071408 0%, #0D1F0F 100%)', padding: '48px 20px 32px', borderBottom: '1px solid #1A3A1A', textAlign: 'center' }}>

        {/* Live badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '5px 16px', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 · LIVE RANKINGS</span>
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 7vw, 56px)', letterSpacing: '-1px', marginBottom: '8px', lineHeight: '1' }}>
          WHO LEADS THE<br />
          <span style={{ color: '#2E9E5E' }}>GLOBAL FORECAST?</span>
        </h1>
        <p style={{ color: '#4B5563', fontSize: '14px', marginTop: '12px' }}>
          Ranked by points earned predicting World Cup 2026 matches
        </p>

        {/* Stats row */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[
              { value: leaders.length, label: 'Forecasters' },
              { value: leaders[0]?.total_points || 0, label: 'Top Score' },
              { value: leaders[0]?.accuracy_pct || 0, label: 'Top Accuracy %' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px', letterSpacing: '1px' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Today's highlights — makes the leaderboard feel alive */}
        {!loading && highlights && (highlights.biggestClimber || highlights.longestStreak || highlights.exactScoreKing) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            {highlights.biggestClimber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A', borderRadius: 999, padding: '6px 14px' }}>
                <span style={{ fontSize: 13 }}>🚀</span>
                <span style={{ fontSize: 12, color: '#2E9E5E', fontWeight: 700 }}>@{highlights.biggestClimber.username}</span>
                <span style={{ fontSize: 11, color: '#6B7280' }}>+{highlights.biggestClimber.amount} today</span>
              </div>
            )}
            {highlights.longestStreak && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 999, padding: '6px 14px' }}>
                <span style={{ fontSize: 13 }}>🔥</span>
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>@{highlights.longestStreak.username}</span>
                <span style={{ fontSize: 11, color: '#6B7280' }}>{highlights.longestStreak.streak} streak</span>
              </div>
            )}
            {highlights.exactScoreKing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 999, padding: '6px 14px' }}>
                <span style={{ fontSize: 13 }}>🎯</span>
                <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700 }}>@{highlights.exactScoreKing.username}</span>
                <span style={{ fontSize: 11, color: '#6B7280' }}>{highlights.exactScoreKing.count} exact</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 16px 0' }}>

        {/* ── YOUR RANK CARD (if logged in) ── */}
        {userEntry && userRank && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 0 24px rgba(46,158,94,0.1)', animation: 'slideUp 0.4s ease' }}>
            <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', minWidth: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontFamily: 'Georgia, serif', color: '#F59E0B' }}>#{userRank}</div>
              <div>YOUR RANK</div>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1A3A1A' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', marginBottom: '3px' }}>@{userEntry.username}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                {userEntry.prediction_count} predictions &#xB7; {userEntry.accuracy_pct}% accuracy
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{userEntry.total_points}</div>
              <div style={{ fontSize: '10px', color: '#4B5563' }}>POINTS</div>
            </div>
          </div>
        )}

        {/* ── FILTER TABS ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>FILTER BY NATION</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => {
              const active = activeCountry === f.code;
              const flag = f.code ? FLAG[f.code] : null;
              return (
                <button key={f.code} onClick={() => setActiveCountry(f.code)}
                  className="filter-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '6px 14px', borderRadius: '999px',
                    border: '1px solid ' + (active ? '#2E9E5E' : '#1A3A1A'),
                    backgroundColor: active ? '#1A7A4A' : 'transparent',
                    color: active ? 'white' : '#6B7280',
                    fontSize: '12px', fontWeight: active ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}>
                  {flag && <span dangerouslySetInnerHTML={{ __html: flag }} />}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── LEADERBOARD ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: '72px', borderRadius: '12px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x1F3AF;</div>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '20px', fontFamily: 'Georgia, serif' }}>
              No forecasters here yet.
            </p>
            <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              Be the first &#x2192;
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaders.map((leader, i) => {
              const style = RANK_COLORS[i] || { border: '#1A3A1A', bg: '#0D2B14', glow: 'none' };
              const isUser = userEntry?.id === leader.id;
              const barWidth = Math.max(3, Math.round((leader.total_points / maxPoints) * 100));
              const flag = FLAG[leader.country] || '';
              const isTop3 = i < 3;

              return (
                <div key={leader.id} className="lb-row"
                  style={{ backgroundColor: style.bg, border: '1px solid ' + (isUser ? '#2E9E5E' : style.border), borderRadius: '14px', padding: '16px 20px', boxShadow: isUser ? '0 0 20px rgba(46,158,94,0.15)' : style.glow, animation: `slideUp 0.3s ease ${i * 0.04}s both` }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

                    {/* Rank */}
                    <div style={{ minWidth: '44px', textAlign: 'center', flexShrink: 0 }}>
                      {i === 0 && <div style={{ fontSize: '28px' }}>&#x1F947;</div>}
                      {i === 1 && <div style={{ fontSize: '28px' }}>&#x1F948;</div>}
                      {i === 2 && <div style={{ fontSize: '28px' }}>&#x1F949;</div>}
                      {i >= 3 && (
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4B5563', fontFamily: 'Georgia, serif' }}>
                          #{i + 1}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        {flag && <span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: flag }} />}
                        <a href={`/u/${leader.username}`} style={{ fontSize: '15px', fontWeight: 'bold', color: isUser ? '#2E9E5E' : 'white', textDecoration: 'none', letterSpacing: '-0.2px' }}>
                          @{leader.username}
                        </a>
                        {isUser && (
                          <span style={{ fontSize: '9px', color: '#2E9E5E', backgroundColor: 'rgba(46,158,94,0.15)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold', letterSpacing: '1px' }}>YOU</span>
                        )}
                        {i === 0 && (
                          <span style={{ fontSize: '9px', color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold', letterSpacing: '1px' }}>LEADER</span>
                        )}
                        {leader.movement === 'rising' && (
                          <span style={{ fontSize: '9px', color: '#2E9E5E', backgroundColor: 'rgba(46,158,94,0.15)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>🔥 +{leader.movementAmount}</span>
                        )}
                        {leader.movement === 'falling' && (
                          <span style={{ fontSize: '9px', color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>↓ {leader.movementAmount}</span>
                        )}
                        {leader.movement === 'new' && (
                          <span style={{ fontSize: '9px', color: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.15)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>⭐ NEW</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4B5563' }}>
                        {leader.prediction_count} predictions &#xB7; {leader.correct_count} correct &#xB7; {leader.accuracy_pct}% accuracy
                      </div>

                      {/* Points bar */}
                      <div style={{ marginTop: '8px', backgroundColor: '#0D1F0F', borderRadius: '999px', height: '3px', overflow: 'hidden' }}>
                        <div style={{ width: barWidth + '%', height: '100%', borderRadius: '999px', backgroundColor: i === 0 ? '#F59E0B' : isUser ? '#2E9E5E' : '#1A7A4A', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 'bold', color: i === 0 ? '#F59E0B' : '#2E9E5E', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>
                        {leader.total_points}
                      </div>
                      <div style={{ fontSize: '10px', color: '#4B5563', letterSpacing: '1px' }}>PTS</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        {!loading && leaders.length > 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center', padding: '32px 24px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '16px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '8px' }}>
              Every prediction moves you up.
            </div>
            <p style={{ color: '#4B5563', fontSize: '13px', marginBottom: '20px' }}>
              Predict matches before kickoff. Points lock forever.
            </p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '13px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.2px' }}>
              &#x26BD; Predict Now &#x2192;
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
