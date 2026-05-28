'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

type Match = {
  id: number;
  api_id: number;
  home_team: string;
  away_team: string;
  kickoff: string;
  status: string;
  league: string;
};

type CommunityStats = {
  home: number;
  draw: number;
  away: number;
  total: number;
};

// ✅ Browser timezone — works for every country automatically
function formatKickoffLocal(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return date.toLocaleString('en-GB', {
    timeZone: browserTz,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

// ── Countdown hook ──
function useCountdown(kickoff: string) {
  const LOCK_BEFORE_MS = 2 * 60 * 1000;
  const compute = useCallback(() => {
    const diff = new Date(kickoff).getTime() - Date.now();
    const locked = diff <= LOCK_BEFORE_MS;
    if (locked) return { locked: true, label: '' };
    const totalSecs = Math.floor((diff - LOCK_BEFORE_MS) / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const label = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
    return { locked: false, label };
  }, [kickoff]);

  const [state, setState] = useState(compute);
  useEffect(() => {
    const tick = () => setState(compute());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [compute]);
  return state;
}

// ── Match card ──
function MatchCard({
  match, pred, isSaved, isLoading, comm, username,
  onPredict, onConfidence, onScore, onSave,
}: {
  match: Match;
  pred: any;
  isSaved: boolean;
  isLoading: boolean;
  comm: CommunityStats | undefined;
  username: string;
  onPredict: (id: number, outcome: string) => void;
  onConfidence: (id: number, val: number) => void;
  onScore: (id: number, side: 'predicted_home_score' | 'predicted_away_score', val: number) => void;
  onSave: (id: number) => void;
}) {
  const { locked, label: timeLeft } = useCountdown(match.kickoff);
  const [shared, setShared] = useState(false);

  const kickoffDate = formatKickoffLocal(match.kickoff);

  const getPct = (count: number, total: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  const homePct = comm ? getPct(comm.home, comm.total) : 0;
  const drawPct = comm ? getPct(comm.draw, comm.total) : 0;
  const awayPct = comm ? getPct(comm.away, comm.total) : 0;

  const homeVal = pred?.predicted_home_score ?? 0;
  const awayVal = pred?.predicted_away_score ?? 0;

  const handleShare = async () => {
    if (!pred?.outcome) return;
    const pickLabel = pred.outcome === 'home' ? `${match.home_team} Win`
      : pred.outcome === 'away' ? `${match.away_team} Win` : 'Draw';
    const shareUrl = `https://flipseer.com/u/${username}`;
    const text = `⚽ I just predicted ${match.home_team} vs ${match.away_team}\n🎯 ${pickLabel} · ${pred.confidence}% confidence\nMy World Cup 2026 record → ${shareUrl}`;
    if (navigator.share) {
      await navigator.share({ title: 'My Flipseer Prediction', text, url: shareUrl });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#0D2B14', border: `1px solid ${isSaved ? '#2E9E5E' : '#1A7A4A'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

      {/* MATCH HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>{match.league} · {kickoffDate}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {!locked && timeLeft && (
            <span style={{ fontSize: '11px', backgroundColor: '#1C3A1A', color: '#F59E0B', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              ⏱ Locks in {timeLeft}
            </span>
          )}
          {locked && <span style={{ fontSize: '11px', backgroundColor: '#7F1D1D', color: '#FCA5A5', padding: '2px 8px', borderRadius: '4px' }}>🔒 LOCKED</span>}
          {isSaved && !locked && <span style={{ fontSize: '11px', backgroundColor: '#1A7A4A', color: '#6EE7B7', padding: '2px 8px', borderRadius: '4px' }}>✅ SAVED</span>}
        </div>
      </div>

      {/* TEAMS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.home_team}</span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>vs</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.away_team}</span>
      </div>

      {/* COMMUNITY SPLIT */}
      {comm && comm.total > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: '#6B7280' }}>
            <span>🌍 {comm.total} predictions</span>
            <span>Community split</span>
          </div>
          <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '8px', marginBottom: '6px' }}>
            {homePct > 0 && <div style={{ width: `${homePct}%`, backgroundColor: '#2E9E5E' }} />}
            {drawPct > 0 && <div style={{ width: `${drawPct}%`, backgroundColor: '#6B7280' }} />}
            {awayPct > 0 && <div style={{ width: `${awayPct}%`, backgroundColor: '#3B82F6' }} />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{match.home_team} {homePct}%</span>
            <span style={{ color: '#6B7280' }}>Draw {drawPct}%</span>
            <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{match.away_team} {awayPct}%</span>
          </div>
        </div>
      )}

      {/* ACTIVE PREDICTION FORM */}
      {!locked && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[
              { value: 'home', label: `${match.home_team} Win` },
              { value: 'draw', label: 'Draw' },
              { value: 'away', label: `${match.away_team} Win` },
            ].map(({ value, label }) => (
              <button key={value} onClick={() => onPredict(match.id, value)}
                style={{ flex: 1, padding: '10px 4px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: pred?.outcome === value ? '#1A7A4A' : 'transparent', color: pred?.outcome === value ? 'white' : '#9CA3AF', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                {label}
              </button>
            ))}
          </div>

          {pred?.outcome && (
            <div style={{ marginBottom: '16px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', textAlign: 'center' }}>
                🎯 Exact Score <span style={{ color: '#2E9E5E', fontSize: '11px' }}>(+55 pts if correct!)</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{match.home_team}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => onScore(match.id, 'predicted_home_score', homeVal - 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>−</button>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{homeVal}</span>
                    <button onClick={() => onScore(match.id, 'predicted_home_score', homeVal + 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                  </div>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6B7280', marginTop: '16px' }}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{match.away_team}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => onScore(match.id, 'predicted_away_score', awayVal - 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>−</button>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{awayVal}</span>
                    <button onClick={() => onScore(match.id, 'predicted_away_score', awayVal + 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {pred?.outcome && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2E9E5E' }}>{pred.confidence}%</span>
              </div>
              <input type="range" min="1" max="100" value={pred.confidence}
                onChange={(e) => onConfidence(match.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#2E9E5E' }} />
            </div>
          )}

          {pred?.outcome && comm && comm.total > 0 && (
            <div style={{ marginBottom: '12px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                👥 You agree with{' '}
                <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>
                  {pred.outcome === 'home' ? homePct : pred.outcome === 'draw' ? drawPct : awayPct}%
                </span>
                {' '}of forecasters
                {(pred.outcome === 'home' ? homePct : pred.outcome === 'draw' ? drawPct : awayPct) < 30 && (
                  <span style={{ color: '#F59E0B' }}> · 🦁 Brave call!</span>
                )}
              </span>
            </div>
          )}

          {pred?.outcome && (
            <button onClick={() => onSave(match.id)} disabled={isLoading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Saving...' : isSaved ? 'Update Prediction ✓' : 'Lock In Prediction →'}
            </button>
          )}
        </>
      )}

      {/* LOCKED STATE + SHARE */}
      {locked && (
        <div style={{ backgroundColor: '#1A3A20', padding: '12px', borderRadius: '8px' }}>
          {pred?.outcome ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6EE7B7' }}>
                  Your pick: <strong>{pred.outcome === 'home' ? match.home_team : pred.outcome === 'away' ? match.away_team : 'Draw'}</strong>
                  {pred.predicted_home_score !== undefined && <span> · Score: <strong>{pred.predicted_home_score}–{pred.predicted_away_score}</strong></span>}
                  {' '}· {pred.confidence}% confidence
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleShare} style={{ flex: 1, padding: '8px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {shared ? '✅ Shared!' : '📤 Share'}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`⚽ I predicted ${match.home_team} vs ${match.away_team}: ${pred.outcome === 'home' ? match.home_team + ' Win' : pred.outcome === 'away' ? match.away_team + ' Win' : 'Draw'} · ${pred.confidence}% confidence\nSee my record → https://flipseer.com/u/${username}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '8px', backgroundColor: '#25D366', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
                  📱 WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: '#6B7280', display: 'block', textAlign: 'center' }}>🔒 Predictions closed — no pick recorded</span>
          )}
        </div>
      )}

      {/* SHARE AFTER SAVING */}
      {isSaved && !locked && pred?.outcome && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button onClick={handleShare} style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', color: '#2E9E5E', border: '1px solid #2E9E5E', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            {shared ? '✅ Shared!' : '📤 Share Prediction'}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`⚽ I predicted ${match.home_team} vs ${match.away_team}: ${pred.outcome === 'home' ? match.home_team + ' Win' : pred.outcome === 'away' ? match.away_team + ' Win' : 'Draw'} · ${pred.confidence}% confidence\nMy record → https://flipseer.com/u/${username}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, padding: '8px', backgroundColor: '#25D366', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
            📱 WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

// ── Main page ──
export default function Predict() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('forecaster');
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [predictions, setPredictions] = useState<{ [key: number]: any }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [community, setCommunity] = useState<{ [key: number]: CommunityStats }>({});
  const [dailyUsed, setDailyUsed] = useState(0);
  const DAILY_LIMIT = 8;

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth'; return; }
      const user = session.user;
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles').select('username').eq('id', user.id).single();
      if (profile?.username) setUsername(profile.username);

      setMatchesLoading(true);
      const { data: matchData } = await supabase
        .from('matches')
        .select('id, api_id, home_team, away_team, kickoff, status, league')
        .in('status', ['upcoming', 'locked'])
        .order('kickoff', { ascending: true });
      setMatches(matchData || []);
      setMatchesLoading(false);

      const { data: predData } = await supabase
        .from('predictions').select('*').eq('user_id', user.id);

      if (predData) {
        const existing: any = {};
        const savedMap: any = {};
        // ✅ Count today's predictions for daily limit display
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        let todayCount = 0;

        predData.forEach((p: any) => {
          existing[p.match_id] = {
            outcome: p.predicted_outcome,
            confidence: p.confidence_pct,
            predicted_home_score: p.predicted_home_score ?? undefined,
            predicted_away_score: p.predicted_away_score ?? undefined,
          };
          savedMap[p.match_id] = true;
          if (new Date(p.created_at) >= todayStart) todayCount++;
        });
        setPredictions(existing);
        setSaved(savedMap);
        setDailyUsed(todayCount);
      }

      const { data: commData } = await supabase
        .from('predictions').select('match_id, predicted_outcome');
      if (commData) {
        const stats: { [key: number]: CommunityStats } = {};
        commData.forEach((p: any) => {
          if (!stats[p.match_id]) stats[p.match_id] = { home: 0, draw: 0, away: 0, total: 0 };
          stats[p.match_id][p.predicted_outcome as 'home' | 'draw' | 'away']++;
          stats[p.match_id].total++;
        });
        setCommunity(stats);
      }
    };
    init();
  }, []);

  const handlePredict = (matchId: number, outcome: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        outcome,
        confidence: prev[matchId]?.confidence || 50,
        predicted_home_score: prev[matchId]?.predicted_home_score,
        predicted_away_score: prev[matchId]?.predicted_away_score,
      },
    }));
  };

  const handleConfidence = (matchId: number, confidence: number) => {
    setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], confidence } }));
  };

  const handleScore = (matchId: number, side: 'predicted_home_score' | 'predicted_away_score', value: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: Math.max(0, Math.min(20, value)) },
    }));
  };

  // ✅ Fixed: calls API route which enforces 8/day limit
  const handleSave = async (matchId: number) => {
    if (!user || !predictions[matchId]?.outcome) return;

    // Check if already saved (update allowed, doesn't count toward limit)
    const isUpdate = saved[matchId];

    // Client-side daily limit check for new predictions
    if (!isUpdate && dailyUsed >= DAILY_LIMIT) {
      alert(`⚠️ Daily limit reached! You can make ${DAILY_LIMIT} new predictions per day. Come back tomorrow!`);
      return;
    }

    setLoading(prev => ({ ...prev, [matchId]: true }));

    const { data: { session } } = await supabase.auth.getSession();

    // ✅ Call API route — enforces server-side daily limit
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
        predicted_outcome: predictions[matchId].outcome,
        confidence_pct: predictions[matchId].confidence,
        predicted_home_score: predictions[matchId].predicted_home_score ?? null,
        predicted_away_score: predictions[matchId].predicted_away_score ?? null,
      }),
    });

    const data = await res.json();
    setLoading(prev => ({ ...prev, [matchId]: false }));

    if (res.status === 429) {
      // Daily limit hit server-side
      alert(`⚠️ ${data.error}`);
      return;
    }

    if (res.ok) {
      setSaved(prev => ({ ...prev, [matchId]: true }));
      if (!isUpdate) {
        setDailyUsed(prev => prev + 1);
      }
      setCommunity(prev => {
        const old = prev[matchId] || { home: 0, draw: 0, away: 0, total: 0 };
        const outcome = predictions[matchId].outcome as 'home' | 'draw' | 'away';
        return { ...prev, [matchId]: { ...old, [outcome]: old[outcome] + 1, total: old.total + 1 } };
      });
    } else {
      alert(`❌ ${data.error || 'Failed to save prediction. Please try again.'}`);
    }
  };

  const remaining = Math.max(0, DAILY_LIMIT - dailyUsed);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <section style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>⚽ World Cup 2026</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px' }}>Predict match outcomes before kick-off. Lock in your confidence.</p>

        {/* ✅ Daily limit counter */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: remaining === 0 ? 'rgba(239,68,68,0.1)' : 'rgba(46,158,94,0.1)', border: `1px solid ${remaining === 0 ? '#EF4444' : '#2E9E5E'}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: remaining === 0 ? '#EF4444' : '#2E9E5E', fontWeight: 'bold' }}>
            {remaining === 0
              ? '⚠️ Daily limit reached — come back tomorrow!'
              : `🎯 Today: ${dailyUsed}/${DAILY_LIMIT} predictions used · ${remaining} remaining`
            }
          </span>
        </div>

        {username !== 'forecaster' && (
          <div>
            <a href={`/u/${username}`} style={{ color: '#2E9E5E', fontSize: '13px', textDecoration: 'none' }}>
              View your journal →
            </a>
          </div>
        )}
      </section>

      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        {matchesLoading ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚽</div>
            <p>Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px', backgroundColor: '#0D2B14', borderRadius: '12px' }}>
            <p>No upcoming matches found.</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              pred={predictions[match.id]}
              isSaved={saved[match.id] ?? false}
              isLoading={loading[match.id] ?? false}
              comm={community[match.id]}
              username={username}
              onPredict={handlePredict}
              onConfidence={handleConfidence}
              onScore={handleScore}
              onSave={handleSave}
            />
          ))
        )}
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation.</p>
      </footer>
    </main>
  );
}
