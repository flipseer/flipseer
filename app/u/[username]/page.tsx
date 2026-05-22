'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COUNTRY_FLAGS: { [key: string]: string } = {
  'India': '🇮🇳', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷',
  'Germany': '🇩🇪', 'England': '🇬🇧', 'Spain': '🇪🇸', 'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱', 'Italy': '🇮🇹', 'Mexico': '🇲🇽', 'USA': '🇺🇸',
  'Nigeria': '🇳🇬', 'Senegal': '🇸🇳', 'Morocco': '🇲🇦', 'Japan': '🇯🇵',
  'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Colombia': '🇨🇴',
  'Other': '🌍',
};

function getBadges(predictions: any[], accuracy: number) {
  const badges = [];
  if (predictions.length >= 5) badges.push({ icon: '🎯', label: 'Committed Forecaster' });
  if (predictions.length >= 10) badges.push({ icon: '📖', label: 'Veteran' });
  if (accuracy >= 70) badges.push({ icon: '🧠', label: 'Sharp Mind' });
  if (accuracy >= 85) badges.push({ icon: '🔮', label: 'Oracle' });
  const upsets = predictions.filter((p: any) => p.upset_bonus > 0);
  if (upsets.length >= 1) badges.push({ icon: '😱', label: 'Upset Hunter' });
  if (upsets.length >= 3) badges.push({ icon: '🦁', label: 'Upset King' });
  const highConf = predictions.filter((p: any) => p.confidence_pct >= 80 && p.points_earned > 0);
  if (highConf.length >= 3) badges.push({ icon: '🔥', label: 'Bold & Right' });
  const exactScore = predictions.filter((p: any) => p.points_earned >= 30);
  if (exactScore.length >= 1) badges.push({ icon: '⚡', label: 'Sniper' });
  return badges;
}

function getRepDimensions(predictions: any[], accuracy: number) {
  const boldness = predictions.filter((p: any) => p.confidence_pct >= 75).length;
  const boldnessScore = Math.min(100, Math.round((boldness / Math.max(predictions.length, 1)) * 100 * 1.5));
  const upsetHunts = predictions.filter((p: any) => p.upset_bonus > 0).length;
  const upsetScore = Math.min(100, upsetHunts * 25);
  const consistency = predictions.length >= 5
    ? Math.min(100, Math.round(accuracy * 0.9 + predictions.length * 2))
    : 0;
  return [
    { label: 'Accuracy', score: Math.round(accuracy), color: '#2E9E5E' },
    { label: 'Boldness', score: boldnessScore, color: '#3B82F6' },
    { label: 'Upset Hunter', score: upsetScore, color: '#F59E0B' },
    { label: 'Consistency', score: consistency, color: '#8B5CF6' },
  ];
}

