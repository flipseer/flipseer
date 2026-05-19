'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WC_MATCHES = [
  { id: 1, home: 'Mexico', away: 'South Africa', kickoff: '2026-06-11T20:00:00Z', group: 'A' },
  { id: 2, home: 'USA', away: 'Canada', kickoff: '2026-06-12T00:00:00Z', group: 'B' },
  { id: 3, home: 'Brazil', away: 'Croatia', kickoff: '2026-06-12T20:00:00Z', group: 'C' },
  { id: 4, home: 'Argentina', away: 'Algeria', kickoff: '2026-06-13T00:00:00Z', group: 'D' },
  { id: 5, home: 'France', away: 'Senegal', kickoff: '2026-06-13T20:00:00Z', group: 'E' },
  { id: 6, home: 'England', away: 'Croatia', kickoff: '2026-06-14T00:00:00Z', group: 'F' },
  { id: 7, home: 'Germany', away: 'Japan', kickoff: '2026-06-14T20:00:00Z', group: 'G' },
  { id: 8, home: 'Spain', away: 'Morocco', kickoff: '2026-06-15T00:00:00Z', group: 'H' },
  { id: 9, home: 'Portugal', away: 'DR Congo', kickoff: '2026-06-15T20:00:00Z', group: 'I' },
  { id: 10, home: 'Netherlands', away: 'Ecuador', kickoff: '2026-06-16T00:00:00Z', group: 'J' },
  { id: 11, home: 'Italy', away: 'Peru', kickoff: '2026-06-16T20:00:00Z', group: 'K' },
  { id: 12, home: 'Colombia', away: 'Cameroon', kickoff: '2026-06-17T00:00:00Z', group: 'L' },
];

