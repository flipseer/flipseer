'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();
export default function ResultsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [topPredictors, setTopPredictors] = useState<any[]>([]);
  const [loadingPredictors, setLoadingPredictors] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, live: 0, upcoming: 0 });
  const [activeCompetition, setActiveCompetition] = useState('EPL 2026/27');
  const COMPETITIONS = [
    { key: 'EPL 2026/27',      label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL',      color: '#8B5CF6' },
    { key: 'Liga 1 2026/27',   label: '🇮🇩 Liga 1',    color: '#CE1126' },
    { key: 'Ghana PL 2026/27', label: '🇬🇭 Ghana PL',   color: '#F59E0B' },
    { key: 'UCL 2026/27',      label: '⭐ UCL',          color: '#A78BFA' },
    { key: 'World Cup 2026',   label: '🏆 World Cup',   color: '#F59E0B' },
  ];
  useEffect(() => {
    const load = async () => {
      const [matchRes, totalRes, completedRes, liveRes, upcomingRes] = await Promise.all([
        supabase.from('matches').select('id, home_team, away_team, home_score, away_score, kickoff, league, is_upset, winner, status, competition')
          .eq('status', 'completed').eq('competition', activeCompetition)
          .gte('kickoff', activeCompetition === 'UCL 2026/27' ? '2026-09-01' : '2000-01-01')
          .order('kickoff', { ascending: false }),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('competition', activeCompetition),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('competition', activeCompetition)
          .gte('kickoff', activeCompetition === 'UCL 2026/27' ? '2026-09-01' : '2000-01-01'),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'live').eq('competition', activeCompetition),
        supabase.from('matches').select('*', { count: 'exact', head: true }).in('status', ['upcoming', 'locked']).eq('competition', activeCompetition),
      ]);
      setMatches(matchRes.data || []);
      setStats({ total: totalRes.count || 0, completed: completedRes.count || 0, live: liveRes.count || 0, upcoming: upcomingRes.count || 0 });
      setLoading(false);
    };
    load();
  }, [activeCompetition]);
  const loadTopPredictors = async (match: any) => {
    setActiveMatch(match);
    setLoadingPredictors(true);
    const { data: predictions } = await supabase.from('predictions')
      .select('user_id, predicted_outcome, confidence_pct, points_earned, exact_bonus, goal_diff_bonus, upset_bonus, predicted_home_score, predicted_away_score')
      .eq('match_id', match.id).eq('prediction_processed', true)
      .order('points_earned', { ascending: false }).limit(10);
    if (!predictions || predictions.length === 0) { setTopPredictors([]); setLoadingPredictors(false); return; }
    const userIds = predictions.map((p: any) => p.user_id);
    const { data: profiles } = await supabase.from('profiles').select('id, username, rank_icon, rank, country').in('id', userIds);
    const profileMap: { [key: string]: any } = {};
    profiles?.forEach((p: any) => { profileMap[p.id] = p; });
    const enriched = predictions.map((p: any) => ({
      ...p,
      username: profileMap[p.user_id]?.username || 'Unknown',
      rank_icon: profileMap[p.user_id]?.rank_icon || '🥉',
    }));
    setTopPredictors(enriched);
    setLoadingPredictors(false);
  };
  const formatDate = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    return new Date(utc).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  };
  const getOutcomeLabel = (match: any, outcome: string) => {
    if (outcome === 'home') return match.home_team;
    if (outcome === 'away') return match.away_team;
    return 'Draw';
  };
  const activeComp = COMPETITIONS.find(c => c.key === activeCompetition) || COMPETITIONS[0];
  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
        <p style={{ color: '#8B5CF6', fontSize: '18px' }}>Loading match history...</p>
      </div>
    </main>
  );
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '40px 20px 24px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '8px' }}>📊 Match Results</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Results, scores and top predictors</p>
        {/* Competition tabs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
          {COMPETITIONS.map(comp => (
            <button key={comp.key} onClick={() => { setActiveCompetition(comp.key); setActiveMatch(null); setLoading(true); }}
              style={{ padding: '8px 20px', borderRadius: '999px', border: '2px solid ' + (activeCompetition === comp.key ? comp.color : '#1A3A1A'), backgroundColor: activeCompetition === comp.key ? comp.color + '20' : 'transparent', color: activeCompetition === comp.key ? comp.color : '#6B7280', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              {comp.label}
            </button>
          ))}
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: stats.total, color: '#9CA3AF' },
            { label: 'Completed', value: stats.completed, color: '#2E9E5E' },
            ...(stats.live > 0 ? [{ label: 'Live', value: stats.live, color: '#EF4444' }] : []),
            { label: 'Upcoming', value: stats.upcoming, color: activeComp.color },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color, fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px 0' }}>
        {/* TOP PREDICTORS PANEL */}
        {activeMatch && (
          <div style={{ backgroundColor: '#0D2B14', border: '2px solid ' + activeComp.color, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: 0, marginBottom: '4px' }}>🎯 Top Predictors</h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{activeMatch.home_team} {activeMatch.home_score}–{activeMatch.away_score} {activeMatch.away_team}</p>
              </div>
              <button onClick={() => setActiveMatch(null)} style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#6B7280', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Close</button>
            </div>
            {loadingPredictors ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Loading...</p>
            ) : topPredictors.length === 0 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>No processed predictions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPredictors.map((pred, i) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const won = pred.points_earned > 0;
                  return (
                    <div key={pred.user_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', backgroundColor: won ? 'rgba(139,92,246,0.06)' : '#0D1F0F', border: '1px solid ' + (won ? activeComp.color : '#1A3A1A') }}>
                      <div style={{ fontSize: '16px', width: '28px', textAlign: 'center' }}>
                        {i < 3 ? medals[i] : <span style={{ color: '#6B7280', fontWeight: 'bold', fontSize: '13px' }}>#{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{pred.username}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {getOutcomeLabel(activeMatch, pred.predicted_outcome)} · {pred.confidence_pct}% confidence
                          {pred.predicted_home_score !== null && pred.predicted_away_score !== null && (
                            <span> · Predicted: {pred.predicted_home_score}–{pred.predicted_away_score}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: won ? activeComp.color : '#6B7280' }}>
                          {won ? '+' + pred.points_earned : '0'} pts
                        </div>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginTop: '3px' }}>
                          {pred.exact_bonus > 0 && <span style={{ fontSize: '9px', backgroundColor: 'rgba(245,158,11,0.2)', color: '#F59E0B', padding: '1px 6px', borderRadius: '999px' }}>EXACT</span>}
                          {pred.goal_diff_bonus > 0 && <span style={{ fontSize: '9px', backgroundColor: 'rgba(59,130,246,0.2)', color: '#3B82F6', padding: '1px 6px', borderRadius: '999px' }}>DIFF</span>}
                          {pred.upset_bonus > 0 && <span style={{ fontSize: '9px', backgroundColor: 'rgba(139,92,246,0.2)', color: '#8B5CF6', padding: '1px 6px', borderRadius: '999px' }}>UPSET</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* MATCH LIST */}
        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#0D2B14', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h3 style={{ fontFamily: 'Georgia, serif', color: activeComp.color, marginBottom: '8px' }}>No results yet</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
              {activeCompetition === 'EPL 2026/27' ? 'EPL Matchweek 1 starts August 21.'
                : activeCompetition === 'UCL 2026/27' ? 'UCL Group Stage starts September 17.'
                : activeCompetition === 'Liga 1 2026/27' ? 'Liga 1 started September 4 — results coming soon.'
                : activeCompetition === 'Ghana PL 2026/27' ? 'Ghana PL started September 5 — results coming soon.'
                : 'Match results will appear here after kick-off'}
            </p>
            <a href="/predict" style={{ backgroundColor: activeComp.color, color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              Predict Upcoming Matches →
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>{match.league} · {formatDate(match.kickoff)}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {match.is_upset && <span style={{ fontSize: '10px', backgroundColor: 'rgba(139,92,246,0.2)', color: '#8B5CF6', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>UPSET</span>}
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(46,158,94,0.2)', color: '#2E9E5E', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>FT</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 'bold', color: match.winner === 'home' ? 'white' : '#6B7280', flex: 1 }}>{match.home_team}</span>
                  <div style={{ textAlign: 'center', backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '8px 16px', margin: '0 12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: activeComp.color, fontFamily: 'Georgia, serif' }}>{match.home_score} – {match.away_score}</span>
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: 'bold', color: match.winner === 'away' ? 'white' : '#6B7280', flex: 1, textAlign: 'right' }}>{match.away_team}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => loadTopPredictors(match)} style={{ flex: 1, padding: '8px', backgroundColor: activeComp.color, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    🎯 Top Predictors
                  </button>
                  <a href="/predict" style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', color: activeComp.color, border: '1px solid ' + activeComp.color, borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                    ⚽ Predict Next
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