export default function ForecastJournal({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'pending'>('all');

  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single();

      if (error || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // ✅ FIX 1: Use DB join instead of hardcoded WC_MATCHES
      const { data: predData } = await supabase
        .from('predictions')
        .select(`
          id,
          predicted_outcome,
          predicted_home_score,
          predicted_away_score,
          confidence_pct,
          points_earned,
          is_correct,
          upset_bonus,
          created_at,
          matches (
            home_team,
            away_team,
            home_score,
            away_score,
            kickoff,
            status,
            is_upset
          )
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(100);

      setPredictions((predData as any) || []);
      setLoading(false);
    };

    fetchJournal();
  }, [params.username]);

  const handleShare = async () => {
    const url = `https://flipseer.com/u/${params.username}`;
    const text = `⚽ My World Cup 2026 Forecast Journal\n${profile?.rank_icon} ${profile?.rank} · ${profile?.total_points} pts · ${profile?.accuracy_pct}% accuracy\nMy permanent football record → ${url}`;
    if (navigator.share) {
      await navigator.share({ title: 'My Flipseer Journal', text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ FIX 2: Use profile stats from DB instead of local calculation
  const accuracy = profile?.accuracy_pct || 0;
  const totalPoints = profile?.total_points || 0;
  const badges = getBadges(predictions, accuracy);
  const dimensions = getRepDimensions(predictions, accuracy);

  const filtered = predictions.filter((p: any) => {
    if (filter === 'correct') return p.is_correct === true;
    if (filter === 'wrong') return p.is_correct === false;
    if (filter === 'pending') return p.is_correct === null;
    return true;
  });

  const flag = COUNTRY_FLAGS[profile?.country || ''] || '🌍';
  const joinedDate = profile
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '';

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚽</div>
        <p>Loading forecast journal...</p>
      </div>
    </main>
  );

  if (notFound) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Forecaster not found</h2>
        <p style={{ marginBottom: '24px' }}>@{params.username} hasn't joined Flipseer yet.</p>
        <a href="/auth" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Create Your Record →
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* ── REPUTATION HEADER ── */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1A7A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {params.username[0].toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>@{params.username}</h1>
                  <p style={{ color: '#6B7280', fontSize: '13px', margin: '4px 0 0' }}>
                    {flag} {profile?.country || 'Global'} · Joined {joinedDate}
                  </p>
                </div>
              </div>
              {profile?.favorite_club && (
                <div style={{ display: 'inline-block', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#9CA3AF' }}>
                  ❤️ {profile.favorite_club}
                </div>
              )}
            </div>

            {/* Share buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleShare}
                style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📤 Share'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`⚽ My World Cup 2026 Forecast Journal\n${profile?.rank_icon} ${profile?.rank} · ${totalPoints} pts · ${accuracy}% accuracy\nhttps://flipseer.com/u/${params.username}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '8px', padding: '10px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                📱 WhatsApp
              </a>
            </div>
          </div>

          {/* Stats row — using DB values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { value: totalPoints.toLocaleString(), label: 'Total Points', color: '#2E9E5E' },
              { value: `${accuracy}%`, label: 'Accuracy', color: '#3B82F6' },
              { value: predictions.length, label: 'Predictions', color: '#8B5CF6' },
              { value: profile?.streak || 0, label: 'Streak 🔥', color: '#F59E0B' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#0D1F0F', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BADGES ── */}
        {badges.length > 0 && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>🏅 Badges</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {badges.map((badge, i) => (
                <div key={i} style={{ backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}>
                  {badge.icon} {badge.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REPUTATION DIMENSIONS ── */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>⚡ Reputation Dimensions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dimensions.map((dim, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#D1FAE5' }}>{dim.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: dim.color }}>{dim.score}</span>
                </div>
                <div style={{ backgroundColor: '#0D1F0F', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${dim.score}%`, height: '100%', backgroundColor: dim.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORECAST JOURNAL ── */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>📖 Forecast Journal</h2>

            {/* ✅ Filter tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'correct', 'wrong', 'pending'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '4px 10px', borderRadius: '999px', border: '1px solid', borderColor: filter === f ? '#2E9E5E' : '#1A7A4A', backgroundColor: filter === f ? '#1A7A4A' : 'transparent', color: filter === f ? 'white' : '#9CA3AF', fontSize: '11px', cursor: 'pointer', fontWeight: filter === f ? 'bold' : 'normal' }}>
                  {f === 'all' ? `All (${predictions.length})` :
                   f === 'correct' ? `✅ ${predictions.filter((p:any) => p.is_correct).length}` :
                   f === 'wrong' ? `❌ ${predictions.filter((p:any) => p.is_correct === false).length}` :
                   `⏳ ${predictions.filter((p:any) => p.is_correct === null).length}`}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '32px' }}>No predictions in this category.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', padding: '8px 12px', fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span>Match</span>
                <span>Pick</span>
                <span>Confidence</span>
                <span>Result</span>
                <span>Points</span>
              </div>

              {filtered.map((pred: any, i: number) => {
                // ✅ FIX 1: Use joined match data from DB
                const match = pred.matches;
                const matchName = match
                  ? `${match.home_team} vs ${match.away_team}`
                  : 'Unknown Match';
                const isSettled = pred.points_earned !== null;
                const isCorrect = pred.points_earned > 0;
                const pickLabel = pred.predicted_outcome === 'home'
                  ? (match?.home_team || 'Home') + ' Win'
                  : pred.predicted_outcome === 'away'
                  ? (match?.away_team || 'Away') + ' Win'
                  : 'Draw';

                return (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#0D1F0F',
                    borderRadius: '10px',
                    border: `1px solid ${isSettled ? (isCorrect ? '#1A7A4A' : '#7F1D1D') : '#1A3A20'}`,
                    alignItems: 'center',
                    fontSize: '13px',
                  }}>
                    <span style={{ color: '#D1FAE5', fontWeight: 'bold' }}>{matchName}</span>
                    <span style={{ color: '#9CA3AF' }}>{pickLabel}</span>
                    <span style={{ color: '#2E9E5E' }}>{pred.confidence_pct}%</span>
                    <span>
                      {!isSettled ? (
                        <span style={{ color: '#6B7280' }}>⏳ Pending</span>
                      ) : isCorrect ? (
                        <span style={{ color: '#2E9E5E' }}>✅ Correct</span>
                      ) : (
                        <span style={{ color: '#EF4444' }}>❌ Wrong</span>
                      )}
                    </span>
                    <span style={{ color: isCorrect ? '#2E9E5E' : '#6B7280', fontWeight: 'bold' }}>
                      {isSettled ? `+${pred.points_earned}` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#0D2B14', borderRadius: '16px', border: '1px solid #1A7A4A' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
            This is @{params.username}'s permanent forecasting record on Flipseer.
          </p>
          <a href="/auth" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Build Your Own Record →
          </a>
        </div>

      </div>
    </main>
  );
}
