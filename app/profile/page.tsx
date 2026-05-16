'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COUNTRIES = [
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'GB', label: '🇬🇧 UK' },
  { code: 'US', label: '🇺🇸 USA' },
  { code: 'NG', label: '🇳🇬 Nigeria' },
  { code: 'AR', label: '🇦🇷 Argentina' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'ES', label: '🇪🇸 Spain' },
  { code: 'MX', label: '🇲🇽 Mexico' },
  { code: 'ZA', label: '🇿🇦 South Africa' },
  { code: 'OTHER', label: '🌍 Other' },
];

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [savingCountry, setSavingCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

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
      setSelectedCountry(data?.country || '');
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSaveCountry = async () => {
    setSavingCountry(true);
    await supabase.from('profiles').update({ country: selectedCountry }).eq('id', userId);
    setProfile((prev: any) => ({ ...prev, country: selectedCountry }));
    setSavingCountry(false);
  };

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Loading your profile...</p>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <style>{`nav + nav { display: none; }`}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '50px 20px 32px', background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)' }}>
        <div style={{ width: '88px', height: '88px', background: 'linear-gradient(135deg, #2E9E5E, #1A7A4A)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '40px', boxShadow: '0 0 24px rgba(46,158,94,0.3)' }}>⚽</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '4px' }}>@{profile?.username || 'forecaster'}</h1>
        <p style={{ color: '#2E9E5E', fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>
          {profile?.rank_icon || '🥉'} {profile?.rank || 'Rookie'} Forecaster
        </p>
        <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#6B7280', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
          Sign Out
        </button>
      </section>

      {/* POINTS + STATS */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Big points */}
        <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 0 32px rgba(46,158,94,0.15)' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{profile?.total_points ?? 0}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '3px', marginTop: '8px' }}>TOTAL POINTS</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Predictions', value: profile?.prediction_count ?? 0, icon: '🎯' },
            { label: 'Correct', value: profile?.correct_count ?? 0, icon: '✅' },
            { label: 'Accuracy', value: `${profile?.accuracy_pct ?? 0}%`, icon: '📊' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '16px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RANK PROGRESS */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>🏅 Rank Progress</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
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
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{min}–{max === 9999 ? '∞' : max} pts</span>
                {active && <span style={{ fontSize: '11px', backgroundColor: '#1A7A4A', color: 'white', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold' }}>YOU ✓</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* COUNTRY SELECTOR */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>🌍 Your Country</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>Set your country to appear on national leaderboards.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {COUNTRIES.map(c => (
              <button key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                style={{ padding: '6px 12px', borderRadius: '999px', border: '1px solid', borderColor: selectedCountry === c.code ? '#2E9E5E' : '#1A7A4A', backgroundColor: selectedCountry === c.code ? '#1A7A4A' : 'transparent', color: selectedCountry === c.code ? 'white' : '#9CA3AF', fontSize: '12px', cursor: 'pointer' }}>
                {c.label}
              </button>
            ))}
          </div>
          <button onClick={handleSaveCountry} disabled={savingCountry}
            style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            {savingCountry ? 'Saving...' : 'Save Country ✓'}
          </button>
        </div>
      </section>

      {/* FORECAST JOURNAL */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>📖 Forecast Journal</h2>
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
    <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
      <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '8px' }}>Your Forecast Journal is empty</p>
      <p style={{ color: '#4B5563', fontSize: '13px', marginBottom: '20px' }}>Every prediction you make will live here forever.</p>
      <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
        Make Your First Prediction →
      </a>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {preds.map((p) => {
        const match = MATCHES[p.match_id];
        const outcomeLabel = p.predicted_outcome === 'home' ? match?.home : p.predicted_outcome === 'away' ? match?.away : 'Draw';
        const hasResult = p.points_earned !== null && p.points_earned !== undefined;
        const won = p.points_earned > 0;
        return (
          <div key={p.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${hasResult ? (won ? '#2E9E5E' : '#7F1D1D') : '#1A7A4A'}`, borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{match?.home} vs {match?.away}</span>
              {hasResult ? (
                <span style={{ fontSize: '12px', backgroundColor: won ? '#1A7A4A' : '#7F1D1D', color: won ? '#6EE7B7' : '#FCA5A5', padding: '3px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                  {won ? `+${p.points_earned} pts ✅` : '0 pts ❌'}
                </span>
              ) : (
                <span style={{ fontSize: '11px', backgroundColor: '#1A3A20', color: '#6B7280', padding: '3px 10px', borderRadius: '999px' }}>Pending ⏳</span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Pick: </span>
                <span style={{ fontSize: '14px', color: '#2E9E5E', fontWeight: 'bold' }}>{outcomeLabel}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence: </span>
                <span style={{ fontSize: '14px', color: '#2E9E5E', fontWeight: 'bold' }}>{p.confidence_pct}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#4B5563' }}>
                {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I predicted ' + outcomeLabel + ' in ' + match?.home + ' vs ' + match?.away + ' with ' + p.confidence_pct + '% confidence! 🎯⚽ Build your football forecasting reputation at flipseer.com')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#000000', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>𝕏 Share</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://flipseer.com')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1877F2', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>f Share</a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
