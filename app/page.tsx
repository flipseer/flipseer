'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import InviteBanner from '@/components/InviteBanner';
const supabase = createClient();
const COUNTRY_FLAGS: { [key: string]: string } = {
  'India': '&#x1F1EE;&#x1F1F3;', 'Brazil': '&#x1F1E7;&#x1F1F7;',
  'Argentina': '&#x1F1E6;&#x1F1F7;', 'France': '&#x1F1EB;&#x1F1F7;',
  'Germany': '&#x1F1E9;&#x1F1EA;', 'England': '&#x1F3F4;',
  'Spain': '&#x1F1EA;&#x1F1F8;', 'Portugal': '&#x1F1F5;&#x1F1F9;',
  'Netherlands': '&#x1F1F3;&#x1F1F1;', 'Italy': '&#x1F1EE;&#x1F1F9;',
  'Mexico': '&#x1F1F2;&#x1F1FD;', 'USA': '&#x1F1FA;&#x1F1F8;',
  'Nigeria': '&#x1F1F3;&#x1F1EC;', 'Senegal': '&#x1F1F8;&#x1F1F3;',
  'Morocco': '&#x1F1F2;&#x1F1E6;', 'Japan': '&#x1F1EF;&#x1F1F5;',
  'South Korea': '&#x1F1F0;&#x1F1F7;', 'Australia': '&#x1F1E6;&#x1F1FA;',
  'Canada': '&#x1F1E8;&#x1F1E6;', 'Indonesia': '&#x1F1EE;&#x1F1E9;',
  'Other': '&#x1F30D;',
  'IN': '&#x1F1EE;&#x1F1F3;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'FR': '&#x1F1EB;&#x1F1F7;',
  'DE': '&#x1F1E9;&#x1F1EA;', 'GB': '&#x1F3F4;',
  'ES': '&#x1F1EA;&#x1F1F8;', 'PT': '&#x1F1F5;&#x1F1F9;',
  'NL': '&#x1F1F3;&#x1F1F1;', 'IT': '&#x1F1EE;&#x1F1F9;',
  'MX': '&#x1F1F2;&#x1F1FD;', 'US': '&#x1F1FA;&#x1F1F8;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'SN': '&#x1F1F8;&#x1F1F3;',
  'MA': '&#x1F1F2;&#x1F1E6;', 'JP': '&#x1F1EF;&#x1F1F5;',
  'ID': '&#x1F1EE;&#x1F1E9;', 'ZA': '&#x1F1FF;&#x1F1E6;',
  'GH': '&#x1F1EC;&#x1F1ED;', 'CO': '&#x1F1E8;&#x1F1F4;',
  'AU': '&#x1F1E6;&#x1F1FA;', 'CA': '&#x1F1E8;&#x1F1E6;',
  'TR': '&#x1F1F9;&#x1F1F7;', 'KR': '&#x1F1F0;&#x1F1F7;',
  'SA': '&#x1F1F8;&#x1F1E6;', 'PK': '&#x1F1F5;&#x1F1F0;',
  'BD': '&#x1F1E7;&#x1F1E9;', 'EG': '&#x1F1EA;&#x1F1EC;',
};
// ── LIVE ACTIVITY FEED ──
function LiveActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const fetchActivity = async () => {
    try {
      const { data } = await supabase
        .from('predictions')
        .select('predicted_outcome, confidence_pct, points_earned, prediction_processed, created_at, user_id, profiles(username, country)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) {
        const seen = new Set<string>();
        const unique = data.filter((p: any) => {
          if (!p.profiles?.username || seen.has(p.user_id)) return false;
          seen.add(p.user_id);
          return true;
        }).slice(0, 5);
        const items = unique.map((p: any) => {
          const diffMin = Math.floor((Date.now() - new Date(p.created_at).getTime()) / 60000);
          const timeAgo = diffMin < 1 ? 'just now' : diffMin < 60 ? diffMin + 'm ago' : diffMin < 1440 ? Math.floor(diffMin / 60) + 'h ago' : Math.floor(diffMin / 1440) + 'd ago';
          const pick = p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw';
          const country = p.profiles?.country || '';
          return { username: p.profiles.username, flag: COUNTRY_FLAGS[country] || '&#x1F30D;', pick, confidence: p.confidence_pct, points: p.points_earned, processed: p.prediction_processed, timeAgo };
        });
        setActivities(items);
      }
    } catch (e) {}
  };
  useEffect(() => {
    setMounted(true);
    fetchActivity();
    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, []);
  if (!mounted) return null;
  return (
    <section style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '16px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>RECENT ACTIVITY</span>
          <span style={{ fontSize: '11px', color: '#8895A3', marginLeft: 'auto' }}>Latest predictions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '8px', padding: '8px 12px' }}>
              <span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: a.flag }} />
              <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold' }}>@{a.username}</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {a.processed && a.points > 0
                  ? <><span>gained </span><span style={{ color: '#F59E0B', fontWeight: 'bold' }}>+{a.points} pts</span></>
                  : <><span>predicted </span><span style={{ color: 'white', fontWeight: 'bold' }}>{a.pick}</span><span> · </span><span style={{ color: '#8B5CF6' }}>{a.confidence}%</span></>
                }
              </span>
              <span style={{ fontSize: '10px', color: '#8895A3', marginLeft: 'auto' }}>{a.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ── LIVE SCORECARD WITH COMMENTARY ──
function LiveScoreCard() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [matchEvents, setMatchEvents] = useState<{ [key: number]: any[] }>({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [mounted, setMounted] = useState(false);
  const fetchLive = async () => {
    try {
      const res = await fetch('/api/live-scores');
      const data = await res.json();
      if (data.live && data.live.length > 0) {
        setLiveMatches(data.live);
        setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        const evMap: { [key: number]: any[] } = {};
        await Promise.all(data.live.map(async (match: any) => {
          if (!match.api_id && !match.id) return;
          const fixtureId = match.api_id || match.id;
          try {
            const evRes = await fetch('/api/match-events?fixture=' + fixtureId);
            if (evRes.ok) {
              const evData = await evRes.json();
              if (evData?.events) evMap[fixtureId] = evData.events;
            }
          } catch (e) {}
        }));
        setMatchEvents(evMap);
      } else {
        setLiveMatches([]);
      }
    } catch (e) { setLiveMatches([]); }
  };
  useEffect(() => {
    setMounted(true);
    fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => clearInterval(interval);
  }, []);
  if (!mounted || liveMatches.length === 0) return null;
  return (
    <section style={{ backgroundColor: '#0A1A0A', borderTop: '2px solid #EF4444', borderBottom: '1px solid #1A3A1A', padding: '16px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#EF4444', letterSpacing: '2px' }}>LIVE NOW</span>
          </div>
          {lastUpdated && <span style={{ fontSize: '10px', color: '#4B5563' }}>Updated {lastUpdated}</span>}
        </div>
        {liveMatches.map((match) => {
          const fixtureId = match.api_id || match.id;
          const evs = matchEvents[fixtureId] || [];
          return (
            <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #EF444440', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
              {/* Score row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: evs.length > 0 ? '12px' : '0' }}>
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold', minWidth: '44px', textAlign: 'center' }}>{match.elapsed ? match.elapsed + "'" : 'LIVE'}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', flex: 1, textAlign: 'right' }}>{match.home}</span>
                  <div style={{ backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '6px', padding: '4px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B5CF6', fontFamily: 'Georgia, serif' }}>{match.home_score} - {match.away_score}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', flex: 1 }}>{match.away}</span>
                </div>
              </div>
              {/* Last 3 events — goals, cards, subs */}
              {evs.length > 0 && (
                <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {evs.map((ev: any, i: number) => {
                    const isGoal = ev.type === 'Goal';
                    const isYellow = ev.detail === 'Yellow Card';
                    const isRed = ev.detail === 'Red Card';
                    const isSub = ev.type === 'subst';
                    const isPenalty = ev.detail === 'Penalty';
                    const isOwnGoal = ev.detail === 'Own Goal';
                    const isMissedPen = ev.detail === 'Missed Penalty';
                    const icon = isGoal ? '⚽' : isYellow ? '🟨' : isRed ? '🟥' : isSub ? '🔄' : '📣';
                    const color = isGoal ? '#2E9E5E' : isYellow ? '#F59E0B' : isRed ? '#EF4444' : isSub ? '#8B5CF6' : '#6B7280';
                    const player = ev.player?.name?.split(' ').pop() || '';
                    const assist = ev.assist?.name?.split(' ').pop() || '';
                    const team = ev.team?.name || '';
                    // Generate short commentary text
                    let text = '';
                    if (isGoal && isPenalty) text = `GOAL! ${player} converts from the spot — ${team}`;
                    else if (isGoal && isOwnGoal) text = `Own goal by ${player} — ${team}`;
                    else if (isGoal) text = `GOAL! ${player}${assist ? ' (assist: ' + assist + ')' : ''} — ${team}`;
                    else if (isMissedPen) text = `${player} misses the penalty — ${team}`;
                    else if (isRed) text = `${player} is sent off — ${team}`;
                    else if (isYellow) text = `${player} booked — ${team}`;
                    else if (isSub) text = `${player} on${assist ? ' for ' + assist : ''} — ${team}`;
                    else text = `${player} — ${ev.detail}`;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                        <span style={{ fontSize: '10px', color: '#8895A3', minWidth: '28px', fontWeight: 'bold' }}>{ev.time?.elapsed}&apos;</span>
                        <span style={{ fontSize: '14px' }}>{icon}</span>
                        <span style={{ fontSize: '12px', color, fontWeight: isGoal ? 'bold' : 'normal', lineHeight: 1.4 }}>{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <a href="/predict" style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}>
            🎯 Predict upcoming matches →
          </a>
        </div>
      </div>
    </section>
  );
}
// ── UPCOMING MATCHES ──
function UpcomingMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select('id, home_team, away_team, kickoff, status, league, competition')
        .eq('competition', 'EPL 2026/27')
        .in('status', ['upcoming', 'live'])
        .order('kickoff', { ascending: true })
        .limit(5);
      setMatches(data || []);
      setLoading(false);
    };
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);
  const formatKickoff = (kickoff: string) => {
    const utcString = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const date = new Date(utcString);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzMap: { [key: string]: string } = { 'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST', 'Africa/Lagos': 'WAT', 'Asia/Jakarta': 'WIB', 'America/New_York': 'EDT', 'Europe/London': 'BST', 'America/Sao_Paulo': 'BRT', 'Asia/Tokyo': 'JST' };
    const formatted = date.toLocaleString('en-GB', { timeZone: tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
    return formatted + (tzMap[tz] ? ' ' + tzMap[tz] : '');
  };
  const getCountdown = (kickoff: string) => {
    const utcString = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const diff = new Date(utcString).getTime() - now.getTime();
    if (diff <= 0) return null;
    const totalSecs = Math.floor(diff / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 24) return null;
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
  };
  const isLive = (kickoff: string, status: string) => {
    if (status === 'live') return true;
    const utcString = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const diff = now.getTime() - new Date(utcString).getTime();
    return diff > 0 && diff < 105 * 60 * 1000;
  };
  if (loading || matches.length === 0) return null;
  const isEPL = matches.some(m => (m.competition || '').includes('EPL'));
  return (
    <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER LEAGUE 2026/27</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', textAlign: 'center', marginBottom: '6px' }}>Upcoming Matches</h2>
        <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>Predict before kick-off. Your call is locked forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {matches.map((match) => {
            const live = isLive(match.kickoff, match.status);
            const countdown = getCountdown(match.kickoff);
            const utcString = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
            const kickoffPast = new Date(utcString).getTime() < now.getTime();
            return (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (live ? '#8B5CF6' : '#2D1B69'), borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: live ? '0 0 16px rgba(139,92,246,0.15)' : 'none' }}>
                <div style={{ minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
                  {live ? (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px' }}>LIVE</span>
                  ) : countdown ? (
                    <span style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#8B5CF6', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px', border: '1px solid #8B5CF6' }}>{countdown}</span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#6B7280', backgroundColor: 'rgba(127,29,29,0.2)', padding: '2px 8px', borderRadius: '999px' }}>🔒 LOCKED</span>
                  )}
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{formatKickoff(match.kickoff)}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.home_team}</span>
                    <span style={{ fontSize: '11px', color: '#8895A3', fontWeight: 'bold', flexShrink: 0 }}>vs</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.away_team}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '3px' }}>{match.league}</div>
                </div>
                <a href="/predict" style={{ backgroundColor: kickoffPast ? 'transparent' : '#8B5CF6', color: kickoffPast ? '#6B7280' : 'white', border: kickoffPast ? '1px solid #1A3A1A' : 'none', padding: '7px 14px', borderRadius: '7px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {kickoffPast ? 'Locked' : 'Predict →'}
                </a>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ color: '#8B5CF6', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>View all EPL Matchweek 1 fixtures →</a>
        </div>
      </div>
    </section>
  );
}
// ── CLAIM MODAL ──
function ClaimModal() {
  const [show, setShow] = useState(false);
  const [forecasters, setForecasters] = useState(52);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) return;
      const seen = sessionStorage.getItem('flipseer_claim_modal');
      if (seen) return;
      const fetchData = async () => {
        try {
          const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('prediction_count', 0);
          if (count) setForecasters(count);
        } catch (e) {}
        setTimeout(() => { setShow(true); sessionStorage.setItem('flipseer_claim_modal', '1'); }, 10000);
      };
      fetchData();
    });
  }, []);
  if (!mounted || !show) return null;
  return (
    <>
      <style>{`
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes backdropFade { from { opacity: 0; } to { opacity: 1; } }
        .claim-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: backdropFade 0.3s ease forwards; }
        .claim-box { background: #0D2B14; border: 1px solid #8B5CF6; border-radius: 20px; padding: 28px 24px; max-width: 360px; width: 100%; box-shadow: 0 0 60px rgba(139,92,246,0.25); animation: modalSlideUp 0.4s ease forwards; position: relative; font-family: Arial, sans-serif; }
      `}</style>
      <div className="claim-backdrop" onClick={() => setShow(false)}>
        <div className="claim-box" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShow(false)} style={{ position: 'absolute', top: '12px', right: '14px', background: 'transparent', border: 'none', color: '#8895A3', fontSize: '20px', cursor: 'pointer' }}>×</button>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27 · STARTS AUGUST 21</span>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: 'white', marginBottom: '14px', lineHeight: '1.3' }}>
            <span style={{ color: '#8B5CF6' }}>Earn the EPL Founding</span><br />
            Forecaster badge.<br />
            <span style={{ fontSize: '15px', color: '#9CA3AF' }}>Available Matchweek 1 only.</span>
          </h2>
          <div style={{ backgroundColor: '#050E05', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{forecasters} forecasters</span> already building their reputation
            </div>
            <div style={{ fontSize: '11px', color: '#8895A3', fontStyle: 'italic', marginTop: '8px', borderTop: '1px solid #1A3A1A', paddingTop: '8px' }}>
              Predict before Aug 24. Badge awarded permanently. 🔒
            </div>
          </div>
          <button onClick={() => window.location.href = '/auth'} style={{ width: '100%', padding: '13px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict EPL Free →
          </button>
          <button onClick={() => setShow(false)} style={{ width: '100%', padding: '9px', backgroundColor: 'transparent', color: '#6B7280', border: 'none', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}>
            Maybe Later
          </button>
          <p style={{ fontSize: '10px', color: '#8895A3', textAlign: 'center', marginTop: '8px' }}>Free forever · No betting · No card required</p>
        </div>
      </div>
    </>
  );
}
// ── WELCOME CONFETTI ──
const PARTICLES = [
  { id: 0, left: 5, delay: 0.0, dur: 3.0, icon: '&#x1F3F4;', size: 24 },
  { id: 1, left: 20, delay: 0.3, dur: 2.8, icon: '&#x1F3C6;', size: 18 },
  { id: 2, left: 35, delay: 0.1, dur: 3.2, icon: '&#x2B50;', size: 20 },
  { id: 3, left: 50, delay: 0.5, dur: 2.6, icon: '&#x1F3F4;', size: 28 },
  { id: 4, left: 65, delay: 0.2, dur: 3.5, icon: '&#x1F3C6;', size: 22 },
  { id: 5, left: 80, delay: 0.4, dur: 2.9, icon: '&#x1F3F4;', size: 16 },
  { id: 6, left: 92, delay: 0.1, dur: 3.1, icon: '&#x2B50;', size: 26 },
];
function WelcomeConfetti() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem('flipseer_welcome');
    if (!seen) { setShow(true); sessionStorage.setItem('flipseer_welcome', '1'); setTimeout(() => setShow(false), 4500); }
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      <style>{`
        @keyframes fall { 0% { transform: translateY(-60px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(540deg); opacity: 0; } }
        @keyframes fadeWelcome { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); } 20% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 75% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.9); } }
      `}</style>
      <div style={{ position: 'fixed', top: '50%', left: '50%', textAlign: 'center', animation: 'fadeWelcome 4s forwards', zIndex: 1000, pointerEvents: 'none', backgroundColor: 'rgba(13,31,15,0.92)', border: '2px solid #8B5CF6', borderRadius: '20px', padding: '28px 40px', boxShadow: '0 0 60px rgba(139,92,246,0.4)' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 'bold' }}>Welcome to Flipseer!</div>
        <div style={{ fontSize: '13px', color: '#8B5CF6', marginTop: '6px' }}>Build your permanent football legacy</div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>EPL 2026/27 · Starts Aug 21</div>
      </div>
      {PARTICLES.map((p) => (
        <div key={p.id} dangerouslySetInnerHTML={{ __html: p.icon }}
          style={{ position: 'absolute', left: p.left + '%', top: '-60px', fontSize: p.size + 'px', animation: 'fall ' + p.dur + 's ' + p.delay + 's ease-in forwards' }} />
      ))}
    </div>
  );
}
// ── MAIN HOME PAGE ──
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [heroNation, setHeroNation] = useState('');
  const [nationRank, setNationRank] = useState(0);
  const [nationForecasters, setNationForecasters] = useState(0);
  const [nextMatchCountdown, setNextMatchCountdown] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeForecasters, setActiveForecasters] = useState(0);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [isRealLeaderboard, setIsRealLeaderboard] = useState(false);
  const [realLeaderboard, setRealLeaderboard] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topNations, setTopNations] = useState<any[]>([]);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        const stats = await statsRes.json();
        setTotalPredictions(stats.totalPredictions || 0);
        setTotalUsers(stats.totalUsers || 0);
        setActiveForecasters(stats.activeForecasters || 0);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzToCountry: { [key: string]: string } = {
          'Asia/Calcutta': 'India', 'Asia/Kolkata': 'India', 'Asia/Jakarta': 'Indonesia',
          'Africa/Lagos': 'Nigeria', 'America/Sao_Paulo': 'Brazil', 'America/Buenos_Aires': 'Argentina',
          'America/Argentina/Buenos_Aires': 'Argentina', 'America/Mexico_City': 'Mexico',
          'America/New_York': 'USA', 'America/Chicago': 'USA', 'America/Los_Angeles': 'USA',
          'Europe/London': 'England', 'Europe/Paris': 'France', 'Europe/Berlin': 'Germany',
          'Europe/Madrid': 'Spain', 'Europe/Lisbon': 'Portugal', 'Africa/Accra': 'Ghana',
          'Africa/Johannesburg': 'South Africa', 'Africa/Casablanca': 'Morocco', 'Africa/Cairo': 'Egypt',
          'Asia/Tokyo': 'Japan', 'Asia/Seoul': 'South Korea', 'Asia/Karachi': 'Pakistan',
          'Asia/Dhaka': 'Bangladesh', 'Australia/Sydney': 'Australia', 'America/Toronto': 'Canada',
          'America/Bogota': 'Colombia', 'Asia/Riyadh': 'Saudi Arabia', 'Asia/Tashkent': 'Uzbekistan',
          'Europe/Istanbul': 'Turkey', 'Europe/Zagreb': 'Croatia', 'Europe/Oslo': 'Norway',
        };
        const tzToCode: { [key: string]: string } = {
          'Asia/Calcutta': 'IN', 'Asia/Kolkata': 'IN', 'Asia/Jakarta': 'ID',
          'Africa/Lagos': 'NG', 'America/Sao_Paulo': 'BR', 'America/Buenos_Aires': 'AR',
          'America/Argentina/Buenos_Aires': 'AR', 'America/Mexico_City': 'MX',
          'America/New_York': 'US', 'America/Chicago': 'US', 'America/Los_Angeles': 'US',
          'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
          'Europe/Madrid': 'ES', 'Europe/Lisbon': 'PT', 'Africa/Accra': 'GH',
          'Africa/Johannesburg': 'ZA', 'Africa/Casablanca': 'MA', 'Asia/Tokyo': 'JP',
          'Asia/Seoul': 'KR', 'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD',
          'Australia/Sydney': 'AU', 'America/Toronto': 'CA', 'America/Bogota': 'CO',
          'Asia/Riyadh': 'SA', 'Europe/Istanbul': 'TR', 'Europe/Oslo': 'NO',
        };
        const detectedNation = tzToCountry[tz] || '';
        const visitorCode = tzToCode[tz] || '';
        if (detectedNation) {
          setHeroNation(detectedNation);
          try { localStorage.setItem('flipseer_detected_nation', detectedNation); } catch (e) {}
        }
        let leaderboardData: any[] = [];
        if ((stats.totalUsers || 0) >= 5) {
          const res = await fetch('/api/leaderboard');
          const data = await res.json();
          if (data && Array.isArray(data)) leaderboardData = data;
          if (leaderboardData.length >= 1) {
            const countryMap: { [key: string]: { points: number; forecasters: number } } = {};
            leaderboardData.forEach((u: any) => {
              const c = u.country || 'Other';
              if (!countryMap[c]) countryMap[c] = { points: 0, forecasters: 0 };
              countryMap[c].points += u.total_points || 0;
              countryMap[c].forecasters += 1;
            });
            const ranked = Object.entries(countryMap).sort((a, b) => b[1].points - a[1].points);
            const visitorRankIdx = ranked.findIndex(([c]) => c === visitorCode);
            if (visitorRankIdx >= 0) { setNationRank(visitorRankIdx + 1); setNationForecasters(ranked[visitorRankIdx][1].forecasters); }
            const sorted = ranked.slice(0, 6).map(([country, stats], i) => {
              const countryNames: { [key: string]: string } = { 'IN': 'India', 'ID': 'Indonesia', 'NG': 'Nigeria', 'BR': 'Brazil', 'AR': 'Argentina', 'FR': 'France', 'DE': 'Germany', 'GB': 'England', 'ES': 'Spain', 'PT': 'Portugal', 'MX': 'Mexico', 'US': 'USA', 'GH': 'Ghana', 'ZA': 'South Africa', 'MA': 'Morocco', 'JP': 'Japan', 'KR': 'South Korea', 'AU': 'Australia', 'CA': 'Canada', 'CO': 'Colombia', 'TR': 'Turkey', 'Other': 'Other Nations' };
              return { rank: i + 1, flag: COUNTRY_FLAGS[country] || '&#x1F30D;', country: countryNames[country] || country, forecasters: stats.forecasters, points: stats.points };
            });
            if (sorted.length >= 1) { setRealLeaderboard(sorted); setIsRealLeaderboard(true); }
          }
        }
        // Top users for ticker
        const { data: topU } = await supabase.from('profiles')
          .select('username, total_points, rank_icon, country')
          .gt('total_points', 0)
          .order('total_points', { ascending: false })
          .limit(10);
        if (topU && topU.length > 0) setTopUsers(topU);

        // Top nations for ticker
        const { data: allP } = await supabase.from('profiles').select('country, total_points');
        if (allP) {
          const nationMap: { [key: string]: number } = {};
          allP.forEach((p: any) => {
            if (!p.country) return;
            nationMap[p.country] = (nationMap[p.country] || 0) + (p.total_points || 0);
          });
          const FLAGS: { [key: string]: string } = {
            'IN': '🇮🇳', 'ID': '🇮🇩', 'NG': '🇳🇬', 'BR': '🇧🇷', 'AR': '🇦🇷',
            'GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'GH': '🇬🇭', 'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸',
            'PT': '🇵🇹', 'MX': '🇲🇽', 'US': '🇺🇸', 'MA': '🇲🇦', 'JP': '🇯🇵',
            'KR': '🇰🇷', 'AU': '🇦🇺', 'PK': '🇵🇰', 'BD': '🇧🇩', 'SA': '🇸🇦',
          };
          const NAMES: { [key: string]: string } = {
            'IN': 'India', 'ID': 'Indonesia', 'NG': 'Nigeria', 'BR': 'Brazil',
            'AR': 'Argentina', 'GB': 'England', 'GH': 'Ghana', 'FR': 'France',
            'DE': 'Germany', 'ES': 'Spain', 'PT': 'Portugal', 'MX': 'Mexico',
            'US': 'USA', 'MA': 'Morocco', 'JP': 'Japan', 'KR': 'South Korea',
          };
          const nationsSorted = Object.entries(nationMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([code, pts], idx) => ({
              rank: idx + 1,
              flag: FLAGS[code] || '🌍',
              name: NAMES[code] || code,
              pts,
            }));
          setTopNations(nationsSorted);
        }

        const { data: nextMatch } = await supabase.from('matches').select('kickoff').eq('competition', 'EPL 2026/27').in('status', ['upcoming', 'locked']).order('kickoff', { ascending: true }).limit(1).single();
        if (nextMatch?.kickoff) {
          const utc = nextMatch.kickoff.endsWith('Z') ? nextMatch.kickoff : nextMatch.kickoff.replace(' ', 'T') + 'Z';
          const diff = new Date(utc).getTime() - Date.now();
          if (diff > 0) {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setNextMatchCountdown(h > 0 ? h + 'h ' + m + 'm' : m + 'm');
          }
        }
      } catch (err) { console.error('Data fetch error:', err); }
    };
    fetchData();
  }, []);
  const NATION_TICKERS = [
    { code: 'IN', flag: '&#x1F1EE;&#x1F1F3;', name: 'India' }, { code: 'ID', flag: '&#x1F1EE;&#x1F1E9;', name: 'Indonesia' },
    { code: 'NG', flag: '&#x1F1F3;&#x1F1EC;', name: 'Nigeria' }, { code: 'BR', flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
    { code: 'AR', flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' }, { code: 'FR', flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
    { code: 'DE', flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' }, { code: 'ES', flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain' },
    { code: 'PT', flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' }, { code: 'GB', flag: '&#x1F3F4;', name: 'England' },
    { code: 'MX', flag: '&#x1F1F2;&#x1F1FD;', name: 'Mexico' }, { code: 'US', flag: '&#x1F1FA;&#x1F1F8;', name: 'USA' },
    { code: 'GH', flag: '&#x1F1EC;&#x1F1ED;', name: 'Ghana' }, { code: 'MA', flag: '&#x1F1F2;&#x1F1E6;', name: 'Morocco' },
    { code: 'JP', flag: '&#x1F1EF;&#x1F1F5;', name: 'Japan' }, { code: 'KR', flag: '&#x1F1F0;&#x1F1F7;', name: 'S.Korea' },
    { code: 'AU', flag: '&#x1F1E6;&#x1F1FA;', name: 'Australia' }, { code: 'CA', flag: '&#x1F1E8;&#x1F1E6;', name: 'Canada' },
    { code: 'ZA', flag: '&#x1F1FF;&#x1F1E6;', name: 'S.Africa' }, { code: 'EG', flag: '&#x1F1EA;&#x1F1EC;', name: 'Egypt' },
    { code: 'PK', flag: '&#x1F1F5;&#x1F1F0;', name: 'Pakistan' }, { code: 'BD', flag: '&#x1F1E7;&#x1F1E9;', name: 'Bangladesh' },
    { code: 'NO', flag: '&#x1F1F3;&#x1F1F4;', name: 'Norway' }, { code: 'SE', flag: '&#x1F1F8;&#x1F1EA;', name: 'Sweden' },
  ];
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>
      <ClaimModal />
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes bannerPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes liveBadgePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.75; transform: scale(0.95); } }
        @keyframes ctaPulse { 0%, 100% { box-shadow: 0 0 12px rgba(46,158,94,0.3); } 50% { box-shadow: 0 0 24px rgba(46,158,94,0.6); } }
      `}</style>
      {/* TICKER */}
      <div aria-hidden="true" style={{ backgroundColor: '#050E05', borderBottom: '1px solid #2D1B69', overflow: 'hidden', padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'ticker 40s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {(() => {
            const staticItems = [
              { icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'EPL 2026/27 · Liga 1 · Ghana PL — all live now', isUser: false, color: '#6B7280' },
              { icon: '🌍', text: 'India vs Indonesia vs Nigeria — the Nation Battle is on', isUser: false, color: '#6B7280' },
              { icon: '⚽', text: 'Predict exact scores for up to 108 pts per match — no betting ever', isUser: false, color: '#6B7280' },
              { icon: '🔒', text: 'Your predictions lock at kick-off — permanent proof of your football intelligence', isUser: false, color: '#6B7280' },
              { icon: '🏆', text: 'Represent your nation — every correct call earns points for your country', isUser: false, color: '#6B7280' },
              { icon: '🆓', text: 'Build your permanent football reputation — free forever — no card required', isUser: false, color: '#6B7280' },
            ];
            const userItems = topUsers.map(u => ({
              icon: u.rank_icon || '⚽',
              text: '@' + u.username + ' · ' + u.total_points + ' pts',
              isUser: true,
              color: '#8B5CF6',
            }));
            const nationItems = topNations.map(n => ({
              icon: n.flag,
              text: '#' + n.rank + ' ' + n.name + ' · ' + n.pts + ' pts',
              isUser: true,
              color: '#F59E0B',
            }));
            const allItems = [...staticItems, ...userItems, ...nationItems, ...staticItems, ...userItems, ...nationItems];
            return allItems.map((item, i) => (
              <span key={i} style={{ fontSize: '12px', color: item.isUser ? (item.color || '#8B5CF6') : '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: item.isUser ? 'bold' : 'normal' }}>
                <span>{item.icon}</span> {item.text}
                <span style={{ color: '#2D1B69', marginLeft: '16px' }}>|</span>
              </span>
            ));
          })()}
        </div>
      </div>
      {/* BUZZ BAR */}
      {mounted && totalUsers > 0 && (
        <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '7px 20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {totalPredictions > 0 && (
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>⚡ {totalPredictions}+ predictions made</span>
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>👥 {totalUsers} registered</span> · {activeForecasters} active
            </span>
            {nextMatchCountdown && (
              <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}>⏱ Next match in {nextMatchCountdown}</span>
            )}
          </div>
        </div>
      )}
      {/* LIVE COMPETITIONS PREDICT BANNER */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '10px 20px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '1px', flexShrink: 0, animation: 'bannerPulse 2s ease-in-out infinite' }}>⚡ PREDICT TODAY:</span>
          {[
            { href: '/predict', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'EPL', color: '#8B5CF6', live: true },
            { href: '/predict', flag: '🇮🇩', name: 'Liga 1', color: '#CE1126', live: true },
            { href: '/predict', flag: '🇬🇭', name: 'Ghana PL', color: '#F59E0B', live: true },
            { href: '/predict', flag: '⭐', name: 'UCL', color: '#A78BFA', live: false, soon: 'Sep 17' },
            { href: '/predict', flag: '🇮🇳', name: 'ISL', color: '#FF6B35', live: false, soon: 'Oct 10' },
          ].map(({ href, flag, name, color, live, soon }, i) => (
            <a key={name} href={href} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              backgroundColor: live ? color + '18' : 'transparent',
              border: '1px solid ' + (live ? color + '80' : '#1A3A1A'),
              borderRadius: '999px', padding: '5px 14px', textDecoration: 'none', flexShrink: 0,
              animation: live ? 'bannerGlow 2s ease-in-out infinite' : 'none',
              boxShadow: live ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s ease',
            }}>
              <span style={{ fontSize: '14px' }}>{flag}</span>
              <span style={{ fontSize: '12px', color: live ? color : '#4B5563', fontWeight: 'bold' }}>{name}</span>
              {live
                ? <span style={{
                    fontSize: '9px', backgroundColor: color, color: 'white',
                    padding: '2px 6px', borderRadius: '999px', fontWeight: 'bold',
                    animation: 'liveBadgePulse 1.5s ease-in-out infinite',
                  }}>10/day</span>
                : <span style={{ fontSize: '9px', color: '#4B5563', fontStyle: 'italic' }}>{soon}</span>
              }
            </a>
          ))}
          <a href="/predict" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            backgroundColor: '#2E9E5E', color: 'white',
            borderRadius: '999px', padding: '5px 14px', textDecoration: 'none', flexShrink: 0,
            fontSize: '11px', fontWeight: 'bold',
            animation: 'ctaPulse 1.5s ease-in-out infinite',
            boxShadow: '0 0 16px rgba(46,158,94,0.4)',
          }}>
            Predict Now →
          </a>
        </div>
      </div>

      {/* EPL LAUNCH BANNER */}
      <div style={{ backgroundColor: '#4C1D95', padding: '10px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27 starts August 21 — Earn the EPL Founding Forecaster badge — Free forever
          </span>
          <a href="/predict" style={{ backgroundColor: 'white', color: '#8B5CF6', padding: '4px 16px', borderRadius: '999px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            Predict Now →
          </a>
        </div>
      </div>
      {/* NATION TICKER */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '8px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '6px', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...NATION_TICKERS, ...NATION_TICKERS].map((n, i) => (
            <a key={i} href={'/auth?nation=' + n.code}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', border: '1px solid ' + (heroNation === n.name ? '#8B5CF6' : '#1A3A1A'), backgroundColor: heroNation === n.name ? 'rgba(139,92,246,0.15)' : 'transparent', textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: n.flag }} />
              <span style={{ fontSize: '11px', color: heroNation === n.name ? '#8B5CF6' : '#8895A3', fontWeight: heroNation === n.name ? 'bold' : 'normal' }}>{n.name}</span>
            </a>
          ))}
        </div>
      </div>
      {/* LIVE SCORES + ACTIVITY */}
      <LiveScoreCard />
      <LiveActivity />
      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 64px', maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div suppressHydrationWarning style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '999px', padding: '8px 20px', marginBottom: '40px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>EPL 2026/27 · STARTS AUGUST 21</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: '1.08', marginBottom: '16px', fontWeight: 'bold', animation: 'flicker 8s infinite' }}>
          {heroNation && nationRank > 0 ? (
            <>
              <span style={{ fontSize: 'clamp(32px, 6vw, 56px)', color: '#9CA3AF', display: 'block', marginBottom: '8px', letterSpacing: '-0.5px' }}>{heroNation.toUpperCase()} IS RANKED</span>
              <span style={{ fontSize: 'clamp(80px, 18vw, 140px)', color: '#8B5CF6', display: 'block', lineHeight: '0.9', letterSpacing: '-4px' }}>#{nationRank}</span>
              <span style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#8B5CF6', display: 'block', marginTop: '12px' }}>CAN YOU HELP THEM REACH #1?</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', display: 'block', letterSpacing: '-2px' }}>PROVE YOUR</span>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', color: '#8B5CF6', display: 'block', letterSpacing: '-2px' }}>FOOTBALL</span>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', display: 'block', letterSpacing: '-2px' }}>INTELLIGENCE.</span>
            </>
          )}
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,19px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 28px', fontFamily: 'Georgia, serif' }}>
          Predict EPL matches before kick-off. Build a permanent Football Reputation.{' '}
          <span style={{ color: '#8B5CF6' }}>Represent your country.</span>
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 48px rgba(139,92,246,0.4)', letterSpacing: '0.3px' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict EPL Free →
          </a>
          <a href="/groups" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '18px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', border: '1px solid rgba(245,158,11,0.4)', fontWeight: 'bold' }}>
            🏆 Challenge Friends
          </a>
        </div>
        <p style={{ fontSize: '13px', color: '#8895A3', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Free forever &nbsp;·&nbsp; No betting &nbsp;·&nbsp; No card required
        </p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>
          Already predicting? <a href="/groups" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' }}>Create a private EPL league</a> with your WhatsApp group.
        </p>
        {mounted && (nationForecasters > 0 || nextMatchCountdown) && (
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #2D1B69' }}>
            {nationForecasters > 0 && nationRank > 0 && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                🔥 <strong style={{ color: '#F59E0B' }}>{nationForecasters}</strong> {heroNation} forecasters competing
              </span>
            )}
            {nextMatchCountdown && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                ⏱ Next match locks in <strong style={{ color: '#EF4444' }}>{nextMatchCountdown}</strong>
              </span>
            )}
            {totalUsers > 0 && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                🌍 <strong style={{ color: '#8B5CF6' }}>{totalUsers}</strong> forecasters globally
              </span>
            )}
          </div>
        )}
      </section>
      {/* THREE STEPS */}
      <section style={{ padding: '40px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { num: '1', icon: '🎯', title: 'Predict', desc: 'Choose an EPL match before kick-off. Set your confidence level.' },
              { num: '2', icon: '🔒', title: 'Prove', desc: 'Your call locks forever. No edits. No excuses. Pure record.' },
              { num: '3', icon: '🔁', title: 'Repeat', desc: 'Every match builds your permanent Football Reputation. Forever.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: 12, padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px', marginBottom: 6 }}>STEP {num}</div>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 11, color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* INVITE BANNER */}
      <InviteBanner />
      {/* EPL FOUNDING FORECASTER BADGE SECTION */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg, #1A0B2E 0%, #0D1F0F 100%)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏅</div>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>LIMITED BADGE · MATCHWEEK 1 ONLY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,5vw,36px)', marginBottom: '12px' }}>
            EPL <span style={{ color: '#8B5CF6' }}>Founding Forecaster</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
            Predict any EPL match before August 24 and earn the Founding Forecaster badge permanently on your profile. Never available again after Matchweek 1.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📅</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Available until</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Aug 24, 2026</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Badge type</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Permanent</div>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🆓</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Cost</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Free forever</div>
            </div>
          </div>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
            Claim Your Badge →
          </a>
        </div>
      </section>
      {/* UPCOMING MATCHES */}
      <UpcomingMatches />
      {/* NATION BATTLE */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>NATION BATTLE · LIVE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '34px', marginBottom: '8px' }}>
            {heroNation ? <>Can <span style={{ color: '#8B5CF6' }}>{heroNation}</span> top the world?</> : 'Which nation leads the world?'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '32px' }}>
            Every EPL prediction earns points for your country. The rivalry is real.
          </p>
          {isRealLeaderboard ? (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', overflow: 'hidden', maxWidth: '520px', margin: '0 auto 24px' }}>
              <div style={{ backgroundColor: '#050E05', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                <span>RANK · NATION</span>
                <span style={{ color: '#8B5CF6' }}>LIVE · FORECASTERS · POINTS</span>
              </div>
              {realLeaderboard.map(({ rank, flag, country, forecasters, points }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #1A3A1A' }}>
                  <span style={{ fontSize: '13px', color: rank === 1 ? '#F59E0B' : '#6B7280', fontWeight: 'bold', minWidth: '28px' }}>#{rank}</span>
                  <span style={{ fontSize: '18px', marginRight: '10px' }} dangerouslySetInnerHTML={{ __html: flag }} />
                  <span style={{ flex: 1, fontSize: '14px', color: 'white', textAlign: 'left' }}>{country}</span>
                  <span style={{ fontSize: '11px', color: '#6B7280', marginRight: '12px' }}>{forecasters} forecasters</span>
                  <span style={{ fontSize: '13px', color: rank === 1 ? '#F59E0B' : '#8B5CF6', fontWeight: 'bold' }}>{points} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', maxWidth: '520px', margin: '0 auto 24px', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Your nation needs you.</p>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Predict EPL matches to earn points for your country.</p>
              <a href="/nations" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>View Nation Battle →</a>
            </div>
          )}
          <a href="/nations" style={{ color: '#8B5CF6', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
            Full Nation Battle standings →
          </a>
        </div>
      </section>
      {/* COMPETITIONS HUB */}
      <section style={{ backgroundColor: '#050E05', padding: '56px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '8px', textAlign: 'center' }}>ONE RECORD. EVERY COMPETITION.</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,30px)', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Sign up once. Predict forever.</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>Your reputation grows across every competition. Never resets.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '10px', marginBottom: '28px' }}>
            <a href="/epl" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '2px solid #8B5CF6', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#8B5CF6', fontWeight: 700, backgroundColor: 'rgba(139,92,246,0.15)', padding: '2px 6px', borderRadius: 999, animation: 'pulse 1.5s infinite' }}>NEXT</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Premier League</div>
                <div style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 700, marginBottom: 6 }}>2026/27</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>380 matches<br/>Starts Aug 21</div>
              </div>
            </a>
            <a href="/world-cup-2026" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#F59E0B', fontWeight: 700 }}>✓ DONE</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>World Cup 2026</div>
                <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginBottom: 6 }}>COMPLETE</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>🇪🇸 Spain Champions<br/>104 matches</div>
              </div>
            </a>
            <a href="/predict" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#F59E0B', fontWeight: 700 }}>SEP</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>⭐</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Champions League</div>
                <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginBottom: 6 }}>2026/27</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>Europe's best<br/>Starts Sep 2026</div>
              </div>
            </a>
            <a href="/india" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative', opacity: 0.85 }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#6B7280', fontWeight: 700, backgroundColor: '#1A3A1A', padding: '2px 6px', borderRadius: 999 }}>NOV</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🇮🇳</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Indian Super League</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginBottom: 6 }}>2026/27</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>India's top league<br/>Nov 2026</div>
              </div>
            </a>
            <a href="/nigeria" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(0,128,0,0.25)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative', opacity: 0.8 }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#6B7280', fontWeight: 700, backgroundColor: '#1A3A1A', padding: '2px 6px', borderRadius: 999 }}>2027</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🇳🇬</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Nigeria Premier</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginBottom: 6 }}>NPFL</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>Coming Jan 2027</div>
              </div>
            </a>
            <a href="/ghana" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(245,158,11,0.6)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#F59E0B', fontWeight: 700, animation: 'pulse 1.5s infinite' }}>LIVE</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🇬🇭</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Ghana Premier</div>
                <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginBottom: 6 }}>GPL 2026/27</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>306 matches<br/>Starts Sep 5</div>
              </div>
            </a>
            <a href="/indonesia" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(206,17,38,0.6)', borderRadius: '14px', padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, right: 8 }}><span style={{ fontSize: 8, color: '#CE1126', fontWeight: 700, animation: 'pulse 1.5s infinite' }}>LIVE</span></div>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🇮🇩</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 3 }}>Indonesia Liga 1</div>
                <div style={{ fontSize: 10, color: '#CE1126', fontWeight: 700, marginBottom: 6 }}>Liga 1 2026/27</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>306 matches<br/>Starts Sep 4</div>
              </div>
            </a>
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '13px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 0 24px rgba(139,92,246,0.25)' }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 Start Your Record Now →
            </a>
            <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>Free forever. No card. No betting.</p>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS + FINAL CTA */}
      <section style={{ backgroundColor: '#050E05', padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '32px', textAlign: 'center' }}>From prediction to legend.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              { step: '01', icon: '🎯', title: 'Call the match', desc: 'Pick the winner. Predict the exact score. Set your confidence before kick-off.' },
              { step: '02', icon: '🔒', title: 'It locks forever', desc: 'Once the whistle blows, your call is sealed. No edits. No excuses. Pure record.' },
              { step: '03', icon: '⚡', title: 'Earn reputation', desc: 'Correct calls earn points for you and your nation. Upsets earn glory.' },
              { step: '04', icon: '👑', title: 'Build your legacy', desc: 'EPL → UCL → ISL → NPFL. One permanent record. Forever.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', padding: '22px 20px' }}>
                <div style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
                <h3 style={{ fontSize: '15px', color: '#8B5CF6', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {[{ icon: '🚫', text: 'No Betting. Ever.' }, { icon: '📖', text: 'Permanent Record.' }, { icon: '🌍', text: 'Global Rankings.' }, { icon: '🆓', text: 'Always Free.' }].map(({ icon, text }) => (
              <div key={text} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold' }}>{text}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '12px', lineHeight: '1.2' }}>
              {heroNation
                ? <>{heroNation}&apos;s #1 football mind<br /><span style={{ color: '#8B5CF6' }}>could be you.</span></>
                : <>EPL 2026/27 starts August 21.<br /><span style={{ color: '#8B5CF6' }}>Your record starts now.</span></>
              }
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '16px' }}>
              380 EPL matches. One permanent record. Free forever.
            </p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '18px 52px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 50px rgba(139,92,246,0.4)' }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict EPL Matches Free →
            </a>
            <p style={{ color: '#8895A3', fontSize: '12px', marginTop: '12px' }}>Free. No betting. No risk. Pure football reputation.</p>
          </div>
        </div>
      </section>
      {/* FAQ SECTION */}
      <section style={{ backgroundColor: '#050E05', padding: '64px 20px', borderTop: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 8, textAlign: 'center' }}>EVERYTHING YOU NEED TO KNOW</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,5vw,36px)', textAlign: 'center', marginBottom: 48, fontWeight: 800 }}>Common Questions</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24 }}>

            {/* FAQ 1 — Football Reputation */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>⚽</span>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#8B5CF6', margin: 0 }}>
                  What is Football Reputation?
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['⚽', 'Prove your football knowledge — your predictions become your evidence.'],
                  ['🏆', 'Build a lasting record — grows with every prediction, every competition.'],
                  ['📈', 'Climb the rankings — see how you compare with fans globally.'],
                  ['👥', 'Challenge friends — turn football debates into real competition.'],
                  ['🏟️', 'Stand out in Private Leagues — prove who really knows football.'],
                  ['🔒', 'Permanent record — predictions are locked before kick-off. No edits.'],
                  ['🔄', 'Keep improving — learn from every prediction, make the next one better.'],
                ].map(([icon, text]) => (
                  <div key={text as string} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '12px 16px', backgroundColor: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 700, margin: 0, textAlign: 'center' }}>
                  🎯 Don't just say you know football. Prove it.
                </p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0', textAlign: 'center' }}>Predict. Prove. Repeat.</p>
              </div>
            </div>

            {/* FAQ 2 — Nation Battle */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🌍</span>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F59E0B', margin: 0 }}>
                  What is Nation Battle?
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['🌍', 'Represent your country through your football predictions.'],
                  ['🇮🇳🇮🇩🇬🇭🇳🇬', 'Choose your nation — compete with fans from every country.'],
                  ['⚽', 'Your predictions contribute to your nation&apos;s global performance.'],
                  ['🏆', 'Climb the global Nation Battle rankings with your country.'],
                  ['👥', 'Compete individually while contributing to something bigger.'],
                ].map(([icon, text]) => (
                  <div key={text as string} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '12px 16px', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: '#F59E0B', fontWeight: 700, margin: 0, textAlign: 'center' }}>
                  🔥 Your prediction. Your reputation. Your nation.
                </p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0', textAlign: 'center' }}>Predict for yourself. Compete for your country.</p>
              </div>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <a href="/nations" style={{ fontSize: 13, color: '#F59E0B', textDecoration: 'none', fontWeight: 700 }}>
                  View Nation Battle standings →
                </a>
              </div>
            </div>

          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '16px 48px', borderRadius: 12, textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 0 40px rgba(139,92,246,0.3)', marginBottom: 12 }}>
              ⚽ Start Predicting Free →
            </a>
            <p style={{ fontSize: 12, color: '#4B5563', margin: 0 }}>Free forever · No betting · No card required</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#8B5CF6', marginBottom: 16, letterSpacing: '-0.5px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { href: '/how-to-play', label: 'How to Play' },
              { href: '/how-to-predict-football', label: 'Prediction Guide' },
              { href: '/football-reputation', label: 'Football Reputation' },
              { href: '/epl', label: 'EPL 2026/27' },
              { href: '/world-cup-2026', label: 'World Cup 2026' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ color: '#6B7280', fontSize: 13, textDecoration: 'none' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#8B5CF6'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}>
                {label}
              </a>
            ))}
          </div>
          <p style={{ color: '#4B5563', fontSize: 12, marginBottom: 8 }}>Free forever · No betting · No gambling · Pure football intelligence</p>
          <p style={{ color: '#2E4A2E', fontSize: 11 }}>© 2026 Flipseer · Global Football Reputation Network</p>
        </div>
      </footer>
    </main>
  );
}