type CommunityStats = {
  home: number;
  draw: number;
  away: number;
  total: number;
};

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(kickoff: string) {
  const LOCK_BEFORE_MS = 2 * 60 * 1000; // lock 2 min before kickoff

  const compute = useCallback(() => {
    const diff = new Date(kickoff).getTime() - Date.now();
    const locked = diff <= LOCK_BEFORE_MS;
    if (locked) return { locked: true, label: '' };
    const totalSecs = Math.floor((diff - LOCK_BEFORE_MS) / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const label = h > 0
      ? `${h}h ${m}m ${s}s`
      : m > 0
      ? `${m}m ${s}s`
      : `${s}s`;
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

// ─── Single match card ────────────────────────────────────────────────────────
function MatchCard({
  match,
  pred,
  isSaved,
  isLoading,
  comm,
  onPredict,
  onConfidence,
  onScore,
  onSave,
}: {
  match: typeof WC_MATCHES[0];
  pred: any;
  isSaved: boolean;
  isLoading: boolean;
  comm: CommunityStats | undefined;
  onPredict: (id: number, outcome: string) => void;
  onConfidence: (id: number, val: number) => void;
  onScore: (id: number, side: 'predicted_home_score' | 'predicted_away_score', val: number) => void;
  onSave: (id: number) => void;
}) {
  const { locked, label: timeLeft } = useCountdown(match.kickoff);

  const kickoffDate = new Date(match.kickoff).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  const getPct = (count: number, total: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  const homePct = comm ? getPct(comm.home, comm.total) : 0;
  const drawPct = comm ? getPct(comm.draw, comm.total) : 0;
  const awayPct = comm ? getPct(comm.away, comm.total) : 0;

  return (
    <div style={{
      backgroundColor: '#0D2B14',
      border: `1px solid ${isSaved ? '#2E9E5E' : '#1A7A4A'}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    }}>

      {/* MATCH HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Group {match.group} · {kickoffDate}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Countdown — shown until locked */}
          {!locked && timeLeft && (
            <span style={{
              fontSize: '11px',
              backgroundColor: '#1C3A1A',
              color: '#F59E0B',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}>
              ⏱ Locks in {timeLeft}
            </span>
          )}
          {locked && (
            <span style={{
              fontSize: '11px',
              backgroundColor: '#7F1D1D',
              color: '#FCA5A5',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              🔒 LOCKED
            </span>
          )}
          {isSaved && !locked && (
            <span style={{
              fontSize: '11px',
              backgroundColor: '#1A7A4A',
              color: '#6EE7B7',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              ✅ SAVED
            </span>
          )}
        </div>
      </div>

      {/* TEAMS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.home}</span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>vs</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.away}</span>
      </div>

      {/* COMMUNITY % SPLIT */}
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
            <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{match.home} {homePct}%</span>
            <span style={{ color: '#6B7280' }}>Draw {drawPct}%</span>
            <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{match.away} {awayPct}%</span>
          </div>
        </div>
      )}

      {/* ── ACTIVE PREDICTION FORM (only when not locked) ── */}
      {!locked && (
        <>
          {/* OUTCOME BUTTONS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[
              { value: 'home', label: `${match.home} Win` },
              { value: 'draw', label: 'Draw' },
              { value: 'away', label: `${match.away} Win` },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onPredict(match.id, value)}
                style={{
                  flex: 1, padding: '10px 4px', borderRadius: '8px',
                  border: '1px solid #1A7A4A',
                  backgroundColor: pred?.outcome === value ? '#1A7A4A' : 'transparent',
                  color: pred?.outcome === value ? 'white' : '#9CA3AF',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* EXACT SCORE */}
          {pred?.outcome && (
            <div style={{ marginBottom: '16px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', textAlign: 'center' }}>
                🎯 Exact Score <span style={{ color: '#2E9E5E', fontSize: '11px' }}>(+25 bonus pts if correct!)</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                {(['predicted_home_score', 'predicted_away_score'] as const).map((side, i) => {
                  const team = i === 0 ? match.home : match.away;
                  const val = i === 0 ? pred.predicted_home_score ?? 0 : pred.predicted_away_score ?? 0;
                  return (
                    <div key={side} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{team}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => onScore(match.id, side, val - 1)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>−</button>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{val}</span>
                        <button onClick={() => onScore(match.id, side, val + 1)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #1A7A4A', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                      </div>
                    </div>
                  );
                })}
                <span style={{ fontSize: '20px', color: '#6B7280', alignSelf: 'center' }}>:</span>
              </div>
            </div>
          )}

          {/* CONFIDENCE SLIDER */}
          {pred?.outcome && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2E9E5E' }}>{pred.confidence}%</span>
              </div>
              <input
                type="range" min="1" max="100"
                value={pred.confidence}
                onChange={(e) => onConfidence(match.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#2E9E5E' }}
              />
            </div>
          )}

          {/* WHO ELSE PICKED THIS */}
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

          {/* SAVE BUTTON */}
          {pred?.outcome && (
            <button
              onClick={() => onSave(match.id)}
              disabled={isLoading}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#1A7A4A', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
              }}>
              {isLoading ? 'Saving...' : isSaved ? 'Update Prediction ✓' : 'Lock In Prediction →'}
            </button>
          )}
        </>
      )}

      {/* ── LOCKED STATE ── */}
      {locked && (
        <div style={{ backgroundColor: '#1A3A20', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          {pred?.outcome ? (
            <span style={{ fontSize: '13px', color: '#6EE7B7' }}>
              Your pick: <strong>{pred.outcome === 'home' ? match.home : pred.outcome === 'away' ? match.away : 'Draw'}</strong>
              {pred.predicted_home_score !== undefined && pred.predicted_away_score !== undefined && (
                <span> · Score: <strong>{pred.predicted_home_score} – {pred.predicted_away_score}</strong></span>
              )}
              {' '}· {pred.confidence}% confidence
            </span>
          ) : (
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              🔒 Predictions closed — no pick recorded for this match
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Predict() {
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<{
    [key: number]: {
      outcome: string;
      confidence: number;
      predicted_home_score?: number;
      predicted_away_score?: number;
    };
  }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [community, setCommunity] = useState<{ [key: number]: CommunityStats }>({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth'; return; }
      setUser(user);
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id);
      if (data) {
        const existing: any = {};
        const savedMap: any = {};
        data.forEach((p: any) => {
          existing[p.match_id] = {
            outcome: p.predicted_outcome,
            confidence: p.confidence_pct,
            predicted_home_score: p.predicted_home_score ?? undefined,
            predicted_away_score: p.predicted_away_score ?? undefined,
          };
          savedMap[p.match_id] = true;
        });
        setPredictions(existing);
        setSaved(savedMap);
      }
    };
    getUser();

    const fetchCommunity = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('match_id, predicted_outcome');
      if (data) {
        const stats: { [key: number]: CommunityStats } = {};
        data.forEach((p: any) => {
          if (!stats[p.match_id]) stats[p.match_id] = { home: 0, draw: 0, away: 0, total: 0 };
          stats[p.match_id][p.predicted_outcome as 'home' | 'draw' | 'away']++;
          stats[p.match_id].total++;
        });
        setCommunity(stats);
      }
    };
    fetchCommunity();
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

  const handleScore = (
    matchId: number,
    side: 'predicted_home_score' | 'predicted_away_score',
    value: number,
  ) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: Math.max(0, Math.min(20, value)) },
    }));
  };

  const handleSave = async (matchId: number) => {
    if (!user || !predictions[matchId]?.outcome) return;

    // ── Double-check lock on submission (server-side guard) ──
    const match = WC_MATCHES.find(m => m.id === matchId);
    if (match && new Date() >= new Date(new Date(match.kickoff).getTime() - 2 * 60 * 1000)) {
      alert('⚠️ Predictions are locked for this match.');
      return;
    }

    setLoading(prev => ({ ...prev, [matchId]: true }));
    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id: matchId,
        predicted_outcome: predictions[matchId].outcome,
        confidence: predictions[matchId].confidence,
        confidence_pct: predictions[matchId].confidence,
        predicted_home_score: predictions[matchId].predicted_home_score ?? null,
        predicted_away_score: predictions[matchId].predicted_away_score ?? null,
      }, { onConflict: 'user_id,match_id' });

    setLoading(prev => ({ ...prev, [matchId]: false }));
    if (!error) {
      setSaved(prev => ({ ...prev, [matchId]: true }));
      setCommunity(prev => {
        const old = prev[matchId] || { home: 0, draw: 0, away: 0, total: 0 };
        const outcome = predictions[matchId].outcome as 'home' | 'draw' | 'away';
        return { ...prev, [matchId]: { ...old, [outcome]: old[outcome] + 1, total: old.total + 1 } };
      });
    }
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>⚽ World Cup 2026</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Predict match outcomes before kick-off. Lock in your confidence.</p>
      </section>

      {/* MATCHES */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        {WC_MATCHES.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            pred={predictions[match.id]}
            isSaved={saved[match.id] ?? false}
            isLoading={loading[match.id] ?? false}
            comm={community[match.id]}
            onPredict={handlePredict}
            onConfidence={handleConfidence}
            onScore={handleScore}
            onSave={handleSave}
          />
        ))}
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation.</p>
      </footer>
    </main>
  );
}
