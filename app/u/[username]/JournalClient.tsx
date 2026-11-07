'use client';
import { useState, useEffect, useRef } from 'react';
import ReputationCard from '@/components/ReputationCard';
import ReputationProgressBar from '@/components/ReputationProgressBar';
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

function buildResultShareText(pred: any, username: string): string {
  const m = pred.matches;
  const matchName = m ? `${m.home_team} vs ${m.away_team}` : 'Match';
  const actual = actualScore(pred);
  const predicted = scoreDisplay(pred);
  const isExact = pred.exact_bonus > 0;
  const pts = pred.points_earned || 0;

  if (isExact) {
    return `🎯 Exact Score! I called ${matchName} ${predicted} and nailed it!\n\nResult: ${actual} ✅\n+${pts} REP earned\n\nMy prediction record 👉 https://flipseer.com/u/${username}`;
  }
  if (pts > 0) {
    return `✅ Correct call! ${matchName} · ${actual}\n\nI predicted ${pickLabel(pred)} and got it right.\n+${pts} REP earned\n\nMy record 👉 https://flipseer.com/u/${username}`;
  }
  return `❌ I called ${pickLabel(pred)} in ${matchName} but the result was ${actual}.\n\nStill building my forecast record 👉 https://flipseer.com/u/${username}`;
}

function buildOgUrl(pred: any, username: string): string {
  const m = pred.matches;
  const params = new URLSearchParams({
    user: username,
    home: m?.home_team || '',
    away: m?.away_team || '',
    hs: String(m?.home_score ?? ''),
    as: String(m?.away_score ?? ''),
    pred_h: String(pred.predicted_home_score ?? ''),
    pred_a: String(pred.predicted_away_score ?? ''),
    outcome: pred.predicted_outcome || '',
    correct: String(pred.points_earned > 0),
    exact: String(pred.exact_bonus > 0),
    comp: m?.competition || '',
    pts: String(pred.points_earned || 0),
  });
  return `https://flipseer.com/api/og/result?${params.toString()}`;
}

type JournalProps = {
  username: string;
  profile: any;
  predictions: any[];
  badges?: any[];
};

