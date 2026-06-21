'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const COUNTRIES = [
  { code: 'IN', label: '&#x1F1EE;&#x1F1F3; India' },
  { code: 'ID', label: '&#x1F1EE;&#x1F1E9; Indonesia' },
  { code: 'NG', label: '&#x1F1F3;&#x1F1EC; Nigeria' },
  { code: 'BR', label: '&#x1F1E7;&#x1F1F7; Brazil' },
  { code: 'AR', label: '&#x1F1E6;&#x1F1F7; Argentina' },
  { code: 'GB', label: '&#x1F3F4; England' },
  { code: 'US', label: '&#x1F1FA;&#x1F1F8; USA' },
  { code: 'DE', label: '&#x1F1E9;&#x1F1EA; Germany' },
  { code: 'FR', label: '&#x1F1EB;&#x1F1F7; France' },
  { code: 'ES', label: '&#x1F1EA;&#x1F1F8; Spain' },
  { code: 'PT', label: '&#x1F1F5;&#x1F1F9; Portugal' },
  { code: 'IT', label: '&#x1F1EE;&#x1F1F9; Italy' },
  { code: 'MX', label: '&#x1F1F2;&#x1F1FD; Mexico' },
  { code: 'NL', label: '&#x1F1F3;&#x1F1F1; Netherlands' },
  { code: 'TR', label: '&#x1F1F9;&#x1F1F7; Turkey' },
  { code: 'SA', label: '&#x1F1F8;&#x1F1E6; Saudi Arabia' },
  { code: 'MA', label: '&#x1F1F2;&#x1F1E6; Morocco' },
  { code: 'JP', label: '&#x1F1EF;&#x1F1F5; Japan' },
  { code: 'KR', label: '&#x1F1F0;&#x1F1F7; South Korea' },
  { code: 'CO', label: '&#x1F1E8;&#x1F1F4; Colombia' },
  { code: 'GH', label: '&#x1F1EC;&#x1F1ED; Ghana' },
  { code: 'ZA', label: '&#x1F1FF;&#x1F1E6; South Africa' },
  { code: 'EG', label: '&#x1F1EA;&#x1F1EC; Egypt' },
  { code: 'PK', label: '&#x1F1F5;&#x1F1F0; Pakistan' },
  { code: 'BD', label: '&#x1F1E7;&#x1F1E9; Bangladesh' },
  { code: 'AU', label: '&#x1F1E6;&#x1F1FA; Australia' },
  { code: 'CA', label: '&#x1F1E8;&#x1F1E6; Canada' },
  { code: 'UZ', label: '&#x1F1FA;&#x1F1FF; Uzbekistan' },
  { code: 'HR', label: '&#x1F1ED;&#x1F1F7; Croatia' },
  { code: 'SE', label: '&#x1F1F8;&#x1F1EA; Sweden' },
  { code: 'NO', label: '&#x1F1F3;&#x1F1F4; Norway' },
  { code: 'OTHER', label: '&#x1F30D; Other' },
];

const COMPETITION_TABS = [
  { key: 'all', label: 'All', icon: '&#x26BD;' },
  { key: 'World Cup 2026', label: 'World Cup', icon: '&#x1F3C6;' },
  { key: 'EPL 2026/27', label: 'EPL', icon: '&#x1F3F4;' },
  { key: 'Champions League', label: 'UCL', icon: '&#x2B50;' },
  { key: 'La Liga', label: 'La Liga', icon: '&#x1F1EA;&#x1F1F8;' },
];

const UPCOMING_COMPETITIONS = [
  { name: 'EPL 2026/27', icon: '&#x1F3F4;', date: 'Aug 2026' },
  { name: 'Champions League', icon: '&#x2B50;', date: 'Sep 2026' },
  { name: 'La Liga', icon: '&#x1F1EA;&#x1F1F8;', date: 'Sep 2026' },
];

