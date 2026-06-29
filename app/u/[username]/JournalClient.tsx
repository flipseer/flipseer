'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','ZA':'🇿🇦','NO':'🇳🇴','SN':'🇸🇳',
};

function outcomeState(pred: any): 'correct' | 'wrong' | 'pending' {
  if (!pred.prediction_processed) return 'pending';
  return pred.points_earned > 0 ? 'correct' : 'wrong';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateKey(dateStr: string): string {
  const d = new Date(dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z');
  return d.toISOString().split('T')[0];
}

function groupByDate(predictions: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  predictions.forEach(pred => {
    const key = formatDateKey(pred.matches?.kickoff || pred.created_at);
    if (!groups[key]) groups[key] = [];
    groups[key].push(pred);
  });
  return groups;
}

function pickLabel(pred: any): string {
  const m = pred.matches;
  if (pred.predicted_outcome === 'home') return (m?.home_team || 'Home') + ' Win';
  if (pred.predicted_outcome === 'away') return (m?.away_team || 'Away') + ' Win';
  return 'Draw';
}

function scoreDisplay(pred: any): string {
  if (pred.predicted_home_score !== null && pred.predicted_away_score !== null) {
    return `${pred.predicted_home_score}–${pred.predicted_away_score}`;
  }
  return '';
}

function actualScore(pred: any): string {
  const m = pred.matches;
  if (m?.home_score !== null && m?.away_score !== null && m?.status === 'completed') {
    return `${m.home_score}–${m.away_score}`;
  }
  return '';
}

type JournalProps = {
  username: string;
  profile: any;
  predictions: any[];
};

export default function JournalClient({ username, profile, predictions }: JournalProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'pending'>('all');
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if current user owns this journal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id === profile.id) setIsOwner(true);
    });
  }, [profile.id]);

  const filtered = predictions.filter(p => filter === 'all' || outcomeState(p) === filter);
  const grouped = groupByDate(filtered);
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const correctCount = predictions.filter(p => outcomeState(p) === 'correct').length;
  const wrongCount = predictions.filter(p => outcomeState(p) === 'wrong').length;
  const pendingCount = predictions.filter(p => outcomeState(p) === 'pending').length;
  const processedCount = correctCount + wrongCount;
  const accuracy = processedCount > 0 ? Math.round((correctCount / processedCount) * 100) : 0;
  const exactScores = predictions.filter(p => p.exact_bonus > 0).length;

  const share = () => {
    const url = `https://flipseer.com/u/${username}`;
    if (navigator.share) {
      navigator.share({ title: `@${username}'s Forecast Journal`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .pred-card:hover{border-color:#2E9E5E!important}
        .pred-card{transition:border-color 0.15s}
        .filter-btn:hover{background:rgba(46,158,94,0.1)!important}
      `}</style>

      {/* ── PROFILE HEADER ── */}
      <div style={{
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        padding: 'clamp(40px,8vw,64px) 20px clamp(32px,6vw,48px)',
        borderBottom: '1px solid #1A3A1A',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Avatar */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: '#1A7A4A', border: '2px solid #2E9E5E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, flexShrink: 0,
              }}>
                {username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    @{username}
                  </h1>
                  {profile?.country && (
                    <span style={{ fontSize: 22 }}>{FLAG[profile.country] || '🌍'}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, color: '#2E9E5E', fontWeight: 700,
                    backgroundColor: 'rgba(46,158,94,0.1)', padding: '2px 10px',
                    borderRadius: 999, letterSpacing: '1px',
                  }}>
                    {profile?.rank_icon} {profile?.rank}
                  </span>
                  {profile?.rank && (
                    <span style={{ fontSize: 12, color: '#4B5563' }}>
                      Global #{profile.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share button */}
            <button onClick={share} style={{
              backgroundColor: copied ? '#1A7A4A' : 'transparent',
              color: copied ? 'white' : '#6B7280',
              border: '1px solid #1A3A1A',
              padding: '8px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {copied ? '✓ Copied' : '↗ Share'}
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 10 }}>
            {[
              { v: profile?.total_points || 0, l: 'Total Points', c: '#F59E0B' },
              { v: `${accuracy}%`, l: 'Accuracy', c: '#2E9E5E' },
              { v: predictions.length, l: 'Predictions', c: '#9CA3AF' },
              { v: correctCount, l: 'Correct', c: '#2E9E5E' },
              { v: exactScores, l: 'Exact Scores', c: '#F59E0B' },
              { v: profile?.best_streak || 0, l: 'Best Streak', c: '#8B5CF6' },
            ].map(({ v, l, c }) => (
              <div key={l} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '14px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: c, letterSpacing: '-0.5px', marginBottom: 3 }}>
                  {v}
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.5px' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Permanence statement */}
          <div style={{
            marginTop: 16, padding: '12px 16px',
            backgroundColor: 'rgba(46,158,94,0.06)', border: '1px solid #1A3A1A',
            borderRadius: 8, fontSize: 13, color: '#4B5563', lineHeight: 1.6,
          }}>
            📖 This is <strong style={{ color: '#9CA3AF' }}>@{username}</strong>'s permanent football forecasting record.
            Every prediction is locked before kickoff. No edits. No deletions. Forever.
          </div>
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div style={{ borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {([
            { key: 'all', label: `All (${predictions.length})` },
            { key: 'correct', label: `✓ Correct (${correctCount})` },
            { key: 'wrong', label: `✗ Wrong (${wrongCount})` },
            { key: 'pending', label: `⏳ Pending (${pendingCount})` },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} className="filter-btn" style={{
              padding: '14px 16px', background: 'transparent', border: 'none',
              borderBottom: filter === key ? '2px solid #2E9E5E' : '2px solid transparent',
              color: filter === key ? '#2E9E5E' : '#6B7280',
              fontSize: 13, fontWeight: filter === key ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
            <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 20 }}>
              {filter === 'all' ? 'No predictions yet.' : `No ${filter} predictions.`}
            </p>
            {isOwner && (
              <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
                Make your first prediction →
              </a>
            )}
          </div>
        ) : (
          dateKeys.map(dateKey => {
            const dayPredictions = grouped[dateKey];
            const dayDate = new Date(dateKey + 'T12:00:00Z');
            const dayLabel = dayDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const dayCorrect = dayPredictions.filter(p => outcomeState(p) === 'correct').length;
            const dayWrong = dayPredictions.filter(p => outcomeState(p) === 'wrong').length;
            const dayPts = dayPredictions.reduce((s, p) => s + (p.points_earned || 0), 0);

            return (
              <div key={dateKey} style={{ marginBottom: 32 }}>

                {/* Date header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #1A3A1A',
                }}>
                  <div>
                    <div style={{ fontSize: 'clamp(14px,3vw,17px)', fontWeight: 700, color: 'white' }}>
                      {dayLabel}
                    </div>
                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                      {dayPredictions.length} prediction{dayPredictions.length !== 1 ? 's' : ''}
                      {dayCorrect > 0 && <span style={{ color: '#2E9E5E' }}> · {dayCorrect} correct</span>}
                      {dayWrong > 0 && <span style={{ color: '#EF4444' }}> · {dayWrong} wrong</span>}
                    </div>
                  </div>
                  {dayPts > 0 && (
                    <div style={{
                      fontSize: 16, fontWeight: 800, color: '#F59E0B',
                      backgroundColor: 'rgba(245,158,11,0.1)', padding: '4px 12px',
                      borderRadius: 8, letterSpacing: '-0.3px',
                    }}>
                      +{dayPts} pts
                    </div>
                  )}
                </div>

                {/* Predictions for this day */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dayPredictions.map((pred, i) => {
                    const state = outcomeState(pred);
                    const match = pred.matches;
                    const matchName = match ? `${match.home_team} vs ${match.away_team}` : 'Unknown Match';
                    const pick = pickLabel(pred);
                    const predicted = scoreDisplay(pred);
                    const actual = actualScore(pred);
                    const isExact = pred.exact_bonus > 0;
                    const isUpset = pred.upset_bonus > 0;
                    const competition = match?.competition || 'World Cup 2026';
                    const slug = match
                      ? `${match.home_team.toLowerCase().replace(/\s+/g,'-')}-vs-${match.away_team.toLowerCase().replace(/\s+/g,'-')}`
                      : '';

                    const borderColor = state === 'correct' ? '#1A7A4A' : state === 'wrong' ? 'rgba(239,68,68,0.3)' : '#1A3A1A';
                    const stateColor = state === 'correct' ? '#2E9E5E' : state === 'wrong' ? '#EF4444' : '#6B7280';
                    const stateIcon = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : '⏳';
                    const stateLabel = state === 'correct' ? 'Correct' : state === 'wrong' ? 'Wrong' : 'Pending';

                    return (
                      <div key={i} className="pred-card" style={{
                        backgroundColor: '#0D2B14',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 12,
                        padding: '16px 18px',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        {/* Left accent */}
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                          backgroundColor: stateColor, borderRadius: '12px 0 0 12px',
                        }}/>

                        <div style={{ paddingLeft: 10 }}>
                          {/* Match name + competition */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <div>
                              {slug ? (
                                <a href={`/matches/${slug}`} style={{
                                  fontSize: 'clamp(14px,3vw,16px)', fontWeight: 700,
                                  color: 'white', textDecoration: 'none',
                                }}>
                                  {matchName}
                                </a>
                              ) : (
                                <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{matchName}</span>
                              )}
                              <span style={{
                                fontSize: 10, color: '#4B5563', marginLeft: 8,
                                backgroundColor: '#050E05', padding: '2px 7px', borderRadius: 4,
                                letterSpacing: '0.5px',
                              }}>
                                {competition}
                              </span>
                            </div>

                            {/* State badge */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              fontSize: 12, fontWeight: 700, color: stateColor,
                              backgroundColor: `${stateColor}15`,
                              padding: '3px 10px', borderRadius: 999,
                            }}>
                              <span>{stateIcon}</span>
                              <span>{stateLabel}</span>
                            </div>
                          </div>

                          {/* Prediction details */}
                          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: '1px', marginBottom: 2 }}>PREDICTION</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#9CA3AF' }}>
                                {state === 'pending' ? '🔒 Locked' : pick}
                                {predicted && state !== 'pending' && (
                                  <span style={{ color: '#4B5563', fontWeight: 400, marginLeft: 4 }}>· {predicted}</span>
                                )}
                              </div>
                            </div>
                            {state !== 'pending' && (
                              <div>
                                <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: '1px', marginBottom: 2 }}>CONFIDENCE</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: pred.confidence_pct >= 75 ? '#F59E0B' : '#9CA3AF' }}>
                                  {pred.confidence_pct}%
                                </div>
                              </div>
                            )}
                            {actual && (
                              <div>
                                <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: '1px', marginBottom: 2 }}>RESULT</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{actual}</div>
                              </div>
                            )}
                            {state !== 'pending' && (
                              <div>
                                <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: '1px', marginBottom: 2 }}>POINTS</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: pred.points_earned > 0 ? '#2E9E5E' : '#4B5563' }}>
                                  {pred.points_earned > 0 ? `+${pred.points_earned}` : '0'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bonus badges */}
                          {(isExact || isUpset) && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              {isExact && (
                                <span style={{ fontSize: 11, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                                  🎯 Exact Score +{pred.exact_bonus}pts
                                </span>
                              )}
                              {isUpset && (
                                <span style={{ fontSize: 11, color: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                                  😱 Upset Caller +{pred.upset_bonus}pts
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* ── BOTTOM CTA ── */}
        <div style={{
          marginTop: 48, padding: '32px 24px',
          backgroundColor: '#0D2B14', border: '1px solid #1A7A4A',
          borderRadius: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            This record is permanent.
          </h3>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            @{username}'s predictions are locked before kickoff and archived forever.
            World Cup 2026 → EPL → Champions League. One record. One reputation.
          </p>
          <a href="/auth" style={{
            display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white',
            padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, fontWeight: 700, letterSpacing: '0.3px',
            boxShadow: '0 0 24px rgba(46,158,94,0.3)',
          }}>
            Build Your Own Football Record →
          </a>
          <p style={{ fontSize: 11, color: '#4B5563', marginTop: 10 }}>Free forever · No betting · No card required</p>
        </div>

      </div>
    </main>
  );
}
