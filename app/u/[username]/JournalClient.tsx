'use client';
import { useState, useEffect } from 'react';
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

const COMP_COLOR: Record<string, string> = {
  'EPL': '#3b0764', 'EPL 2026/27': '#3b0764',
  'UCL': '#1e1b4b', 'UCL 2026/27': '#1e1b4b',
  'ISL': '#7c2d12', 'ISL 2026/27': '#7c2d12',
  'Liga 1': '#14532d', 'Liga 1 2026/27': '#14532d',
  'Ghana PL': '#713f12', 'Ghana PL 2026/27': '#713f12',
};

const COMP_SHORT: Record<string, string> = {
  'EPL 2026/27': 'EPL', 'UCL 2026/27': 'UCL',
  'ISL 2026/27': 'ISL', 'Liga 1 2026/27': 'Liga 1',
  'Ghana PL 2026/27': 'Ghana PL',
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

  // Accuracy ring arc path
  const r = 44;
  const circ = 2 * Math.PI * r;
  const arcLen = (accuracy / 100) * circ;
  const arcColor = accuracy >= 70 ? '#2E9E5E' : accuracy >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <main style={{
      backgroundColor: '#080F09',
      minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white',
      paddingBottom: 80,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes streakGlow{0%,100%{box-shadow:0 0 10px rgba(249,115,22,0.3)}50%{box-shadow:0 0 24px rgba(249,115,22,0.7)}}
        @keyframes ringDraw{from{stroke-dashoffset:${circ}}to{stroke-dashoffset:${circ - arcLen}}}
        .pred-card:hover{border-color:#2E9E5E!important;transform:translateY(-1px)}
        .pred-card{transition:border-color 0.15s,transform 0.15s}
        .filter-btn:hover{color:#2E9E5E!important}
        .share-btn-wa{background:#25D366;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;transition:opacity 0.15s}
        .share-btn-wa:hover{opacity:0.85}
        .copy-btn{background:transparent;color:#6B7280;border:1px solid #1A3A1A;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .copy-btn:hover{border-color:#2E9E5E;color:#2E9E5E}
        .badge-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid;animation:fadeUp 0.3s ease both}
        .streak-card{animation:streakGlow 2s ease-in-out infinite}
        .ring-arc{animation:ringDraw 1s ease-out forwards;stroke-dasharray:${circ};stroke-dashoffset:${circ}}
        .stat-tile{background:#0D2B14;border:1px solid #1A3A1A;border-radius:12px;padding:16px 12px;text-align:center;transition:border-color 0.15s}
        .stat-tile:hover{border-color:#2E9E5E}
      `}</style>

      {/* ═══ HERO HEADER ═══ */}
      <div style={{
        background: 'linear-gradient(180deg, #071408 0%, #080F09 100%)',
        borderBottom: '1px solid #1A3A1A',
        padding: 'clamp(32px,6vw,56px) 20px clamp(28px,5vw,44px)',
      }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>

          {/* Top: avatar + name + actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>

            {/* Left: avatar + identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Avatar with ring */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1A7A4A, #0D4A28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, border: '2px solid #2E9E5E',
                  boxShadow: '0 0 20px rgba(46,158,94,0.25)',
                }}>
                  {username[0].toUpperCase()}
                </div>
                {currentStreak >= 3 && (
                  <div style={{
                    position: 'absolute', bottom: -4, right: -4,
                    backgroundColor: '#F97316', borderRadius: '50%',
                    width: 22, height: 22, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, border: '2px solid #080F09',
                  }}>🔥</div>
                )}
              </div>

              {/* Name + rank + flag */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <h1 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                    @{username}
                  </h1>
                  {profile?.country && (
                    <span style={{ fontSize: 20 }}>{FLAG[profile.country] || '🌍'}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {profile?.rank && (
                    <span style={{
                      fontSize: 11, color: '#2E9E5E', fontWeight: 700,
                      backgroundColor: 'rgba(46,158,94,0.12)', padding: '3px 10px',
                      borderRadius: 999, letterSpacing: '0.8px', border: '1px solid rgba(46,158,94,0.2)',
                    }}>
                      {profile.rank_icon} {profile.rank}
                    </span>
                  )}
                  {profile?.rank_number && (
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Global #{profile.rank_number}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setShowRepCard(true)} style={{
                backgroundColor: 'rgba(26,122,74,0.2)', color: '#2E9E5E',
                border: '1px solid rgba(46,158,94,0.3)', padding: '9px 14px',
                borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                🏆 Rep Card
              </button>
              <button onClick={share} style={{
                backgroundColor: copied ? '#1A7A4A' : 'transparent',
                color: copied ? 'white' : '#6B7280',
                border: '1px solid #1A3A1A',
                padding: '9px 16px', borderRadius: 9,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                {copied ? '✓ Copied' : '↗ Share'}
              </button>
            </div>
          </div>

          {/* ── ACCURACY HERO + KEY STATS ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>

            {/* Accuracy ring — the hero stat */}
            <div style={{
              background: 'linear-gradient(135deg, #0D2B14, #071408)',
              border: '1px solid #1A3A1A',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              flex: '1 1 240px',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
                  {/* Track */}
                  <circle cx={50} cy={50} r={r} fill="none" stroke="#1A3A1A" strokeWidth={8} />
                  {/* Arc */}
                  <circle
                    className="ring-arc"
                    cx={50} cy={50} r={r}
                    fill="none"
                    stroke={arcColor}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: arcColor, lineHeight: 1 }}>{accuracy}%</div>
                  <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: 1, marginTop: 2 }}>ACC</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>Prediction Accuracy</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2E9E5E', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{correctCount} correct</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{wrongCount} wrong</span>
                  </div>
                  {pendingCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6B7280', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#9CA3AF' }}>{pendingCount} pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: '1 1 180px' }}>
              {[
                { v: profile?.total_points?.toLocaleString() || '0', l: 'REP Points', c: '#F59E0B', icon: '⭐' },
                { v: predictions.length, l: 'Predictions', c: '#9CA3AF', icon: '📋' },
                { v: exactScores, l: 'Exact Scores', c: '#F59E0B', icon: '🎯' },
                { v: currentStreak > 0 ? `${currentStreak} 🔥` : (bestStreak || '—'), l: currentStreak > 0 ? 'Streak' : 'Best Streak', c: currentStreak >= 3 ? '#F97316' : '#8B5CF6', icon: currentStreak > 0 ? '' : '💫' },
              ].map(({ v, l, c, icon }) => (
                <div key={l} className="stat-tile">
                  <div style={{ fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 800, color: c, letterSpacing: '-0.3px', marginBottom: 3 }}>
                    {v}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.5px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STREAK BANNER ── */}
          {currentStreak >= 2 && (
            <div className="streak-card" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.35)',
              borderRadius: 12, padding: '12px 18px', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🔥</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#F97316' }}>
                    {currentStreak}-Match Winning Streak
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {currentStreak >= 10 ? 'Absolutely on fire 🔥🔥🔥' : currentStreak >= 5 ? 'Hot streak — keep it going!' : "On a roll — don't stop now"}
                  </div>
                </div>
              </div>
              {bestStreak > 0 && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: 1 }}>BEST EVER</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>{bestStreak} 🔥</div>
                </div>
              )}
            </div>
          )}

          {/* ── BADGES ── */}
          {badges.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 2, marginBottom: 8, fontWeight: 600 }}>ACHIEVEMENTS</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {badges.map((b, i) => {
                  const isStreak = b.badge_type?.startsWith('hot_streak');
                  const isExact = b.badge_type === 'score_master';
                  const isUpset = b.badge_type === 'upset_king';
                  const isBold = b.badge_type === 'bold_caller';
                  const isHero = b.badge_type === 'match_hero';
                  const badgeColor = isStreak ? '#F97316' : isExact ? '#F59E0B' : isUpset ? '#8B5CF6' : isBold ? '#06B6D4' : isHero ? '#2E9E5E' : '#9CA3AF';
                  return (
                    <span key={i} className="badge-pill" title={b.badge_label} style={{
                      color: badgeColor, backgroundColor: `${badgeColor}15`,
                      borderColor: `${badgeColor}35`, animationDelay: `${i * 60}ms`,
                    }}>
                      <span>{b.badge_icon || '🏅'}</span>
                      <span>{b.badge_label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* REP progress bar */}
          <ReputationProgressBar totalPoints={profile?.total_points || 0} username={username} />

          {/* Permanence note */}
          <div style={{
            marginTop: 14, padding: '10px 14px',
            backgroundColor: 'rgba(46,158,94,0.05)', border: '1px solid #1A3A1A',
            borderRadius: 8, fontSize: 12, color: '#6B7280', lineHeight: 1.6,
          }}>
            📖 <strong style={{ color: '#8895A3' }}>@{username}</strong>'s permanent record — every prediction locked before kickoff. No edits. No deletions. Forever.
          </div>
        </div>
      </div>

      {/* ═══ FILTER TABS ═══ */}
      <div style={{ borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 2, overflowX: 'auto' }}>
          {([
            { key: 'all', label: 'All', count: predictions.length },
            { key: 'correct', label: '✓ Correct', count: correctCount },
            { key: 'wrong', label: '✗ Wrong', count: wrongCount },
            { key: 'pending', label: '⏳ Pending', count: pendingCount },
          ] as const).map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)} className="filter-btn" style={{
              padding: '13px 14px', background: 'transparent', border: 'none',
              borderBottom: filter === key ? '2px solid #2E9E5E' : '2px solid transparent',
              color: filter === key ? '#2E9E5E' : '#6B7280',
              fontSize: 13, fontWeight: filter === key ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {label}
              <span style={{
                fontSize: 10, fontWeight: 700,
                backgroundColor: filter === key ? 'rgba(46,158,94,0.15)' : 'rgba(107,114,128,0.1)',
                color: filter === key ? '#2E9E5E' : '#6B7280',
                padding: '1px 7px', borderRadius: 999,
              }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ PREDICTION TIMELINE ═══ */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '28px 20px 0' }}>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '56px 20px',
            backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📖</div>
            <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>
              {filter === 'all' ? 'No predictions yet.' : `No ${filter} predictions.`}
            </p>
            {isOwner && (
              <a href="/predict" style={{
                display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white',
                padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700,
              }}>
                Make your first prediction →
              </a>
            )}
          </div>
        ) : (
          dateKeys.map(dateKey => {
            const dayPredictions = grouped[dateKey];
            const dayDate = new Date(dateKey + 'T12:00:00Z');
            const dayLabel = dayDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
            const dayCorrect = dayPredictions.filter(p => outcomeState(p) === 'correct').length;
            const dayWrong = dayPredictions.filter(p => outcomeState(p) === 'wrong').length;
            const dayPts = dayPredictions.reduce((s, p) => s + (p.points_earned || 0), 0);
            const dayProcessed = dayCorrect + dayWrong;
            const dayAcc = dayProcessed > 0 ? Math.round((dayCorrect / dayProcessed) * 100) : null;

            return (
              <div key={dateKey} style={{ marginBottom: 28 }}>

                {/* Date header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #1A3A1A',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>{dayLabel}</span>
                    <span style={{ fontSize: 11, color: '#4B5563' }}>·</span>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>{dayPredictions.length} prediction{dayPredictions.length !== 1 ? 's' : ''}</span>
                    {dayAcc !== null && (
                      <>
                        <span style={{ fontSize: 11, color: '#4B5563' }}>·</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: dayAcc >= 60 ? '#2E9E5E' : '#EF4444' }}>{dayAcc}% acc</span>
                      </>
                    )}
                  </div>
                  {dayPts > 0 && (
                    <div style={{
                      fontSize: 13, fontWeight: 800, color: '#F59E0B',
                      backgroundColor: 'rgba(245,158,11,0.1)', padding: '3px 10px',
                      borderRadius: 6, letterSpacing: '-0.2px',
                    }}>
                      +{dayPts} pts
                    </div>
                  )}
                </div>

                {/* Cards */}
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
                    const competition = match?.competition || '';
                    const compShort = COMP_SHORT[competition] || competition.split(' ')[0];
                    const compBg = COMP_COLOR[competition] || '#1A3A1A';
                    const slug = match
                      ? `${match.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-')}`
                      : '';
                    const isCopied = copiedPredId === pred.id;

                    const borderColor = state === 'correct' ? '#1A7A4A' : state === 'wrong' ? 'rgba(239,68,68,0.25)' : '#1A3A1A';
                    const leftBar = state === 'correct' ? '#2E9E5E' : state === 'wrong' ? '#EF4444' : '#374151';
                    const stateColor = state === 'correct' ? '#2E9E5E' : state === 'wrong' ? '#EF4444' : '#6B7280';
                    const stateLabel = state === 'correct' ? (isExact ? '🎯 Exact!' : '✓ Correct') : state === 'wrong' ? '✗ Wrong' : '⏳ Pending';

                    return (
                      <div key={i} className="pred-card" style={{
                        backgroundColor: '#0D1F0F',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 12,
                        padding: '14px 16px 14px 20px',
                        position: 'relative', overflow: 'hidden',
                        ...(isExact ? { boxShadow: '0 0 20px rgba(245,158,11,0.12)' } : {}),
                      }}>
                        {/* Left accent bar */}
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                          backgroundColor: leftBar,
                          borderRadius: '12px 0 0 12px',
                        }} />

                        {/* Row 1: match name + competition tag + state badge */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {slug ? (
                              <a href={`/matches/${slug}`} style={{
                                fontSize: 'clamp(13px,2.5vw,15px)', fontWeight: 700,
                                color: 'white', textDecoration: 'none', display: 'block',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {matchName}
                              </a>
                            ) : (
                              <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{matchName}</span>
                            )}
                            {compShort && (
                              <span style={{
                                display: 'inline-block', marginTop: 3,
                                fontSize: 9, color: '#9CA3AF', fontWeight: 700,
                                backgroundColor: compBg, padding: '2px 7px',
                                borderRadius: 4, letterSpacing: '0.5px',
                              }}>
                                {compShort}
                              </span>
                            )}
                          </div>

                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                            fontSize: 11, fontWeight: 700, color: stateColor,
                            backgroundColor: `${stateColor}12`,
                            padding: '4px 10px', borderRadius: 999,
                            border: `1px solid ${stateColor}25`,
                          }}>
                            {stateLabel}
                          </div>
                        </div>

                        {/* Row 2: score display — the visual centrepiece */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          marginBottom: state !== 'pending' ? 10 : 0,
                          backgroundColor: '#071408', borderRadius: 8, padding: '10px 14px',
                        }}>
                          {/* Predicted score */}
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>PREDICTED</div>
                            {state === 'pending' ? (
                              <div style={{ fontSize: 20, fontWeight: 800, color: '#374151' }}>🔒</div>
                            ) : predicted ? (
                              <div style={{ fontSize: 22, fontWeight: 900, color: '#9CA3AF', letterSpacing: '-0.5px' }}>{predicted}</div>
                            ) : (
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>{pick}</div>
                            )}
                          </div>

                          {/* VS divider */}
                          <div style={{ color: '#1A3A1A', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>→</div>

                          {/* Actual score */}
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>RESULT</div>
                            {actual ? (
                              <div style={{
                                fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px',
                                color: state === 'correct' ? '#2E9E5E' : state === 'wrong' ? '#EF4444' : '#9CA3AF',
                              }}>
                                {actual}
                              </div>
                            ) : (
                              <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>TBD</div>
                            )}
                          </div>

                          {/* Points earned */}
                          {state !== 'pending' && (
                            <>
                              <div style={{ color: '#1A3A1A', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>·</div>
                              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                <div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>PTS</div>
                                <div style={{
                                  fontSize: 20, fontWeight: 900,
                                  color: pred.points_earned > 0 ? '#F59E0B' : '#374151',
                                }}>
                                  {pred.points_earned > 0 ? `+${pred.points_earned}` : '0'}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Bonus pills */}
                        {(isExact || isUpset) && (
                          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                            {isExact && (
                              <span style={{ fontSize: 10, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(245,158,11,0.2)' }}>
                                🎯 Exact Score +{pred.exact_bonus}pts
                              </span>
                            )}
                            {isUpset && (
                              <span style={{ fontSize: 10, color: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(139,92,246,0.2)' }}>
                                😱 Upset Caller +{pred.upset_bonus}pts
                              </span>
                            )}
                          </div>
                        )}

                        {/* Share row — settled only */}
                        {state !== 'pending' && (
                          <div style={{
                            display: 'flex', gap: 6, paddingTop: 10,
                            borderTop: '1px solid #0D2B14',
                            alignItems: 'center', flexWrap: 'wrap',
                          }}>
                            <span style={{ fontSize: 10, color: '#374151', marginRight: 2 }}>Share:</span>
                            <button className="share-btn-wa" onClick={() => sharePrediction(pred)}>
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
                              target="_blank" rel="noopener noreferrer"
                              style={{
                                background: 'transparent', color: '#6B7280',
                                border: '1px solid #1A3A1A', padding: '6px 12px',
                                borderRadius: 6, fontSize: 11, fontWeight: 600,
                                textDecoration: 'none', lineHeight: 1,
                              }}
                            >
                              𝕏 Post
                            </a>
                          </div>
                        )}
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
          background: 'linear-gradient(135deg, #0D2B14, #071408)',
          border: '1px solid #1A7A4A',
          borderRadius: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.3px' }}>
            This record is permanent.
          </h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, marginBottom: 22, maxWidth: 400, margin: '0 auto 22px' }}>
            @{username}'s predictions are locked before kickoff and archived forever.
            EPL · UCL · Ghana PL · ISL. One record. One reputation.
          </p>
          <a href="/auth" style={{
            display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white',
            padding: '13px 30px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 0 24px rgba(46,158,94,0.25)',
          }}>
            Build Your Own Football Record →
          </a>
          <p style={{ fontSize: 11, color: '#8895A3', marginTop: 10 }}>Free forever · No betting · No card required</p>
        </div>

      </div>

      {showRepCard && (
        <ReputationCard username={username} onClose={() => setShowRepCard(false)} />
      )}
    </main>
  );
}
