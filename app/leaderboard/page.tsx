'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const COLORS = {
  page: '#0B1120',
  card: '#111A2E',
  cardAlt: '#0D1626',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  textPrimary: '#F3F4F6',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#8B5CF6',
  accentBg: 'rgba(139,92,246,0.12)',
  success: '#34D399',
  successBg: 'rgba(52,211,153,0.12)',
  danger: '#F87171',
  dangerBg: 'rgba(248,113,113,0.12)',
  warning: '#FBBF24',
  warningBg: 'rgba(251,191,36,0.12)',
};

const COUNTRIES = [
  { code: 'IN', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: 'ID', flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia' },
  { code: 'NG', flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigeria' },
  { code: 'BR', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { code: 'AR', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { code: 'GB', flag: '\u{1F1EC}\u{1F1E7}', name: 'England' },
  { code: 'US', flag: '\u{1F1FA}\u{1F1F8}', name: 'USA' },
  { code: 'DE', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: 'FR', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: 'ES', flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { code: 'PT', flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { code: 'IT', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { code: 'MX', flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico' },
  { code: 'NL', flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands' },
  { code: 'TR', flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkey' },
  { code: 'SA', flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia' },
  { code: 'MA', flag: '\u{1F1F2}\u{1F1E6}', name: 'Morocco' },
  { code: 'JP', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: 'KR', flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea' },
  { code: 'CO', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
  { code: 'GH', flag: '\u{1F1EC}\u{1F1ED}', name: 'Ghana' },
  { code: 'ZA', flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa' },
  { code: 'EG', flag: '\u{1F1EA}\u{1F1EC}', name: 'Egypt' },
  { code: 'PK', flag: '\u{1F1F5}\u{1F1F0}', name: 'Pakistan' },
  { code: 'BD', flag: '\u{1F1E7}\u{1F1E9}', name: 'Bangladesh' },
  { code: 'AU', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: 'CA', flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { code: 'UZ', flag: '\u{1F1FA}\u{1F1FF}', name: 'Uzbekistan' },
  { code: 'HR', flag: '\u{1F1ED}\u{1F1F7}', name: 'Croatia' },
  { code: 'SE', flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden' },
  { code: 'NO', flag: '\u{1F1F3}\u{1F1F4}', name: 'Norway' },
  { code: 'OTHER', flag: '\u{1F30D}', name: 'Other' },
];

const COMPETITION_TABS = [
  { key: 'all', label: 'All' },
  { key: 'EPL 2026/27', label: 'EPL' },
  { key: 'UCL 2026/27', label: 'UCL' },
  { key: 'Liga 1 2026/27', label: 'Liga 1' },
  { key: 'NPFL 2026/27', label: 'NPFL' },
  { key: 'Ghana PL 2026/27', label: 'Ghana PL' },
  { key: 'World Cup 2026', label: 'World Cup' },
];

const UPCOMING_COMPETITIONS = [
  { name: 'EPL 2026/27', date: 'Live now' },
  { name: 'UCL 2026/27', date: 'Live — Oct 13' },
  { name: 'Liga 1 2026/27', date: 'Live now' },
  { name: 'Ghana PL 2026/27', date: 'Live now' },
  { name: 'NPFL 2026/27', date: 'Jan 2027' },
  { name: 'ISL 2026/27', date: 'Oct 10' },
];

const RANK_LADDER = [
  { rank: 'Rookie', min: 0, max: 49 },
  { rank: 'Predictor', min: 50, max: 199 },
  { rank: 'Expert', min: 200, max: 499 },
  { rank: 'Elite', min: 500, max: 999 },
  { rank: 'Legend', min: 1000, max: 9999 },
];

// ── shared card style ──
const cardStyle: React.CSSProperties = {
  backgroundColor: COLORS.card,
  border: `0.5px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: '18px 20px',
};

// ── SHARE CARD MODAL ──
function ShareCard({ prediction, matchName, username, onClose }: {
  prediction: any; matchName: string; username: string; onClose: () => void;
}) {
  const parts = matchName.split(' vs ');
  const home = parts[0] || 'Home';
  const away = parts[1] || 'Away';
  const outcomeLabel = prediction.predicted_outcome === 'home' ? home
    : prediction.predicted_outcome === 'away' ? away : 'Draw';
  const hasResult = prediction.points_earned !== null;
  const won = prediction.points_earned > 0;
  const profileUrl = 'https://flipseer.com/u/' + username;
  const isEPL = (prediction.matches?.competition || '').includes('EPL');
  const hashtag = isEPL ? '#PremierLeague #EPL2027 #Flipseer' : '#WorldCup2026 #Flipseer';
  const shareText = hasResult
    ? 'I predicted ' + outcomeLabel + ' in ' + matchName + ' with ' + prediction.confidence_pct + '% confidence - ' + (won ? 'earned +' + prediction.points_earned + ' pts!' : 'got it wrong this time') + '\n\nSee my full record: ' + profileUrl + '\n\n' + hashtag
    : 'I just predicted ' + outcomeLabel + ' in ' + matchName + ' with ' + prediction.confidence_pct + '% confidence!\n\nSee my record: ' + profileUrl + '\n\n' + hashtag;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(profileUrl);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, backgroundColor: COLORS.card, border: `0.5px solid ${COLORS.borderStrong}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>Flipseer</span>
          <span style={{ fontSize: 11, color: COLORS.textSecondary, backgroundColor: COLORS.cardAlt, padding: '3px 10px', borderRadius: 999 }}>
            {isEPL ? 'Premier League 2026/27' : 'FIFA World Cup 2026'}
          </span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 14, textAlign: 'center' }}>{matchName}</div>
          <div style={{ backgroundColor: COLORS.cardAlt, borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 3 }}>My pick</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.accent }}>{outcomeLabel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 3 }}>Confidence</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.accent }}>{prediction.confidence_pct}%</div>
              </div>
            </div>
            {hasResult ? (
              <div style={{ textAlign: 'center', backgroundColor: won ? COLORS.successBg : COLORS.dangerBg, borderRadius: 8, padding: 8, fontSize: 13, fontWeight: 600, color: won ? COLORS.success : COLORS.danger }}>
                {won ? '+' + prediction.points_earned + ' pts earned' : '0 pts \u00b7 missed this one'}
              </div>
            ) : (
              <div style={{ textAlign: 'center', backgroundColor: COLORS.cardAlt, borderRadius: 8, padding: 8, fontSize: 13, color: COLORS.textMuted }}>
                Awaiting result
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[
              { name: 'X', url: 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl },
              { name: 'Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&quote=' + encodedText },
              { name: 'WhatsApp', url: 'https://wa.me/?text=' + encodedText },
            ].map(({ name, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, textAlign: 'center', backgroundColor: COLORS.cardAlt, border: `0.5px solid ${COLORS.border}`, color: COLORS.textPrimary, padding: '10px 8px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                {name}
              </a>
            ))}
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: `0.5px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: '9px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13, width: '100%' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── PREDICTION HISTORY ──
function PredictionHistory({ userId, username, activeCompetition }: {
  userId: string; username: string; activeCompetition: string;
}) {
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCard, setShareCard] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchPreds = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('predictions')
        .select('*, matches(home_team, away_team, home_score, away_score, status, kickoff, competition)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) setPreds(data);
      setLoading(false);
    };
    fetchPreds();
  }, [userId]);

  const filtered = activeCompetition === 'all'
    ? preds
    : preds.filter(p => (p.matches?.competition || 'World Cup 2026') === activeCompetition);

  if (loading) return <div style={{ textAlign: 'center', padding: 32, color: COLORS.textMuted, fontSize: 13 }}>Loading predictions...</div>;

  if (filtered.length === 0) {
    return (
      <div style={{ ...cardStyle, padding: 40, textAlign: 'center' }}>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 6 }}>No predictions yet</p>
        <p style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 18 }}>
          {activeCompetition === 'all' ? 'Every prediction you make lives here permanently.' : 'No ' + activeCompetition + ' predictions yet.'}
        </p>
        <a href="/predict" style={{ display: 'inline-block', backgroundColor: COLORS.accent, color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
          Predict now
        </a>
      </div>
    );
  }

  return (
    <>
      {shareCard && (
        <ShareCard prediction={shareCard.prediction} matchName={shareCard.matchName} username={username} onClose={() => setShareCard(null)} />
      )}
      <div style={{ marginBottom: 12, fontSize: 12, color: COLORS.textMuted }}>
        {filtered.length} prediction{filtered.length !== 1 ? 's' : ''}
        {activeCompetition !== 'all' ? ' in ' + activeCompetition : ' across all competitions'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((p) => {
          const match = p.matches;
          const homeName = match?.home_team || 'Home';
          const awayName = match?.away_team || 'Away';
          const matchName = homeName + ' vs ' + awayName;
          const outcomeLabel = p.predicted_outcome === 'home' ? homeName
            : p.predicted_outcome === 'away' ? awayName : 'Draw';
          const hasResult = p.points_earned !== null && p.points_earned !== undefined;
          const won = p.points_earned > 0;
          const comp = match?.competition || 'World Cup 2026';
          return (
            <div key={p.id} style={cardStyle}>
              {activeCompetition === 'all' && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, backgroundColor: COLORS.cardAlt, padding: '2px 8px', borderRadius: 999 }}>
                    {comp}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{matchName}</span>
                {hasResult ? (
                  <span style={{ fontSize: 12, backgroundColor: won ? COLORS.successBg : COLORS.dangerBg, color: won ? COLORS.success : COLORS.danger, padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>
                    {won ? '+' + p.points_earned + ' pts' : '0 pts'}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, backgroundColor: COLORS.cardAlt, color: COLORS.textMuted, padding: '3px 10px', borderRadius: 999 }}>Pending</span>
                )}
              </div>
              {won && (p.base_points > 0 || p.exact_bonus > 0 || p.goal_diff_bonus > 0 || p.upset_bonus > 0) && (
                <div style={{ backgroundColor: COLORS.cardAlt, borderRadius: 8, padding: '7px 12px', marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 11 }}>
                  {p.base_points > 0 && <span style={{ color: COLORS.success }}>Correct +{p.base_points}</span>}
                  {p.goal_diff_bonus > 0 && <span style={{ color: COLORS.textSecondary }}>Margin +{p.goal_diff_bonus}</span>}
                  {p.exact_bonus > 0 && <span style={{ color: COLORS.warning }}>Exact score +{p.exact_bonus}</span>}
                  {p.upset_bonus > 0 && <span style={{ color: COLORS.accent }}>Upset +{p.upset_bonus}</span>}
                  {p.confidence_multiplier > 1 && <span style={{ color: COLORS.textMuted }}>x{p.confidence_multiplier} confidence</span>}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13 }}>
                <div>
                  <span style={{ color: COLORS.textMuted }}>Pick </span>
                  <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{outcomeLabel}</span>
                </div>
                <div>
                  <span style={{ color: COLORS.textMuted }}>Confidence </span>
                  <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{p.confidence_pct}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <button onClick={() => setShareCard({ prediction: p, matchName })}
                  style={{ backgroundColor: 'transparent', border: `0.5px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── TOURNAMENT BREAKDOWN ──
function TournamentBreakdown({ userId }: { userId: string }) {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('points_earned, base_points, prediction_processed, matches(competition)')
        .eq('user_id', userId)
        .eq('prediction_processed', true);
      if (data && data.length > 0) {
        const grouped: { [key: string]: { pts: number; correct: number; total: number } } = {};
        data.forEach((p: any) => {
          const t = p.matches?.competition || 'World Cup 2026';
          if (!grouped[t]) grouped[t] = { pts: 0, correct: 0, total: 0 };
          grouped[t].pts += p.points_earned || 0;
          grouped[t].total += 1;
          if ((p.base_points || 0) > 0) grouped[t].correct += 1;
        });
        const result = Object.entries(grouped).map(([name, stats]) => ({
          name, pts: stats.pts, correct: stats.correct, total: stats.total,
          accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        }));
        result.sort((a, b) => (b.name.includes('EPL') ? 1 : 0) - (a.name.includes('EPL') ? 1 : 0));
        setTournaments(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) return null;

  return (
    <section style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>Competition breakdown</h2>
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        {tournaments.length > 0 ? tournaments.map((t) => (
          <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: `0.5px solid ${COLORS.border}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 3 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.total} predictions &middot; {t.correct} correct</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.accent }}>{t.pts} pts</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.accuracy}% accuracy</div>
            </div>
          </div>
        )) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0 }}>Stats appear once match results are processed.</p>
          </div>
        )}
        <div style={{ padding: '12px 18px', backgroundColor: COLORS.cardAlt }}>
          <p style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, letterSpacing: 0.5, margin: '0 0 10px', textTransform: 'uppercase' }}>Competitions</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {UPCOMING_COMPETITIONS.map((t) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 999, padding: '4px 12px' }}>
                <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{t.name}</span>
                <span style={{ fontSize: 10, color: COLORS.textMuted }}>{t.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MAIN PROFILE PAGE ──
export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [savingCountry, setSavingCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCompetition, setActiveCompetition] = useState('all');

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
          if (profileError.code === 'PGRST116') {
            const fallbackUsername = session.user.email?.split('@')[0] || 'user';
            const { data: newProfile } = await supabase.from('profiles').insert([{
              id: uid, username: fallbackUsername, reputation: 0, total_points: 0,
              prediction_count: 0, correct_count: 0, streak: 0, best_streak: 0,
              accuracy_pct: 0, rank: 'Rookie', rank_icon: '\u{1F949}',
            }]).select().single();
            if (newProfile) { setProfile(newProfile); setUsername(newProfile.username); setSelectedCountry(newProfile.country || ''); }
          } else { setError(profileError.message); }
        } else if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username || session.user.email?.split('@')[0] || 'user');
          setSelectedCountry(profileData.country || '');
        }
        const { data: badgeData } = await supabase
          .from('user_badges').select('*').eq('user_id', uid)
          .order('awarded_at', { ascending: false });
        setBadges(badgeData ?? []);
      } catch (err: any) {
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
    <main style={{ backgroundColor: COLORS.page, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: COLORS.textSecondary, fontFamily: 'Arial, sans-serif', fontSize: 14 }}>Loading your profile...</p>
    </main>
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'predictions', label: 'Predictions' },
    { key: 'badges', label: 'Badges' },
    { key: 'settings', label: 'Settings' },
  ];
  const initials = (username || 'FS').slice(0, 2).toUpperCase();
  const countryInfo = COUNTRIES.find(c => c.code === profile?.country);

  return (
    <main style={{ backgroundColor: COLORS.page, minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: COLORS.textPrimary, padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* HEADER CARD */}
        <div style={{ ...cardStyle, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: COLORS.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16, color: COLORS.accent, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>@{username}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>
                {profile?.rank_icon || '\u{1F949}'} {profile?.rank || 'Rookie'} forecaster
                {countryInfo ? ` \u00b7 ${countryInfo.flag} ${countryInfo.name}` : ''}
              </div>
            </div>
            <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: `0.5px solid ${COLORS.border}`, color: COLORS.textMuted, padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 12 }}>
              Sign out
            </button>
          </div>
          {error && (
            <div style={{ backgroundColor: COLORS.dangerBg, borderRadius: 8, padding: '8px 14px', marginTop: 12, fontSize: 12, color: COLORS.danger }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => {
              const url = 'https://flipseer.com/u/' + (profile?.username || '');
              const text = 'My football reputation on Flipseer \u2014 ' + (profile?.total_points ?? 0) + ' points, ' + (profile?.accuracy_pct ?? 0) + '% accuracy';
              if (typeof navigator !== 'undefined' && (navigator as any).share) {
                (navigator as any).share({ title: 'My football reputation \u2014 Flipseer', text, url });
              } else {
                navigator.clipboard.writeText(url);
                alert('Profile link copied');
              }
            }} style={{ flex: 1, backgroundColor: COLORS.accent, color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Share my reputation
            </button>
            <a href="/groups" style={{ flex: 1, textAlign: 'center', backgroundColor: 'transparent', color: COLORS.textSecondary, border: `0.5px solid ${COLORS.border}`, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Challenge a friend
            </a>
          </div>
        </div>

        {/* STAT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { value: profile?.total_points ?? 0, label: 'Points' },
            { value: profile?.prediction_count ?? 0, label: 'Predictions' },
            { value: (profile?.accuracy_pct ?? 0) + '%', label: 'Accuracy' },
            { value: profile?.streak ?? 0, label: 'Streak' },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* COUNTRY REMINDER */}
        {!profile?.country && (
          <div style={{ ...cardStyle, borderColor: 'rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <div>
              <div style={{ color: COLORS.warning, fontWeight: 600, fontSize: 13 }}>Set your country</div>
              <div style={{ color: COLORS.textSecondary, fontSize: 12 }}>Appear on the national leaderboard.</div>
            </div>
            <button onClick={() => setActiveTab('settings')} style={{ backgroundColor: COLORS.warning, color: '#412402', padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Set country
            </button>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding: '10px 4px', borderRadius: 8, border: `0.5px solid ${activeTab === key ? COLORS.accent : COLORS.border}`, backgroundColor: activeTab === key ? COLORS.accentBg : 'transparent', color: activeTab === key ? COLORS.accent : COLORS.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: activeTab === key ? 600 : 400 }}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Rank progress</h3>
              {RANK_LADDER.map(({ rank, min, max }) => {
                const pts = profile?.total_points ?? 0;
                const active = pts >= min && pts <= max;
                const rangeLabel = min + '\u2013' + (max === 9999 ? '+' : max) + ' pts';
                return (
                  <div key={rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: `0.5px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 13, color: active ? COLORS.accent : COLORS.textSecondary, fontWeight: active ? 600 : 400 }}>
                      {rank}
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{rangeLabel}</span>
                    {active && <span style={{ fontSize: 11, backgroundColor: COLORS.accentBg, color: COLORS.accent, padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>You</span>}
                  </div>
                );
              })}
            </div>

            {/* ACHIEVEMENTS PREVIEW — visible by default on Overview, not gated behind the Badges tab */}
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Achievements</h3>
                <button onClick={() => setActiveTab('badges')} style={{ background: 'none', border: 'none', color: COLORS.accent, fontSize: 12, cursor: 'pointer', padding: 0 }}>
                  View all
                </button>
              </div>
              {badges.length === 0 ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{'No badges yet \u2014 predict correctly to earn your first one.'}</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {badges.slice(0, 4).map((b) => (
                    <div key={b.id} style={{ backgroundColor: COLORS.cardAlt, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 20, lineHeight: 1, marginBottom: 4 }}>{b.badge_icon}</div>
                      <div style={{ fontSize: 10, color: COLORS.textSecondary, lineHeight: 1.3 }}>{b.badge_label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <TournamentBreakdown userId={userId} />
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="/predict" style={{ flex: 1, textAlign: 'center', backgroundColor: COLORS.accent, color: '#fff', padding: 12, borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                Predict now
              </a>
              <a href={'/u/' + username} style={{ flex: 1, textAlign: 'center', backgroundColor: 'transparent', color: COLORS.textSecondary, border: `0.5px solid ${COLORS.border}`, padding: 12, borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                Public profile
              </a>
            </div>
          </div>
        )}

        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
              {COMPETITION_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveCompetition(key)}
                  style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 999, border: `0.5px solid ${activeCompetition === key ? COLORS.accent : COLORS.border}`, backgroundColor: activeCompetition === key ? COLORS.accentBg : 'transparent', color: activeCompetition === key ? COLORS.accent : COLORS.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: activeCompetition === key ? 600 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
            <PredictionHistory userId={userId} username={username} activeCompetition={activeCompetition} />
          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <div style={{ paddingBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Your badges</h2>
              <a href="/how-to-play" style={{ fontSize: 12, color: COLORS.accent, textDecoration: 'none' }}>How to earn</a>
            </div>
            {badges.length === 0 ? (
              <div style={{ ...cardStyle, padding: 40, textAlign: 'center' }}>
                <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 14 }}>{'No badges yet \u2014 predict correctly to earn them.'}</p>
                <a href="/predict" style={{ color: COLORS.accent, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Start predicting</a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {badges.map((b) => (
                  <div key={b.id} style={{ backgroundColor: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ fontSize: 22, lineHeight: 1 }}>{b.badge_icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>{b.badge_label}</div>
                      <div style={{ fontSize: 10, color: COLORS.textMuted }}>{new Date(b.awarded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ paddingBottom: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Your nation</h2>
              <div style={cardStyle}>
                <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 12 }}>
                  Your nation determines which leaderboard you compete on. Every prediction earns points for your country.
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                      style={{ padding: '6px 12px', borderRadius: 999, border: `0.5px solid ${selectedCountry === c.code ? COLORS.accent : COLORS.border}`, backgroundColor: selectedCountry === c.code ? COLORS.accentBg : 'transparent', color: selectedCountry === c.code ? COLORS.accent : COLORS.textSecondary, fontSize: 12, cursor: 'pointer' }}>
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
                <button onClick={handleSaveCountry} disabled={savingCountry}
                  style={{ backgroundColor: COLORS.accent, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: savingCountry ? 0.7 : 1 }}>
                  {savingCountry ? 'Saving...' : 'Save nation'}
                </button>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Account</h2>
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `0.5px solid ${COLORS.border}`, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>Username</div>
                    <div style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 600 }}>@{username}</div>
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>Permanent</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>Member since June 2026</div>
                  <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: `0.5px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