const BADGE_COLORS: { [key: string]: string } = {
  score_master: '#3B82F6',
  upset_king: '#8B5CF6',
  match_hero: '#F59E0B',
  bold_caller: '#EF4444',
  hot_streak_5: '#FB923C',
  hot_streak_7: '#F59E0B',
  hot_streak_10: '#EF4444',
  founding_forecaster: '#F59E0B',
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
  const shareText = hasResult
    ? 'I predicted ' + outcomeLabel + ' in ' + matchName + ' with ' + prediction.confidence_pct + '% confidence - ' + (won ? 'earned +' + prediction.points_earned + ' pts!' : 'got it wrong this time') + '\n\nSee my full record: ' + profileUrl + '\n\nBuild your football reputation at flipseer.com'
    : 'I just predicted ' + outcomeLabel + ' in ' + matchName + ' with ' + prediction.confidence_pct + '% confidence!\n\nSee my record: ' + profileUrl + '\n\n#WorldCup2026 #Flipseer';
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(profileUrl);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(46,158,94,0.3)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A7A4A, #2E9E5E)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>&#x26BD; FLIPSEER</span>
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
              <div style={{ textAlign: 'center', backgroundColor: won ? 'rgba(46,158,94,0.15)' : 'rgba(127,29,29,0.15)', border: '1px solid ' + (won ? '#2E9E5E' : '#7F1D1D'), borderRadius: '8px', padding: '8px', fontSize: '14px', fontWeight: 'bold', color: won ? '#6EE7B7' : '#FCA5A5' }}>
                {won ? '+' + prediction.points_earned + ' pts earned' : '0 pts - Missed this one'}
              </div>
            ) : (
              <div style={{ textAlign: 'center', backgroundColor: 'rgba(107,114,128,0.1)', border: '1px solid #374151', borderRadius: '8px', padding: '8px', fontSize: '13px', color: '#6B7280' }}>
                Awaiting result
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
            {[
              { name: 'X', label: 'X', bg: '#000000', url: 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl },
              { name: 'Facebook', label: 'f', bg: '#1877F2', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&quote=' + encodedText },
              { name: 'WhatsApp', label: 'W', bg: '#25D366', url: 'https://wa.me/?text=' + encodedText },
            ].map(({ name, label, bg, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', backgroundColor: bg, color: 'white', padding: '12px 8px', borderRadius: '12px', textDecoration: 'none' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{label}</span>
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

// ── PREDICTION HISTORY WITH COMPETITION FILTER ──
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
      const query = supabase
        .from('predictions')
        .select('*, matches(home_team, away_team, home_score, away_score, status, kickoff, competition)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      const { data } = await query;
      if (data) setPreds(data);
      setLoading(false);
    };
    fetchPreds();
  }, [userId]);

  // Filter by competition tab
  const filtered = activeCompetition === 'all'
    ? preds
    : preds.filter(p => (p.matches?.competition || 'World Cup 2026') === activeCompetition);

  if (loading) return <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading predictions...</div>;

  if (filtered.length === 0) {
    const isUpcoming = UPCOMING_COMPETITIONS.some(c => c.name === activeCompetition);
    return (
      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x1F4D6;</div>
        {isUpcoming ? (
          <>
            <p style={{ color: '#2E9E5E', fontSize: '15px', marginBottom: '8px', fontWeight: 'bold' }}>Coming Soon</p>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>
              {activeCompetition} predictions will appear here once the season starts.
            </p>
          </>
        ) : (
          <>
            <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '8px' }}>No predictions yet</p>
            <p style={{ color: '#4B5563', fontSize: '13px', marginBottom: '20px' }}>
              {activeCompetition === 'all' ? 'Every prediction you make will live here forever.' : 'No ' + activeCompetition + ' predictions yet.'}
            </p>
          </>
        )}
        <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
          Make Your First Prediction &#x2192;
        </a>
      </div>
    );
  }

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
      <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6B7280' }}>
        {filtered.length} prediction{filtered.length !== 1 ? 's' : ''}
        {activeCompetition !== 'all' ? ' in ' + activeCompetition : ' across all competitions'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <div key={p.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (hasResult ? (won ? '#2E9E5E' : '#7F1D1D') : '#1A7A4A'), borderRadius: '14px', padding: '18px 20px' }}>

              {/* Competition badge */}
              {activeCompetition === 'all' && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#6B7280', backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', padding: '2px 8px', borderRadius: '999px' }}>
                    &#x26BD; {comp}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{matchName}</span>
                {hasResult ? (
                  <span style={{ fontSize: '12px', backgroundColor: won ? '#1A7A4A' : '#7F1D1D', color: won ? '#6EE7B7' : '#FCA5A5', padding: '3px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                    {won ? '+' + p.points_earned + ' pts &#x2705;' : '0 pts &#x274C;'}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', backgroundColor: '#1A3A20', color: '#6B7280', padding: '3px 10px', borderRadius: '999px' }}>Pending &#x23F3;</span>
                )}
              </div>

              {/* Points breakdown */}
              {won && (p.base_points > 0 || p.exact_bonus > 0 || p.goal_diff_bonus > 0 || p.upset_bonus > 0) && (
                <div style={{ backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.base_points > 0 && <span style={{ fontSize: '11px', color: '#2E9E5E' }}>&#x2705; +{p.base_points}</span>}
                  {p.goal_diff_bonus > 0 && <span style={{ fontSize: '11px', color: '#3B82F6' }}>&#x1F4D0; +{p.goal_diff_bonus}</span>}
                  {p.exact_bonus > 0 && <span style={{ fontSize: '11px', color: '#F59E0B' }}>&#x1F3AF; +{p.exact_bonus}</span>}
                  {p.upset_bonus > 0 && <span style={{ fontSize: '11px', color: '#8B5CF6' }}>&#x1F631; +{p.upset_bonus}</span>}
                  {p.confidence_multiplier > 1 && <span style={{ fontSize: '11px', color: '#FB923C' }}>x{p.confidence_multiplier}</span>}
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
                <button onClick={() => setShareCard({ prediction: p, matchName })}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  &#x1F517; Share
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
          // FIX: use competition not tournament
          const t = p.matches?.competition || 'World Cup 2026';
          if (!grouped[t]) grouped[t] = { pts: 0, correct: 0, total: 0 };
          grouped[t].pts += p.points_earned || 0;
          grouped[t].total += 1;
          if ((p.base_points || 0) > 0) grouped[t].correct += 1;
        });
        const result = Object.entries(grouped).map(([name, stats]) => ({
          name,
          pts: stats.pts,
          correct: stats.correct,
          total: stats.total,
          accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        }));
        setTournaments(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const ICONS: { [key: string]: string } = {
    'World Cup 2026': '&#x1F3C6;',
    'EPL 2026/27': '&#x1F3F4;',
    'Champions League': '&#x2B50;',
    'La Liga': '&#x1F1EA;&#x1F1F8;',
    'Serie A': '&#x1F1EE;&#x1F1F9;',
    'Bundesliga': '&#x1F1E9;&#x1F1EA;',
    'Ligue 1': '&#x1F1EB;&#x1F1F7;',
  };

  if (loading) return null;

  return (
    <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>&#x1F4CA; Competition Breakdown</h2>
      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', overflow: 'hidden' }}>
        {tournaments.length > 0 ? tournaments.map((t) => (
          <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid #1A3A1A' }}>
            <div style={{ fontSize: '24px' }} dangerouslySetInnerHTML={{ __html: ICONS[t.name] || '&#x26BD;' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '3px' }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.total} predictions - {t.correct} correct</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#2E9E5E' }}>{t.pts} pts</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.accuracy}% accuracy</div>
            </div>
          </div>
        )) : (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>&#x1F3C6;</div>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Stats appear after match results are processed.</p>
          </div>
        )}
        {/* Upcoming competitions */}
        <div style={{ padding: '12px 20px', backgroundColor: '#0D1F0F' }}>
          <p style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 10px' }}>COMING SOON</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {UPCOMING_COMPETITIONS.map((t) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '999px', padding: '4px 12px' }}>
                <span style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: t.icon }} />
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{t.name}</span>
                <span style={{ fontSize: '10px', color: '#2E9E5E', fontWeight: 'bold' }}>{t.date}</span>
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
              accuracy_pct: 0, rank: 'Rookie', rank_icon: '&#x1F949;',
            }]).select().single();
            if (newProfile) { setProfile(newProfile); setUsername(newProfile.username); setSelectedCountry(newProfile.country || ''); }
          } else {
            setError(profileError.message);
          }
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
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Loading your profile...</p>
    </main>
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '&#x1F4CA;', color: '#2E9E5E' },
    { key: 'predictions', label: 'Predictions', icon: '&#x1F3AF;', color: '#F59E0B' },
    { key: 'badges', label: 'Badges', icon: '&#x1F3C5;', color: '#8B5CF6' },
    { key: 'settings', label: 'Settings', icon: '&#x2699;', color: '#6B7280' },
  ];

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* HERO HEADER */}
      <section style={{ textAlign: 'center', padding: '40px 20px 24px', background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)' }}>
        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2E9E5E, #1A7A4A)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '36px', boxShadow: '0 0 24px rgba(46,158,94,0.3)' }}>
          &#x26BD;
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', marginBottom: '4px' }}>@{username}</h1>
        <p style={{ color: '#2E9E5E', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>
          {profile?.rank_icon || '&#x1F949;'} {profile?.rank || 'Rookie'} Forecaster
        </p>
        {profile?.country && (
          <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '12px' }}>
            {COUNTRIES.find(c => c.code === profile.country)?.label?.replace(/&#x[^;]+;/g, '').trim() || profile.country}
          </p>
        )}
        {error && (
          <div style={{ backgroundColor: '#7F1D1D', border: '1px solid #EF4444', borderRadius: '8px', padding: '8px 16px', marginBottom: '12px', fontSize: '12px', color: '#FCA5A5', maxWidth: '400px', margin: '0 auto 12px' }}>
            &#x26A0; {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          {badges.length > 0 && (
            <span style={{ backgroundColor: '#1C1A3A', border: '1px solid #3B82F6', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', color: '#93C5FD', fontWeight: 'bold' }}>
              &#x1F3C5; {badges.length} badge{badges.length !== 1 ? 's' : ''}
            </span>
          )}
          <a href={'/u/' + username} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', textDecoration: 'none' }}>
            Public Profile &#x2192;
          </a>
          <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #1A3A1A', color: '#6B7280', padding: '4px 14px', borderRadius: '999px', cursor: 'pointer', fontSize: '12px' }}>
            Sign Out
          </button>
        </div>
      </section>

      {/* QUICK STATS BAR */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0A1A0C 100%)', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A7A4A', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
          {[
            { value: profile?.total_points ?? 0, label: 'TOTAL PTS', color: '#2E9E5E', big: true },
            { value: profile?.prediction_count ?? 0, label: 'PREDICTIONS', color: '#9CA3AF', big: false },
            { value: (profile?.accuracy_pct ?? 0) + '%', label: 'ACCURACY', color: '#F59E0B', big: false },
            { value: (profile?.streak ?? 0), label: 'STREAK &#x1F525;', color: '#EF4444', big: false },
          ].map(({ value, label, color, big }) => (
            <div key={label} style={{ padding: '8px 4px', borderRight: '1px solid #1A3A1A' }}>
              <div style={{ fontSize: big ? '28px' : '22px', fontWeight: 'bold', color, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '9px', color: '#4B5563', marginTop: '4px', letterSpacing: '0.5px' }} dangerouslySetInnerHTML={{ __html: label }} />
            </div>
          ))}
        </div>
      </div>

      {/* COUNTRY REMINDER */}
      {!profile?.country && (
        <div style={{ maxWidth: '600px', margin: '16px auto 0', padding: '0 20px' }}>
          <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>&#x1F30D;</span>
              <div>
                <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '14px' }}>Set your country!</div>
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Appear on the national leaderboard</div>
              </div>
            </div>
            <button onClick={() => setActiveTab('settings')} style={{ backgroundColor: '#F59E0B', color: 'black', padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Set Country &#x2192;
            </button>
          </div>
        </div>
      )}

      {/* MAIN TABS */}
      <div style={{ maxWidth: '600px', margin: '20px auto 0', padding: '0 20px' }}>
        {/* TAB NAVIGATION — bold card style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {tabs.map(({ key, label, icon, color }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                padding: '12px 4px',
                borderRadius: '12px',
                border: '2px solid ' + (activeTab === key ? color : '#1A3A1A'),
                backgroundColor: activeTab === key ? color + '20' : '#0D2B14',
                color: activeTab === key ? color : '#4B5563',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: activeTab === key ? 'bold' : 'normal',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}>
              <span style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: icon }} />
              <span style={{ letterSpacing: '0.5px' }}>{label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Points card */}
            <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 0 32px rgba(46,158,94,0.15)' }}>
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{profile?.total_points ?? 0}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '3px', marginTop: '8px' }}>TOTAL POINTS</div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px' }}>Across all competitions</div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Predictions', value: profile?.prediction_count ?? 0, icon: '&#x1F3AF;' },
                { label: 'Correct', value: profile?.correct_count ?? 0, icon: '&#x2705;' },
                { label: 'Accuracy', value: (profile?.accuracy_pct ?? 0) + '%', icon: '&#x1F4CA;' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '16px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Rank progress */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', marginBottom: '14px' }}>&#x1F3C5; Rank Progress</h3>
              {[
                { rank: 'Rookie', icon: '&#x1F949;', min: 0, max: 49 },
                { rank: 'Predictor', icon: '&#x1F3AF;', min: 50, max: 199 },
                { rank: 'Pro', icon: '&#x2B50;', min: 200, max: 499 },
                { rank: 'Expert', icon: '&#x1F525;', min: 500, max: 999 },
                { rank: 'Legend', icon: '&#x1F451;', min: 1000, max: 9999 },
              ].map(({ rank, icon, min, max }) => {
                const pts = profile?.total_points ?? 0;
                const active = pts >= min && pts <= max;
                return (
                  <div key={rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1A3A1A' }}>
                    <span style={{ fontSize: '13px', color: active ? '#2E9E5E' : '#6B7280', fontWeight: active ? 'bold' : 'normal' }}>
                      <span dangerouslySetInnerHTML={{ __html: icon }} /> {rank}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{min}-{max === 9999 ? 'above' : max} pts</span>
                    {active && <span style={{ fontSize: '11px', backgroundColor: '#1A7A4A', color: 'white', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold' }}>YOU &#x2713;</span>}
                  </div>
                );
              })}
            </div>

            {/* Tournament breakdown */}
            <TournamentBreakdown userId={userId} />

            {/* Quick links */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <a href="/predict" style={{ flex: 1, textAlign: 'center', backgroundColor: '#1A7A4A', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                &#x26BD; Predict Now
              </a>
              <a href={'/u/' + username} style={{ flex: 1, textAlign: 'center', backgroundColor: '#0D2B14', color: '#2E9E5E', border: '1px solid #2E9E5E', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                &#x1F517; Public Profile
              </a>
            </div>
          </div>
        )}

        {/* ── PREDICTIONS TAB ── */}
        {activeTab === 'predictions' && (
          <div>
            {/* Competition filter tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {COMPETITION_TABS.map(({ key, label, icon }) => (
                <button key={key} onClick={() => setActiveCompetition(key)}
                  style={{ flexShrink: 0, padding: '6px 14px', borderRadius: '999px', border: '1px solid', borderColor: activeCompetition === key ? '#2E9E5E' : '#1A3A1A', backgroundColor: activeCompetition === key ? '#1A7A4A' : 'transparent', color: activeCompetition === key ? 'white' : '#6B7280', cursor: 'pointer', fontSize: '12px', fontWeight: activeCompetition === key ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span dangerouslySetInnerHTML={{ __html: icon }} />
                  {label}
                </button>
              ))}
            </div>

            <PredictionHistory
              userId={userId}
              username={username}
              activeCompetition={activeCompetition}
            />
          </div>
        )}

        {/* ── BADGES TAB ── */}
        {activeTab === 'badges' && (
          <div style={{ paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: 0 }}>&#x1F3C5; Your Badges</h2>
              <a href="/how-to-play" style={{ fontSize: '12px', color: '#2E9E5E', textDecoration: 'none' }}>How to earn &#x2192;</a>
            </div>
            {badges.length === 0 ? (
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>&#x1F3C5;</div>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>No badges yet — predict correctly to earn them!</p>
                <a href="/how-to-play" style={{ color: '#2E9E5E', fontSize: '13px', textDecoration: 'none', fontWeight: 'bold' }}>
                  See all badges &#x2192;
                </a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {badges.map((b) => {
                  const color = BADGE_COLORS[b.badge_type] ?? '#2E9E5E';
                  return (
                    <div key={b.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + color + '40', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
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
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div style={{ paddingBottom: '32px' }}>
            {/* Country selector */}
            <div id="country-selector" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>&#x1F30D; Your Nation</h2>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>
                  Your nation determines which leaderboard you compete on. Every prediction earns points for your country.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                      style={{ padding: '6px 12px', borderRadius: '999px', border: '1px solid', borderColor: selectedCountry === c.code ? '#2E9E5E' : '#1A7A4A', backgroundColor: selectedCountry === c.code ? '#1A7A4A' : 'transparent', color: selectedCountry === c.code ? 'white' : '#9CA3AF', fontSize: '12px', cursor: 'pointer' }}
                      dangerouslySetInnerHTML={{ __html: c.label }}
                    />
                  ))}
                </div>
                <button onClick={handleSaveCountry} disabled={savingCountry}
                  style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', opacity: savingCountry ? 0.7 : 1 }}>
                  {savingCountry ? 'Saving...' : 'Save Nation'}
                </button>
                {profile?.country && (
                  <p style={{ fontSize: '12px', color: '#2E9E5E', marginTop: '8px' }}>
                    Current: {COUNTRIES.find(c => c.code === profile.country)?.label?.replace(/&#x[^;]+;(\s*)/g, '') || profile.country}
                  </p>
                )}
              </div>
            </div>

            {/* Account info */}
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px' }}>&#x1F464; Account</h2>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #1A3A1A', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Username</div>
                    <div style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>@{username}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#4B5563' }}>Permanent</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>Member since World Cup 2026</div>
                  <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#6B7280', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                    Sign Out
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
