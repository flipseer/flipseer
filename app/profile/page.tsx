'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

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
  { code: 'PT', label: '🇵🇹 Portugal' },
  { code: 'IT', label: '🇮🇹 Italy' },
  { code: 'MX', label: '🇲🇽 Mexico' },
  { code: 'ID', label: '🇮🇩 Indonesia' },
  { code: 'NL', label: '🇳🇱 Netherlands' },
  { code: 'TR', label: '🇹🇷 Turkey' },
  { code: 'SA', label: '🇸🇦 Saudi Arabia' },
  { code: 'MA', label: '🇲🇦 Morocco' },
  { code: 'JP', label: '🇯🇵 Japan' },
  { code: 'KR', label: '🇰🇷 South Korea' },
  { code: 'CO', label: '🇨🇴 Colombia' },
  { code: 'CL', label: '🇨🇱 Chile' },
  { code: 'PL', label: '🇵🇱 Poland' },
  { code: 'ZA', label: '🇿🇦 South Africa' },
  { code: 'OTHER', label: '🌍 Other' },
];

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [savingCountry, setSavingCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) { window.location.href = '/auth'; return; }

        const uid = session.user.id;
        setUserId(uid);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles').select('*').eq('id', uid).single();

        if (profileError) {
          console.error('Profile fetch error:', profileError.message);
          if (profileError.code !== 'PGRST116') setError(profileError.message);
          if (profileError.code === 'PGRST116') {
            const fallbackUsername = session.user.email?.split('@')[0] || 'user';
            const { data: newProfile } = await supabase.from('profiles').insert([{
              id: uid, username: fallbackUsername, reputation: 0, total_points: 0,
              prediction_count: 0, correct_count: 0, streak: 0, best_streak: 0,
              accuracy_pct: 0, rank: 'Rookie', rank_icon: '🥉',
            }]).select().single();
            if (newProfile) { setProfile(newProfile); setUsername(newProfile.username); setSelectedCountry(newProfile.country || ''); }
          }
        } else if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username || session.user.email?.split('@')[0] || 'user');
          setSelectedCountry(profileData.country || '');
        }

        const { data: badgeData } = await supabase.from('user_badges').select('*')
          .eq('user_id', uid).order('awarded_at', { ascending: false });
        setBadges(badgeData ?? []);
      } catch (err: any) {
        console.error('Profile load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '4px' }}>@{username}</h1>
        <p style={{ color: '#2E9E5E', fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>
          {profile?.rank_icon || '🥉'} {profile?.rank || 'Rookie'} Forecaster
        </p>
        {error && (
          <div style={{ backgroundColor: '#7F1D1D', border: '1px solid #EF4444', borderRadius: '8px', padding: '8px 16px', marginBottom: '12px', fontSize: '12px', color: '#FCA5A5', maxWidth: '400px', margin: '0 auto 12px' }}>
            ⚠️ {error}
          </div>
        )}
        {badges.length > 0 && (
          <div style={{ display: 'inline-block', backgroundColor: '#1C1A3A', border: '1px solid #3B82F6', borderRadius: '999px', padding: '4px 16px', marginBottom: '12px', marginLeft: '8px' }}>
            <span style={{ fontSize: '13px', color: '#93C5FD', fontWeight: 'bold' }}>🏅 {badges.length} badge{badges.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        <br />
        <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#6B7280', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
          Sign Out
        </button>
      </section>

      {/* COUNTRY REMINDER */}
      {!profile?.country && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '14px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🌍</span>
              <div>
                <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '14px' }}>Set your country!</div>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Appear on the national leaderboard</div>
              </div>
            </div>
            <a href="#country-selector" style={{ backgroundColor: '#F59E0B', color: 'black', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Set Country →</a>
          </div>
        </div>
      )}

      {/* POINTS + STATS */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 0 32px rgba(46,158,94,0.15)' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{profile?.total_points ?? 0}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '3px', marginTop: '8px' }}>TOTAL POINTS</div>
        </div>
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

      {/* BADGES */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>🏅 Your Badges</h2>
        {badges.length === 0 ? (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏅</div>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>No badges yet</p>
            <p style={{ color: '#4B5563', fontSize: '12px' }}>Predict correctly to earn badges after match results!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {badges.map((b) => {
              const badgeColors: { [key: string]: string } = {
                score_master: '#3B82F6', upset_king: '#8B5CF6', match_hero: '#F59E0B',
                bold_caller: '#EF4444', hot_streak_5: '#FB923C', hot_streak_7: '#F59E0B', hot_streak_10: '#EF4444',
              };
              const color = badgeColors[b.badge_type] ?? '#2E9E5E';
              return (
                <div key={b.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${color}40`, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px', boxShadow: `0 0 12px ${color}20` }}>
                  <div style={{ fontSize: '28px', lineHeight: 1 }}>{b.badge_icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color, marginBottom: '2px' }}>{b.badge_label}</div>
                    <div style={{ fontSize: '10px', color: '#4B5563' }}>{new Date(b.awarded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
      <section id="country-selector" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>🌍 Your Country</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>Set your country to appear on national leaderboards.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(c.code)}
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
        <PredictionHistory userId={userId} username={username} />
      </section>
    </main>
  );
}

// ── PREDICTION HISTORY — ✅ Fixed: DB join instead of hardcoded MATCHES ──
function PredictionHistory({ userId, username }: { userId: string; username: string }) {
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCard, setShareCard] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchPreds = async () => {
      // ✅ Fixed: join matches table for real match names
      const { data } = await supabase
        .from('predictions')
        .select(`
          *,
          matches (
            home_team,
            away_team,
            home_score,
            away_score,
            status,
            kickoff
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) setPreds(data);
      setLoading(false);
    };
    fetchPreds();
  }, [userId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading journal...</div>;

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
    <>
      {shareCard && (
        <ShareCard
          prediction={shareCard.prediction}
          matchName={shareCard.matchName}
          username={username}
          onClose={() => setShareCard(null)}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {preds.map((p) => {
          const match = p.matches;
          const homeName = match?.home_team || 'Home';
          const awayName = match?.away_team || 'Away';
          const outcomeLabel = p.predicted_outcome === 'home' ? homeName
            : p.predicted_outcome === 'away' ? awayName : 'Draw';
          const hasResult = p.points_earned !== null && p.points_earned !== undefined;
          const won = p.points_earned > 0;

          return (
            <div key={p.id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${hasResult ? (won ? '#2E9E5E' : '#7F1D1D') : '#1A7A4A'}`, borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{homeName} vs {awayName}</span>
                {hasResult ? (
                  <span style={{ fontSize: '12px', backgroundColor: won ? '#1A7A4A' : '#7F1D1D', color: won ? '#6EE7B7' : '#FCA5A5', padding: '3px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                    {won ? `+${p.points_earned} pts ✅` : '0 pts ❌'}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', backgroundColor: '#1A3A20', color: '#6B7280', padding: '3px 10px', borderRadius: '999px' }}>Pending ⏳</span>
                )}
              </div>

              {/* Points breakdown if won */}
              {won && (p.base_points > 0 || p.exact_bonus > 0 || p.goal_diff_bonus > 0 || p.upset_bonus > 0) && (
                <div style={{ backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.base_points > 0 && <span style={{ fontSize: '11px', color: '#2E9E5E' }}>✅ +{p.base_points}</span>}
                  {p.goal_diff_bonus > 0 && <span style={{ fontSize: '11px', color: '#3B82F6' }}>📐 +{p.goal_diff_bonus}</span>}
                  {p.exact_bonus > 0 && <span style={{ fontSize: '11px', color: '#F59E0B' }}>🎯 +{p.exact_bonus}</span>}
                  {p.upset_bonus > 0 && <span style={{ fontSize: '11px', color: '#8B5CF6' }}>😱 +{p.upset_bonus}</span>}
                  {p.confidence_multiplier > 1 && <span style={{ fontSize: '11px', color: '#FB923C' }}>×{p.confidence_multiplier}</span>}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
                <button onClick={() => setShareCard({ prediction: p, matchName: `${homeName} vs ${awayName}` })}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  🔗 Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── SHARE CARD MODAL ──
function ShareCard({ prediction, matchName, username, onClose }: {
  prediction: any;
  matchName: string;
  username: string;
  onClose: () => void;
}) {
  const [home, away] = matchName.split(' vs ');
  const outcomeLabel = prediction.predicted_outcome === 'home' ? home
    : prediction.predicted_outcome === 'away' ? away : 'Draw';
  const hasResult = prediction.points_earned !== null;
  const won = prediction.points_earned > 0;

  const shareText = hasResult
    ? `⚽ I predicted ${outcomeLabel} in ${matchName} with ${prediction.confidence_pct}% confidence — ${won ? `earned +${prediction.points_earned} pts! ✅` : 'got it wrong this time ❌'}\n\nBuild your football reputation at flipseer.com 🏆`
    : `⚽ I just predicted ${outcomeLabel} in ${matchName} with ${prediction.confidence_pct}% confidence!\n\nBuild your permanent football reputation at flipseer.com 🏆 #WorldCup2026`;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent('https://flipseer.com');

  const platforms = [
    { name: 'X', label: '𝕏', bg: '#000000', url: `https://twitter.com/intent/tweet?text=${encodedText}` },
    { name: 'Facebook', label: 'f', bg: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}` },
    { name: 'WhatsApp', label: '📱', bg: '#25D366', url: `https://wa.me/?text=${encodedText}` },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(46,158,94,0.3)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A7A4A, #2E9E5E)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>⚽ FLIPSEER</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '3px 10px', borderRadius: '999px' }}>World Cup 2026</span>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '16px', textAlign: 'center' }}>{matchName}</div>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>MY PICK</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E9E5E' }}>{outcomeLabel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>CONFIDENCE</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E9E5E' }}>{prediction.confidence_pct}%</div>
              </div>
            </div>
            {hasResult ? (
              <div style={{ textAlign: 'center', backgroundColor: won ? 'rgba(46,158,94,0.15)' : 'rgba(127,29,29,0.15)', border: `1px solid ${won ? '#2E9E5E' : '#7F1D1D'}`, borderRadius: '8px', padding: '8px', fontSize: '14px', fontWeight: 'bold', color: won ? '#6EE7B7' : '#FCA5A5' }}>
                {won ? `+${prediction.points_earned} pts earned ✅` : '0 pts · Missed this one ❌'}
              </div>
            ) : (
              <div style={{ textAlign: 'center', backgroundColor: 'rgba(107,114,128,0.1)', border: '1px solid #374151', borderRadius: '8px', padding: '8px', fontSize: '13px', color: '#6B7280' }}>
                ⏳ Awaiting result
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
            {platforms.map(({ name, label, bg, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', backgroundColor: bg, color: 'white', padding: '12px 8px', borderRadius: '12px', textDecoration: 'none' }}>
                <span style={{ fontSize: '18px' }}>{label}</span>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>{name}</span>
              </a>
            ))}
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#6B7280', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', width: '100%' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
