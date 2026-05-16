import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

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

const WC_MATCHES: { [key: number]: { home: string; away: string } } = {
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

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) return notFound();

  // Fetch predictions
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  const allPreds = predictions || [];
  const settled = allPreds.filter((p: any) => p.points_earned !== null);
  const correct = settled.filter((p: any) => p.points_earned > 0);
  const accuracy = settled.length > 0 ? Math.round((correct.length / settled.length) * 100) : 0;
  const totalPoints = allPreds.reduce((sum: number, p: any) => sum + (p.points_earned || 0), 0);
  const badges = getBadges(allPreds, accuracy);
  const dimensions = getRepDimensions(allPreds, accuracy);
  const flag = COUNTRY_FLAGS[profile.country] || '🌍';
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* REPUTATION HEADER */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1A7A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {username[0].toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>@{username}</h1>
                  <p style={{ color: '#6B7280', fontSize: '13px', margin: '4px 0 0' }}>{flag} {profile.country || 'Global'} · Joined {joinedDate}</p>
                </div>
              </div>
              {profile.favorite_club && (
                <div style={{ display: 'inline-block', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#9CA3AF' }}>
                  ❤️ {profile.favorite_club}
                </div>
              )}
            </div>

            {/* Share button */}
            <a
              href={`https://wa.me/?text=Check out my Flipseer profile: https://flipseer.com/u/${username}`}
              target="_blank"
              style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }}>
              📤 Share Profile
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { value: totalPoints, label: 'Reputation Pts', color: '#2E9E5E' },
              { value: `${accuracy}%`, label: 'Accuracy', color: '#3B82F6' },
              { value: allPreds.length, label: 'Predictions', color: '#8B5CF6' },
              { value: profile.total_points || 0, label: 'Global Pts', color: '#F59E0B' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#0D1F0F', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BADGES */}
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

        {/* REPUTATION DIMENSIONS */}
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
                  <div style={{ width: `${dim.score}%`, height: '100%', backgroundColor: dim.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORECAST JOURNAL */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>📖 Forecast Journal</h2>
          
          {allPreds.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '32px' }}>No predictions yet.</p>
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

              {allPreds.map((pred: any, i: number) => {
                const match = WC_MATCHES[pred.match_id];
                const matchName = match ? `${match.home} vs ${match.away}` : `Match ${pred.match_id}`;
                const isSettled = pred.points_earned !== null;
                const isCorrect = pred.points_earned > 0;
                const pickLabel = pred.predicted_outcome === 'home'
                  ? (match?.home || 'Home') + ' Win'
                  : pred.predicted_outcome === 'away'
                  ? (match?.away || 'Away') + ' Win'
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

        {/* BOTTOM CTA */}
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>This is {username}'s permanent forecasting record on Flipseer.</p>
          <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Build Your Own Record →
          </a>
        </div>

      </div>
    </main>
  );
}