export default function JournalClient({ username, profile, predictions, badges = [] }: JournalProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'pending'>('all');
  const [copied, setCopied] = useState(false);
  const [copiedPredId, setCopiedPredId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showRepCard, setShowRepCard] = useState(false);

  useEffect(() => {
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

  // Current streak from profile (DB-tracked)
  const currentStreak = profile?.streak || 0;
  const bestStreak = profile?.best_streak || 0;

  const share = () => {
    const url = `https://flipseer.com/u/${username}`;
    if (navigator.share) {
      navigator.share({ title: `@${username}'s Forecast Journal`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  const sharePrediction = (pred: any) => {
    const text = buildResultShareText(pred, username);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const copyPredLink = (pred: any) => {
    const ogUrl = buildOgUrl(pred, username);
    navigator.clipboard.writeText(ogUrl).then(() => {
      setCopiedPredId(pred.id);
      setTimeout(() => setCopiedPredId(null), 2000);
    });
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
        @keyframes popIn{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes streakGlow{0%,100%{box-shadow:0 0 8px rgba(249,115,22,0.4)}50%{box-shadow:0 0 20px rgba(249,115,22,0.8)}}
        .pred-card:hover{border-color:#2E9E5E!important}
        .pred-card{transition:border-color 0.15s}
        .filter-btn:hover{background:rgba(46,158,94,0.1)!important}
        .share-btn{background:#25D366;color:white;border:none;padding:7px 13px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;transition:opacity 0.15s}
        .share-btn:hover{opacity:0.85}
        .copy-btn{background:transparent;color:#9CA3AF;border:1px solid #1A3A1A;padding:7px 13px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .copy-btn:hover{border-color:#2E9E5E;color:#2E9E5E}
        .badge-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid;animation:fadeUp 0.3s ease both}
        .streak-banner{animation:streakGlow 2s ease-in-out infinite}
      `}</style>

      {/* ── PROFILE HEADER ── */}
      <div style={{
        background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)',
        padding: 'clamp(40px,8vw,64px) 20px clamp(32px,6vw,48px)',
        borderBottom: '1px solid #1A3A1A',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
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
                    <span style={{ fontSize: 12, color: '#8895A3' }}>
                      Global #{profile.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowRepCard(true)} style={{
                backgroundColor: '#1A7A4A', color: 'white',
                border: 'none', padding: '8px 14px', borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                🏆 Rep Card
              </button>
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
          </div>

          {/* ── STREAK BANNER (shown if streak ≥ 2) ── */}
          {currentStreak >= 2 && (
            <div className="streak-banner" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)',
              borderRadius: 12, padding: '12px 18px', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🔥</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F97316' }}>
                    {currentStreak} Match Streak
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {currentStreak >= 10
                      ? 'On absolute fire 🔥🔥🔥'
                      : currentStreak >= 5
                      ? 'Hot streak! Keep it going 🔥'
                      : 'On a roll — don\'t stop now'}
                  </div>
                </div>
              </div>
              {bestStreak > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: 1 }}>BEST EVER</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#F59E0B' }}>{bestStreak} 🔥</div>
                </div>
              )}
            </div>
          )}

          {/* ── BADGES ROW (shown if any badges earned) ── */}
          {badges.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: 2, marginBottom: 8 }}>ACHIEVEMENTS</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {badges.map((b, i) => {
                  // Color by badge type
                  const isStreak = b.badge_type?.startsWith('hot_streak');
                  const isExact = b.badge_type === 'score_master';
                  const isUpset = b.badge_type === 'upset_king';
                  const isBold = b.badge_type === 'bold_caller';
                  const isHero = b.badge_type === 'match_hero';

                  const badgeColor = isStreak ? '#F97316'
                    : isExact ? '#F59E0B'
                    : isUpset ? '#8B5CF6'
                    : isBold ? '#06B6D4'
                    : isHero ? '#2E9E5E'
                    : '#9CA3AF';
                  const badgeBg = `${badgeColor}18`;

                  return (
                    <span
                      key={i}
                      className="badge-pill"
                      title={b.badge_label}
                      style={{
                        color: badgeColor,
                        backgroundColor: badgeBg,
                        borderColor: `${badgeColor}40`,
                        animationDelay: `${i * 60}ms`,
                      }}
                    >
                      <span>{b.badge_icon || '🏅'}</span>
                      <span>{b.badge_label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reputation Progress Bar */}
          <ReputationProgressBar
            totalPoints={profile?.total_points || 0}
            username={username}
          />

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 10 }}>
            {[
              { v: profile?.total_points || 0, l: 'Total Points', c: '#F59E0B' },
              { v: `${accuracy}%`, l: 'Accuracy', c: '#2E9E5E' },
              { v: predictions.length, l: 'Predictions', c: '#9CA3AF' },
              { v: correctCount, l: 'Correct', c: '#2E9E5E' },
              { v: exactScores, l: 'Exact Scores', c: '#F59E0B' },
              { v: currentStreak > 0 ? `${currentStreak} 🔥` : bestStreak || 0, l: currentStreak > 0 ? 'Current Streak' : 'Best Streak', c: currentStreak >= 3 ? '#F97316' : '#8B5CF6' },
            ].map(({ v, l, c }) => (
              <div key={l} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '14px 12px', textAlign: 'center',
                ...(l.includes('Streak') && currentStreak >= 3 ? { borderColor: 'rgba(249,115,22,0.4)' } : {}),
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
            borderRadius: 8, fontSize: 13, color: '#8895A3', lineHeight: 1.6,
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
                    <div style={{ fontSize: 12, color: '#8895A3', marginTop: 2 }}>
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
                    const isCopied = copiedPredId === pred.id;

                    const borderColor = state === 'correct' ? '#1A7A4A' : state === 'wrong' ? 'rgba(239,68,68,0.3)' : '#1A3A1A';
                    const stateColor = state === 'correct' ? '#2E9E5E' : state === 'wrong' ? '#EF4444' : '#6B7280';
                    const stateIcon = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : '⏳';
                    const stateLabel = state === 'correct' ? (isExact ? '🎯 Exact Score!' : 'Correct') : state === 'wrong' ? 'Wrong' : 'Pending';

                    return (
                      <div key={i} className="pred-card" style={{
                        backgroundColor: '#0D2B14',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 12,
                        padding: '16px 18px',
                        position: 'relative', overflow: 'hidden',
                        ...(isExact ? { boxShadow: '0 0 16px rgba(245,158,11,0.15)' } : {}),
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
                                fontSize: 10, color: '#8895A3', marginLeft: 8,
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
                              <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '1px', marginBottom: 2 }}>PREDICTION</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#9CA3AF' }}>
                                {state === 'pending' ? '🔒 Locked' : pick}
                                {predicted && state !== 'pending' && (
                                  <span style={{ color: '#8895A3', fontWeight: 400, marginLeft: 4 }}>· {predicted}</span>
                                )}
                              </div>
                            </div>
                            {state !== 'pending' && (
                              <div>
                                <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '1px', marginBottom: 2 }}>CONFIDENCE</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: pred.confidence_pct >= 75 ? '#F59E0B' : '#9CA3AF' }}>
                                  {pred.confidence_pct}%
                                </div>
                              </div>
                            )}
                            {actual && (
                              <div>
                                <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '1px', marginBottom: 2 }}>RESULT</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{actual}</div>
                              </div>
                            )}
                            {state !== 'pending' && (
                              <div>
                                <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '1px', marginBottom: 2 }}>POINTS</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: pred.points_earned > 0 ? '#2E9E5E' : '#8895A3' }}>
                                  {pred.points_earned > 0 ? `+${pred.points_earned}` : '0'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bonus badges */}
                          {(isExact || isUpset) && (
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
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

                          {/* ── POST-MATCH SHARE ROW (only on settled predictions) ── */}
                          {state !== 'pending' && (
                            <div style={{
                              display: 'flex', gap: 7, marginTop: 10,
                              paddingTop: 10, borderTop: '1px solid #1A3A1A',
                              alignItems: 'center', flexWrap: 'wrap',
                            }}>
                              <span style={{ fontSize: 11, color: '#4B5563', marginRight: 2 }}>Share:</span>
                              <button className="share-btn" onClick={() => sharePrediction(pred)}>
                                📱 WhatsApp
                              </button>
                              <button
                                className="copy-btn"
                                onClick={() => copyPredLink(pred)}
                                style={{ color: isCopied ? '#2E9E5E' : undefined, borderColor: isCopied ? '#2E9E5E' : undefined }}
                              >
                                {isCopied ? '✓ Copied' : '🔗 Copy'}
                              </button>
                              <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildResultShareText(pred, username))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  background: 'transparent', color: '#9CA3AF',
                                  border: '1px solid #1A3A1A', padding: '7px 13px',
                                  borderRadius: 7, fontSize: 12, fontWeight: 600,
                                  textDecoration: 'none', lineHeight: 1,
                                }}
                              >
                                𝕏 Post
                              </a>
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
          <p style={{ fontSize: 11, color: '#8895A3', marginTop: 10 }}>Free forever · No betting · No card required</p>
        </div>

      </div>
      {showRepCard && (
        <ReputationCard
          username={username}
          onClose={() => setShowRepCard(false)}
        />
      )}
    </main>
  );
}
