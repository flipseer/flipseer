'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WC_MATCHES = [
  { id: 1, home: 'Mexico', away: 'South Africa' },
  { id: 2, home: 'USA', away: 'Canada' },
  { id: 3, home: 'Brazil', away: 'Croatia' },
  { id: 4, home: 'Argentina', away: 'Algeria' },
  { id: 5, home: 'France', away: 'Senegal' },
  { id: 6, home: 'England', away: 'Croatia' },
  { id: 7, home: 'Germany', away: 'Japan' },
  { id: 8, home: 'Spain', away: 'Morocco' },
  { id: 9, home: 'Portugal', away: 'DR Congo' },
  { id: 10, home: 'Netherlands', away: 'Ecuador' },
  { id: 11, home: 'Italy', away: 'Peru' },
  { id: 12, home: 'Colombia', away: 'Cameroon' },
];

export default function AdminPage() {
  const [scores, setScores] = useState<{[key: number]: {home: string, away: string}}>({});
  const [saving, setSaving] = useState<{[key: number]: boolean}>({});
  const [done, setDone] = useState<{[key: number]: boolean}>({});
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);

  if (!auth) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>🔐 Admin Access</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', width: '200px', marginBottom: '16px', display: 'block' }}
        />
        <button
          onClick={() => { if (password === 'flipseer2026') setAuth(true); }}
          style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Enter
        </button>
      </div>
    </main>
  );

  const handleSettle = async (matchId: number) => {
    const score = scores[matchId];
    if (!score?.home || !score?.away) return;
    setSaving(prev => ({ ...prev, [matchId]: true }));

    const { error } = await supabase
      .from('matches')
      .upsert({
        id: matchId,
        home_score: parseInt(score.home),
        away_score: parseInt(score.away),
        status: 'finished',
      }, { onConflict: 'id' });

    setSaving(prev => ({ ...prev, [matchId]: false }));
    if (!error) setDone(prev => ({ ...prev, [matchId]: true }));
    else alert('Error: ' + error.message);
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#2E9E5E', marginBottom: '8px' }}>⚙️ Match Results Settler</h1>
        <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '14px' }}>Enter final scores to auto-assign points to all predictors.</p>

        {WC_MATCHES.map(match => (
          <div key={match.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${done[match.id] ? '#2E9E5E' : '#1A7A4A'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 'bold', minWidth: '120px' }}>{match.home}</span>
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                value={scores[match.id]?.home || ''}
                onChange={e => setScores(prev => ({ ...prev, [match.id]: { ...prev[match.id], home: e.target.value }}))}
                style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
              />
              <span style={{ color: '#6B7280' }}>—</span>
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                value={scores[match.id]?.away || ''}
                onChange={e => setScores(prev => ({ ...prev, [match.id]: { ...prev[match.id], away: e.target.value }}))}
                style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
              />
              <span style={{ fontWeight: 'bold', minWidth: '120px' }}>{match.away}</span>
              <button
                onClick={() => handleSettle(match.id)}
                disabled={saving[match.id] || done[match.id]}
                style={{ marginLeft: 'auto', padding: '8px 20px', backgroundColor: done[match.id] ? '#1A3A20' : '#1A7A4A', color: done[match.id] ? '#6EE7B7' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                {done[match.id] ? '✅ Done' : saving[match.id] ? 'Saving...' : 'Settle →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
