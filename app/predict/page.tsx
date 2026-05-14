'use client';
import { useState, useEffect } from 'react';
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

export default function Predict() {
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<{[key: number]: {outcome: string, confidence: number}}>({});
  const [saved, setSaved] = useState<{[key: number]: boolean}>({});
  const [loading, setLoading] = useState<{[key: number]: boolean}>({});

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
          existing[p.match_id] = { outcome: p.predicted_outcome, confidence: p.confidence_pct };
          savedMap[p.match_id] = true;
        });
        setPredictions(existing);
        setSaved(savedMap);
      }
    };
    getUser();
  }, []);

  const handlePredict = (matchId: number, outcome: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { outcome, confidence: prev[matchId]?.confidence || 50 }
    }));
  };

  const handleConfidence = (matchId: number, confidence: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], confidence }
    }));
  };

  const handleSave = async (matchId: number) => {
    if (!user || !predictions[matchId]?.outcome) return;
    setLoading(prev => ({ ...prev, [matchId]: true }));
    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id: matchId,
        predicted_outcome: predictions[matchId].outcome,
        confidence_pct: predictions[matchId].confidence,
      }, { onConflict: 'user_id,match_id' });
    setLoading(prev => ({ ...prev, [matchId]: false }));
    if (!error) setSaved(prev => ({ ...prev, [matchId]: true }));
  };

  const isLocked = (kickoff: string) => new Date() >= new Date(kickoff);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* NAV */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A7A4A', flexWrap: 'wrap', gap: '12px' }}>
        <a href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>FLIPSEER</a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/profile" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>My Profile</a>
          <a href="/leaderboard" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>Leaderboard</a>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>⚽ World Cup 2026</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Predict match outcomes before kick-off. Lock in your confidence.</p>
      </section>

      {/* MATCHES */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        {WC_MATCHES.map((match) => {
          const locked = isLocked(match.kickoff);
          const pred = predictions[match.id];
          const isSaved = saved[match.id];
          const kickoffDate = new Date(match.kickoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

          return (
            <div key={match.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${isSaved ? '#2E9E5E' : '#1A7A4A'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

              {/* MATCH HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Group {match.group} · {kickoffDate}</span>
                {locked && <span style={{ fontSize: '11px', backgroundColor: '#7F1D1D', color: '#FCA5A5', padding: '2px 8px', borderRadius: '4px' }}>LOCKED</span>}
                {isSaved && !locked && <span style={{ fontSize: '11px', backgroundColor: '#1A7A4A', color: '#6EE7B7', padding: '2px 8px', borderRadius: '4px' }}>✅ SAVED</span>}
              </div>

              {/* TEAMS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.home}</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>vs</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.away}</span>
              </div>

              {/* OUTCOME BUTTONS */}
              {!locked && (
                <>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { value: 'home', label: `${match.home} Win` },
                      { value: 'draw', label: 'Draw' },
                      { value: 'away', label: `${match.away} Win` },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handlePredict(match.id, value)}
                        style={{
                          flex: 1, padding: '10px 4px', borderRadius: '8px', border: '1px solid #1A7A4A',
                          backgroundColor: pred?.outcome === value ? '#1A7A4A' : 'transparent',
                          color: pred?.outcome === value ? 'white' : '#9CA3AF',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* CONFIDENCE SLIDER */}
                  {pred?.outcome && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2E9E5E' }}>{pred.confidence}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={pred.confidence}
                        onChange={(e) => handleConfidence(match.id, parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#2E9E5E' }}
                      />
                    </div>
                  )}

                  {/* SAVE BUTTON */}
                  {pred?.outcome && (
                    <button
                      onClick={() => handleSave(match.id)}
                      disabled={loading[match.id]}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {loading[match.id] ? 'Saving...' : isSaved ? 'Update Prediction ✓' : 'Lock In Prediction →'}
                    </button>
                  )}
                </>
              )}

              {/* LOCKED STATE */}
              {locked && pred?.outcome && (
                <div style={{ backgroundColor: '#1A3A20', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6EE7B7' }}>
                    Your pick: <strong>{pred.outcome === 'home' ? match.home : pred.outcome === 'away' ? match.away : 'Draw'}</strong> · {pred.confidence}% confidence
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation.</p>
      </footer>

    </main>
  );
}
