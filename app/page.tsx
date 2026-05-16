'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth'; return; }
      setUserId(user.id);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <style>{`nav + nav { display: none; }`}</style>

      <section style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#1A7A4A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>⚽</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>@{profile?.username || 'forecaster'}</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '10px' }}>Football Forecaster · Flipseer</p>
        <div style={{ display: 'inline-block', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '6px 20px', marginBottom: '16px' }}>
          <span style={{ fontSize: '16px' }}>{profile?.rank_icon || '🥉'}</span>
          <span style={{ color: '#2E9E5E', fontWeight: 'bold', marginLeft: '8px', fontSize: '14px' }}>{profile?.rank || 'Rookie'}</span>
        </div>
        <br />
        <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#9CA3AF', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>
          Sign Out
        </button>
      </section>

      <section style={{ textAlign: 'center', padding: '0 20px 40px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#0D2B14', border: '2px solid #1A7A4A', borderRadius: '16px', padding: '24px 48px' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{profile?.total_points ?? 0}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '2px', marginTop: '4px' }}>TOTAL POINTS</div>
        </div>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Predictions', value: profile?.prediction_count ?? 0 },
            { label: 'Correct', value: profile?.correct_count ?? 0 },
            { label: 'Accuracy', value: `${profile?.accuracy_pct ?? 0}%` },
          ].map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Rank Progress</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '24px' }}>
          {[
            { rank: '🥉 Rookie', min: 0, max: 49 },
            { rank: '🎯 Predictor', min: 50, max: 199 },
            { rank: '⭐ Pro', min: 200, max: 499 },
            { rank: '🔥 Expert', min: 500, max: 999 },
            { rank: '👑 Legend', min: 1000, max: 9999 },
          ].map(({ rank, min, max }) => {
            const pts = profile?.total_points ?? 0;
            const active = pts >= min && pts <= max;
            return (
              <div key={rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1A3A1A' }}>
                <span style={{ fontSize: '14px', color: active ? '#2E9E5E' : '#6B7280', fontWeight: active ? 'bold' : 'normal' }}>{rank}</span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{min}–{max === 9999 ? '∞' : max} pts</span>
                {active && <span style={{ fontSize: '11px', backgroundColor: '#1A7A4A', color: 'white', padding: '2px 8px', borderRadius: '999px' }}>YOU</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>📖 Forecast Journal</h2>
        <PredictionHistory userId={userId} />
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation.</p>
      </footer>
    </main>
  );
}

function PredictionHistory({ userId }: { userId: string }) {
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const MATCHES: { [key: number]: { home: string; away: string } } = {
    1: { home: 'Mexico', away: 'South Africa' },
    2: { home: 'USA', away: 'Canada' },
    3: { home: 'Brazil', away: 'Croatia' },
    4: { home: 'Argentina', away: 'Algeria' },
    5: { home: 'France', away: 'Senegal' },
    6: { home: 'England', away: 'Croatia' },
    7: { home: 'Germany', away: 'Japan' },
    8: { home: 'Spain', away: 'Morocco' },
    9: { home: 'Portugal', away: 'DR Congo' },
    10: { home: 'Netherlands', away: 'Ecuador' },
    11: { home: 'Italy', away: 'Peru' },
    12: { home: 'Colombia', away: 'Cameroon' },
  };

  useEffect(() => {
    if (!userId) return;
    const fetchPreds = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) setPreds(data);
      setLoading(false);
    };
    fetchPreds();
  }, [userId]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading journal...</div>
  );

  if (preds.length === 0) return (
    <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Your prediction history will appear here</p>
      <a href="/predict" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
        Make Your First Prediction →
      </a>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {preds.map((p) => {
        const match = MATCHES[p.match_id];
        const outcomeLabel = p.predicted_outcome === 'home'
          ? match?.home
          : p.predicted_outcome === 'away'
          ? match?.away
          : 'Draw';
        const hasResult = p.points_earned !== null && p.points_earned !== undefined;
        const won = p.points_earned > 0;
        const twitterText = encodeURIComponent(`I predicted ${outcomeLabel} in ${match?.home} vs ${match?.away} with ${p.confidence_pct}% confidence! 🎯⚽ Build your football forecasting reputation at flipseer.com`);
        const fbText = encodeURIComponent(`I predicted ${outcomeLabel} in ${match?.home} vs ${match?.away} with ${p.confidence_pct}% confidence! ⚽ flipseer.com`);

        return (
          <div key={p.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${hasResult ? (won ? '#2E9E5E' : '#7F1D1D') : '#1A7A4A'}`, borderRadius: '12px', padding: '16px 20px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{match?.home} vs {match?.away}</span>
              {hasResult ? (
                <span style={{ fontSize: '12px', backgroundColor: won ? '#1A7A4A' : '#7F1D1D', color: won ? '#6EE7B7' : '#FCA5A5', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold' }}>
                  {won ? `+${p.points_earned} pts ✅` : '0 pts ❌'}
                </span>
              ) : (
                <span style={{ fontSize: '11px', backgroundColor: '#1A3A20', color: '#6B7280', padding: '2px 10px', borderRadius: '999px' }}>Pending ⏳</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Pick: </span>
                <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold' }}>{outcomeLabel}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence: </span>
                <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold' }}>{p.confidence_pct}%</span>
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#4B5563' }}>
                {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                
                  href={`https://twitter.com/intent/tweet?text=${twitterText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#000000', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>
                  𝕏 Share
                </a>
                
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://flipseer.com')}&quote=${fbText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#1877F2', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>
                  f Share
                </a>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
