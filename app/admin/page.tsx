'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'seed' | 'settle'>('seed');

  // Seed state
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  // Settle state
  const [matches, setMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [scores, setScores] = useState<{[key: number]: {home: string, away: string, upset: boolean}}>({});
  const [saving, setSaving] = useState<{[key: number]: boolean}>({});
  const [done, setDone] = useState<{[key: number]: boolean}>({});

  // API actions state
  const [actionLoading, setActionLoading] = useState('');
  const [actionResult, setActionResult] = useState<any>(null);

  // Notify result state
  const [notifyMatchId, setNotifyMatchId] = useState('');
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyResult, setNotifyResult] = useState<any>(null);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
    } else {
      alert('Wrong password');
    }
  };

  if (!auth) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', textAlign: 'center', marginBottom: '20px' }}>Flipseer Admin</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
        />
        <button onClick={handleLogin}
          style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Enter Admin
        </button>
      </div>
    </main>
  );

  const callApi = async (endpoint: string, label: string) => {
    setActionLoading(label);
    setActionResult(null);
    try {
      const res = await fetch(`/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}` },
      });
      const data = await res.json();
      setActionResult({ endpoint, data });
    } catch (err: any) {
      setActionResult({ endpoint, error: err.message });
    }
    setActionLoading('');
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed-matches', {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}` },
      });
      const data = await res.json();
      setSeedResult(data);
      if (data.success) await loadMatches();
    } catch (err: any) {
      setSeedResult({ error: err.message });
    }
    setSeedLoading(false);
  };

  const loadMatches = async () => {
    setMatchesLoading(true);
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('kickoff', { ascending: true });
    setMatches(data || []);
    setMatchesLoading(false);
  };

  const handleSettle = async (matchId: number) => {
    const score = scores[matchId];
    if (!score?.home || !score?.away) return;
    setSaving(prev => ({ ...prev, [matchId]: true }));

    const homeScore = parseInt(score.home);
    const awayScore = parseInt(score.away);
    const match = matches.find(m => m.id === matchId);

    let winner = 'draw';
    if (homeScore > awayScore) winner = match?.home_team;
    else if (awayScore > homeScore) winner = match?.away_team;

    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'completed',
        winner,
        is_upset: score.upset || false,
      })
      .eq('id', matchId);

    setSaving(prev => ({ ...prev, [matchId]: false }));
    if (!error) {
      setDone(prev => ({ ...prev, [matchId]: true }));
      // Auto-fill notify match ID
      setNotifyMatchId(String(matchId));
    } else {
      alert('Error: ' + error.message);
    }
  };

  // Notify result emails
  const handleNotifyResult = async () => {
    if (!notifyMatchId) { alert('Enter a match ID'); return; }
    setNotifyLoading(true);
    setNotifyResult(null);
    try {
      const res = await fetch('/api/notify-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
        },
        body: JSON.stringify({ match_id: parseInt(notifyMatchId) }),
      });
      const data = await res.json();
      setNotifyResult(data);
    } catch (err: any) {
      setNotifyResult({ error: err.message });
    }
    setNotifyLoading(false);
  };

  const apiActions = [
    { label: 'Lock Matches', endpoint: 'lock-matches', desc: 'Lock predictions for upcoming matches' },
    { label: 'Process Results', endpoint: 'process-results', desc: 'Award points for completed matches' },
    { label: 'Notify Users', endpoint: 'notify-matches', desc: 'Send kickoff reminders' },
    { label: 'Award Badges', endpoint: 'award-badges', desc: 'Award badges for recent matches' },
  ];

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#2E9E5E', fontSize: '32px', margin: 0 }}>Flipseer Admin</h1>
          <p style={{ color: '#6B7280', marginTop: '8px' }}>World Cup 2026 Control Panel</p>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '4px', marginBottom: '32px' }}>
          {(['seed', 'settle'] as const).map(tab => (
            <button key={tab}
              onClick={() => { setActiveTab(tab); if (tab === 'settle' && matches.length === 0) loadMatches(); }}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === tab ? '#1A7A4A' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {tab === 'seed' ? 'Seed & Control' : 'Settle Results'}
            </button>
          ))}
        </div>

        {/* SEED & CONTROL TAB */}
        {activeTab === 'seed' && (
          <div>
            {/* Seed Matches */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ color: '#2E9E5E', marginBottom: '8px', fontSize: '18px' }}>Seed World Cup 2026 Matches</h2>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>Fetch all 104 matches from API-Football and insert into Supabase.</p>
              <button onClick={handleSeed} disabled={seedLoading}
                style={{ backgroundColor: seedLoading ? '#1A3A20' : '#1A7A4A', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', opacity: seedLoading ? 0.7 : 1 }}>
                {seedLoading ? 'Seeding matches...' : 'Seed All Matches'}
              </button>
              {seedResult && (
                <div style={{ marginTop: '16px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '16px' }}>
                  <pre style={{ color: seedResult.success ? '#6EE7B7' : '#FCA5A5', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(seedResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* API Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {apiActions.map((action) => (
                <div key={action.endpoint} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '2px' }}>{action.label}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{action.desc}</div>
                  </div>
                  <button
                    onClick={() => callApi(action.endpoint, action.label)}
                    disabled={actionLoading === action.label}
                    style={{ backgroundColor: actionLoading === action.label ? '#1A3A20' : '#1A7A4A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', minWidth: '70px' }}>
                    {actionLoading === action.label ? '...' : 'Run'}
                  </button>
                </div>
              ))}
            </div>

            {/* NOTIFY RESULT EMAILS -- NEW */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #F59E0B', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ color: '#F59E0B', marginBottom: '8px', fontSize: '18px' }}>Send Result Notifications</h2>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
                Email all predictors with their result, points breakdown, accuracy and streak.
                Run after "Process Results" is complete.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                <input
                  type="number"
                  placeholder="Match ID (e.g. 42)"
                  value={notifyMatchId}
                  onChange={e => setNotifyMatchId(e.target.value)}
                  style={{ flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #F59E0B', backgroundColor: '#0D1F0F', color: 'white', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={handleNotifyResult}
                  disabled={notifyLoading}
                  style={{ backgroundColor: notifyLoading ? '#1A3A20' : '#92400E', color: 'white', border: '1px solid #F59E0B', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', opacity: notifyLoading ? 0.7 : 1 }}>
                  {notifyLoading ? 'Sending...' : 'Send Result Emails'}
                </button>
              </div>
              <p style={{ color: '#4B5563', fontSize: '11px', margin: 0 }}>
                Tip: Match ID auto-fills when you settle a match in the Settle tab.
              </p>
              {notifyResult && (
                <div style={{ marginTop: '16px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '16px' }}>
                  <pre style={{ color: notifyResult.success ? '#6EE7B7' : '#FCA5A5', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(notifyResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {actionResult && (
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: '#2E9E5E', marginBottom: '12px', fontSize: '14px' }}>Result: /{actionResult.endpoint}</h3>
                <pre style={{ color: '#D1FAE5', fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(actionResult.data || actionResult.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* SETTLE RESULTS TAB */}
        {activeTab === 'settle' && (
          <div>
            <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>
              Enter final scores to award points. Tick "Upset" for underdog wins.
            </p>

            {matchesLoading && <p style={{ color: '#2E9E5E', textAlign: 'center' }}>Loading matches...</p>}

            {!matchesLoading && matches.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#0D2B14', borderRadius: '12px' }}>
                <p style={{ color: '#6B7280' }}>No matches found. Seed matches first!</p>
                <button onClick={() => setActiveTab('seed')}
                  style={{ marginTop: '12px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Go to Seed Tab
                </button>
              </div>
            )}

            {matches.map(match => (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${done[match.id] ? '#2E9E5E' : match.status === 'completed' ? '#1A7A4A' : '#1A3A20'}`, borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
                  ID: {match.id} &middot; {new Date(match.kickoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} &middot; {match.league} &middot; <span style={{ color: match.status === 'completed' ? '#2E9E5E' : match.status === 'locked' ? '#F59E0B' : '#6B7280' }}>{match.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', minWidth: '120px', fontSize: '14px' }}>{match.home_team}</span>
                  <input type="number" min="0" max="20"
                    placeholder={match.home_score ?? '0'}
                    value={scores[match.id]?.home || ''}
                    onChange={e => setScores(prev => ({ ...prev, [match.id]: { ...prev[match.id], home: e.target.value }}))}
                    style={{ width: '56px', padding: '8px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
                  />
                  <span style={{ color: '#6B7280' }}>-</span>
                  <input type="number" min="0" max="20"
                    placeholder={match.away_score ?? '0'}
                    value={scores[match.id]?.away || ''}
                    onChange={e => setScores(prev => ({ ...prev, [match.id]: { ...prev[match.id], away: e.target.value }}))}
                    style={{ width: '56px', padding: '8px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
                  />
                  <span style={{ fontWeight: 'bold', minWidth: '120px', fontSize: '14px' }}>{match.away_team}</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F59E0B', cursor: 'pointer' }}>
                    <input type="checkbox"
                      checked={scores[match.id]?.upset || false}
                      onChange={e => setScores(prev => ({ ...prev, [match.id]: { ...prev[match.id], upset: e.target.checked }}))}
                      style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
                    />
                    Upset
                  </label>
                  <button
                    onClick={() => handleSettle(match.id)}
                    disabled={saving[match.id] || done[match.id]}
                    style={{ marginLeft: 'auto', padding: '8px 20px', backgroundColor: done[match.id] ? '#1A3A20' : '#1A7A4A', color: done[match.id] ? '#6EE7B7' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    {done[match.id] ? 'Done' : saving[match.id] ? 'Saving...' : 'Settle'}
                  </button>
                </div>
                {done[match.id] && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '8px', fontSize: '12px', color: '#F59E0B' }}>
                    Match settled! Go to Seed tab and send result notification emails (Match ID: {match.id})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
