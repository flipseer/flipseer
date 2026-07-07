'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

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
      // Fetch with deduplication — one prediction per user
      const { data } = await supabase
        .from('predictions')
        .select('predicted_outcome, confidence_pct, points_earned, prediction_processed, created_at, user_id, profiles(username, country)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        // Deduplicate — keep only most recent prediction per user
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
          return {
            username: p.profiles.username,
            flag: COUNTRY_FLAGS[country] || '&#x1F30D;',
            pick,
            confidence: p.confidence_pct,
            points: p.points_earned,
            processed: p.prediction_processed,
            timeAgo,
          };
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
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>RECENT ACTIVITY</span>
          <span style={{ fontSize: '11px', color: '#8895A3', marginLeft: 'auto' }}>Latest predictions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '8px 12px' }}>
              <span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: a.flag }} />
              <span style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold' }}>@{a.username}</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {a.processed && a.points > 0
                  ? <>gained <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>+{a.points} pts</span></>
                  : <>predicted <span style={{ color: 'white', fontWeight: 'bold' }}>{a.pick}</span> · <span style={{ color: '#2E9E5E' }}>{a.confidence}%</span></>
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

// -- LIVE SCORECARD WITH COMMENTARY --
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

        // Fetch events for each live match via our existing live-scores API
        // The live-scores API already has the fixture data — we just need events
        const evMap: { [key: number]: any[] } = {};
        await Promise.all(data.live.map(async (match: any) => {
          if (!match.api_id) return;
          try {
            const evRes = await fetch('/api/match-events?fixture=' + match.api_id);
            if (evRes.ok) {
              const evData = await evRes.json();
              if (evData?.events) evMap[match.api_id] = evData.events;
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
          <span style={{ fontSize: '10px', color: '#8895A3' }}>Updated {lastUpdated}</span>
        </div>

        {liveMatches.map((match) => {
          const evs = matchEvents[match.api_id] || [];
          return (
            <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #EF444440', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>

              {/* Score row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: evs.length > 0 ? '12px' : '0' }}>
                <div style={{ minWidth: '44px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}>{match.elapsed ? match.elapsed + "'" : 'LIVE'}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', flex: 1, textAlign: 'right' }}>{match.home}</span>
                  <div style={{ backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '6px', padding: '4px 12px', minWidth: '70px', textAlign: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.home_score} - {match.away_score}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', flex: 1 }}>{match.away}</span>
                </div>
              </div>

              {/* Last 3 events */}
              {evs.length > 0 && (
                <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {evs.map((ev: any, i: number) => {
                    const isGoal = ev.type === 'Goal';
                    const isYellow = ev.detail === 'Yellow Card';
                    const isRed = ev.detail === 'Red Card';
                    const isSub = ev.type === 'subst';
                    const icon = isGoal ? '&#x26BD;' : isYellow ? '&#x1F7E8;' : isRed ? '&#x1F7E5;' : '&#x1F504;';
                    const color = isGoal ? '#2E9E5E' : isYellow ? '#F59E0B' : isRed ? '#EF4444' : '#6B7280';
                    const playerName = ev.player?.name || '';
                    const assistName = ev.assist?.name || '';
                    const teamName = ev.team?.name || '';
                    const isPenalty = ev.detail === 'Penalty';
                    const isOwnGoal = ev.detail === 'Own Goal';
                    const suffix = isPenalty ? ' (pen)' : isOwnGoal ? ' (og)' : '';

                    let text = '';
                    if (isGoal) text = playerName + suffix + ' — ' + teamName;
                    else if (isSub) text = playerName + ' on / ' + assistName + ' off';
                    else text = playerName + ' (' + ev.detail + ')';

                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#8895A3', minWidth: '28px', fontWeight: 'bold' }}>{ev.time?.elapsed}&apos;</span>
                        <span style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                        <span style={{ fontSize: '12px', color, fontWeight: isGoal ? 'bold' : 'normal' }}>{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <a href="/predict" style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', textDecoration: 'none' }}>
            &#x1F3AF; Predict upcoming matches &#x2192;
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
        .select('id, home_team, away_team, kickoff, status, league')
        .in('status', ['upcoming', 'live'])
        .order('kickoff', { ascending: true })
        .limit(4);
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
    const tzMap: { [key: string]: string } = {
      'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST',
      'Africa/Lagos': 'WAT', 'Asia/Jakarta': 'WIB',
      'America/New_York': 'EDT', 'Europe/London': 'BST',
      'America/Sao_Paulo': 'BRT', 'Asia/Tokyo': 'JST',
    };
    const formatted = date.toLocaleString('en-GB', {
      timeZone: tz, day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
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

  return (
    <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>WORLD CUP 2026</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', textAlign: 'center', marginBottom: '6px' }}>Upcoming Matches</h2>
        <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>Predict before kick-off. Your call is locked forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {matches.map((match) => {
            const live = isLive(match.kickoff, match.status);
            const countdown = getCountdown(match.kickoff);
            const utcString = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
            const kickoffPast = new Date(utcString).getTime() < now.getTime();
            return (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (live ? '#2E9E5E' : '#1A7A4A'), borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: live ? '0 0 16px rgba(46,158,94,0.12)' : 'none' }}>
                <div style={{ minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
                  {live ? (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px' }}>LIVE</span>
                  ) : countdown ? (
                    <span style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px', border: '1px solid #F59E0B' }}>{countdown}</span>
                  ) : kickoffPast || match.status === 'locked' ? (
                    <span style={{ fontSize: '10px', color: '#6B7280', backgroundColor: 'rgba(127,29,29,0.2)', padding: '2px 8px', borderRadius: '999px' }}>🔒 LOCKED</span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>Soon</span>
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
                <a href="/predict" style={{ backgroundColor: kickoffPast ? 'transparent' : '#1A7A4A', color: kickoffPast ? '#6B7280' : 'white', border: kickoffPast ? '1px solid #1A3A1A' : 'none', padding: '7px 14px', borderRadius: '7px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {kickoffPast ? 'Locked' : 'Predict →'}
                </a>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ color: '#2E9E5E', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>View all 104 World Cup matches →</a>
        </div>
      </div>
    </section>
  );
}

// ── CLAIM MODAL ──
function ClaimModal() {
  const [show, setShow] = useState(false);
  const [forecasters, setForecasters] = useState(33);
  const [topNation, setTopNation] = useState({ name: 'India', flag: '&#x1F1EE;&#x1F1F3;', points: 145 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) return;
      const seen = sessionStorage.getItem('flipseer_claim_modal');
      if (seen) return;
      const fetchData = async () => {
        try {
          const { count: activeCount } = await supabase
            .from('profiles').select('*', { count: 'exact', head: true }).gt('prediction_count', 0);
          if (activeCount) setForecasters(activeCount);
          const res = await fetch('/api/leaderboard');
          const data = await res.json();
          if (data && data.length > 0) {
            const countryMap: { [key: string]: number } = {};
            data.forEach((u: any) => {
              const c = u.country || 'Other';
              countryMap[c] = (countryMap[c] || 0) + (u.total_points || 0);
            });
            const top = Object.entries(countryMap).sort((a, b) => b[1] - a[1])[0];
            if (top) {
              const names: { [key: string]: string } = { 'IN': 'India', 'ID': 'Indonesia', 'NG': 'Nigeria', 'BR': 'Brazil', 'AR': 'Argentina', 'Other': 'the World' };
              const flags: { [key: string]: string } = { 'IN': '&#x1F1EE;&#x1F1F3;', 'ID': '&#x1F1EE;&#x1F1E9;', 'NG': '&#x1F1F3;&#x1F1EC;', 'BR': '&#x1F1E7;&#x1F1F7;', 'AR': '&#x1F1E6;&#x1F1F7;', 'Other': '&#x1F30D;' };
              setTopNation({ name: names[top[0]] || top[0], flag: flags[top[0]] || '&#x1F30D;', points: top[1] });
            }
          }
        } catch (e) {}
        setTimeout(() => { setShow(true); sessionStorage.setItem('flipseer_claim_modal', '1'); }, 8000);
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
        .claim-box { background: #0D2B14; border: 1px solid #2E9E5E; border-radius: 20px; padding: 28px 24px; max-width: 360px; width: 100%; box-shadow: 0 0 60px rgba(46,158,94,0.25); animation: modalSlideUp 0.4s ease forwards; position: relative; font-family: Arial, sans-serif; }
      `}</style>
      <div className="claim-backdrop" onClick={() => setShow(false)}>
        <div className="claim-box" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShow(false)} style={{ position: 'absolute', top: '12px', right: '14px', background: 'transparent', border: 'none', color: '#8895A3', fontSize: '20px', cursor: 'pointer' }}>×</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '2px' }}>WORLD CUP 2026 · LIVE NOW</span>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: 'white', marginBottom: '14px', lineHeight: '1.3' }}>
            <span dangerouslySetInnerHTML={{ __html: topNation.flag }} />{' '}
            <span style={{ color: '#2E9E5E' }}>{topNation.name} leads</span><br />
            the Nation Battle.<br />
            <span style={{ fontSize: '15px', color: '#9CA3AF' }}>Will your nation challenge them?</span>
          </h2>
          <div style={{ backgroundColor: '#050E05', border: '1px solid #1A7A4A', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>{topNation.points} pts</span> · <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{forecasters} forecasters</span> competing globally
            </div>
            <div style={{ fontSize: '11px', color: '#8895A3', fontStyle: 'italic', marginTop: '8px', borderTop: '1px solid #1A3A1A', paddingTop: '8px' }}>
              Every match without a prediction is a call your nation can never reclaim. 🔒
            </div>
          </div>
          <button onClick={() => window.location.href = '/auth'} style={{ width: '100%', padding: '13px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px', boxShadow: '0 0 20px rgba(46,158,94,0.3)' }}>
            🌍 Represent Your Nation Free →
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
  { id: 0, left: 5, delay: 0.0, dur: 3.0, icon: '&#x26BD;', size: 24 },
  { id: 1, left: 20, delay: 0.3, dur: 2.8, icon: '&#x1F3C6;', size: 18 },
  { id: 2, left: 35, delay: 0.1, dur: 3.2, icon: '&#x2B50;', size: 20 },
  { id: 3, left: 50, delay: 0.5, dur: 2.6, icon: '&#x26BD;', size: 28 },
  { id: 4, left: 65, delay: 0.2, dur: 3.5, icon: '&#x1F3C6;', size: 22 },
  { id: 5, left: 80, delay: 0.4, dur: 2.9, icon: '&#x26BD;', size: 16 },
  { id: 6, left: 92, delay: 0.1, dur: 3.1, icon: '&#x2B50;', size: 26 },
];

function WelcomeConfetti() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem('flipseer_welcome');
    if (!seen) {
      setShow(true);
      sessionStorage.setItem('flipseer_welcome', '1');
      setTimeout(() => setShow(false), 4500);
    }
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      <style>{`
        @keyframes fall { 0% { transform: translateY(-60px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(540deg); opacity: 0; } }
        @keyframes fadeWelcome { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); } 20% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 75% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.9); } }
      `}</style>
      <div style={{ position: 'fixed', top: '50%', left: '50%', textAlign: 'center', animation: 'fadeWelcome 4s forwards', zIndex: 1000, pointerEvents: 'none', backgroundColor: 'rgba(13,31,15,0.92)', border: '2px solid #2E9E5E', borderRadius: '20px', padding: '28px 40px', boxShadow: '0 0 60px rgba(46,158,94,0.4)' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>&#x26BD;</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: 'white', fontWeight: 'bold' }}>Welcome to Flipseer!</div>
        <div style={{ fontSize: '13px', color: '#2E9E5E', marginTop: '6px' }}>Build your permanent football legacy</div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>World Cup 2026 · LIVE NOW</div>
      </div>
      {PARTICLES.map((p) => (
        <div key={p.id} dangerouslySetInnerHTML={{ __html: p.icon }}
          style={{ position: 'absolute', left: p.left + '%', top: '-60px', fontSize: p.size + 'px', animation: 'fall ' + p.dur + 's ' + p.delay + 's ease-in forwards' }} />
      ))}
    </div>
  );
}

// ── MAIN HOME PAGE ──

const PLAYERS = [
  { name: 'Lionel Messi', country: 'Argentina', code: 'AR', flag: '&#x1F1E6;&#x1F1F7;', club: 'Inter Miami - Forward', bio: 'The greatest of all time. 8 World Cup goals across 5 tournaments. At 38, chasing immortality on football\'s biggest stage.', wc_fact: '3 goals vs Algeria in Group Stage 2026', color: '#74ACDF' },
  { name: 'Cristiano Ronaldo', country: 'Portugal', code: 'PT', flag: '&#x1F1F5;&#x1F1F9;', club: 'Al-Nassr - Forward', bio: 'Five Ballon d\'Or. 900+ career goals. At 41, still defying age. Portugal\'s captain in what may be his final World Cup.', wc_fact: 'Scored in Portugal 1-1 draw vs DR Congo', color: '#006600' },
  { name: 'Kylian Mbappe', country: 'France', code: 'FR', flag: '&#x1F1EB;&#x1F1F7;', club: 'Real Madrid - Forward', bio: 'World Cup winner at 19. Now leads France as captain. The fastest and most dangerous player in the tournament.', wc_fact: '3 goals vs Senegal. France Group leaders.', color: '#002395' },
  { name: 'Vinicius Jr', country: 'Brazil', code: 'BR', flag: '&#x1F1E7;&#x1F1F7;', club: 'Real Madrid - Forward', bio: 'Ballon d\'Or 2024. Brazil\'s most electric attacker -- unpredictable and unstoppable on the World Cup stage.', wc_fact: 'Brazil drew 1-1 vs Morocco in Group Stage', color: '#009C3B' },
  { name: 'Erling Haaland', country: 'Norway', code: 'NO', flag: '&#x1F1F3;&#x1F1F4;', club: 'Manchester City - Forward', bio: '50+ Premier League goals in two seasons. Norway\'s greatest striker makes his World Cup debut. The most feared forward.', wc_fact: 'Norway beat Iraq 4-1. Haaland leads Group F.', color: '#EF2B2D' },
  { name: 'Jude Bellingham', country: 'England', code: 'GB', flag: '&#x1F3F4;', club: 'Real Madrid - Midfielder', bio: 'Champions League winner at 20. Now carries England\'s 60-year World Cup dream on his shoulders as captain.', wc_fact: 'England beat Croatia 4-2 in Group Stage opener', color: '#CF081F' },
  { name: 'Mohamed Salah', country: 'Egypt', code: 'EG', flag: '&#x1F1EA;&#x1F1EC;', club: 'Al-Qadsiah - Forward', bio: 'The Egyptian King. 200+ Premier League goals. Africa\'s greatest modern player leads Egypt on the biggest stage.', wc_fact: 'Egypt vs Belgium -- Group Stage battle', color: '#CE1126' },
  { name: 'Victor Osimhen', country: 'Nigeria', code: 'NG', flag: '&#x1F1F3;&#x1F1EC;', club: 'Galatasaray - Forward', bio: 'Africa\'s most lethal striker. Nigeria\'s Super Eagles captain carries the hopes of 220 million fans.', wc_fact: 'Nigeria in Group Stage -- Super Eagles flying', color: '#008751' },
  { name: 'Weston McKennie', country: 'USA', code: 'US', flag: '&#x1F1FA;&#x1F1F8;', club: 'Juventus - Midfielder', bio: 'USA co-hosts on home soil. McKennie leads a young, hungry American team playing in front of their own fans.', wc_fact: 'USA beat Paraguay 4-1 in stunning Group opener', color: '#B22234' },
  { name: 'Egy Maulana Vikri', country: 'Indonesia', code: 'ID', flag: '&#x1F1EE;&#x1F1E9;', club: 'Lechia Gdansk - Forward', bio: 'The first Indonesian to play in Europe\'s top leagues. Leads the Garuda at their first-ever World Cup.', wc_fact: 'Indonesia making history at their first World Cup', color: '#CE1126' },
];

function PlayerSpotlight() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setCurrent(function(p) { return (p + 1) % PLAYERS.length; }); setFade(true); }, 400);
    }, 12000);
    return () => clearInterval(iv);
  }, []);

  if (!mounted) return null;

  const pl = PLAYERS[current];

  return (
    <section style={{ padding: '0 20px 48px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>&#x2B50; WORLD CUP 2026 STARS</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button aria-label="Previous player" onClick={() => { setFade(false); setTimeout(() => { setCurrent((current - 1 + PLAYERS.length) % PLAYERS.length); setFade(true); }, 400); }} style={{ background: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A', color: '#2E9E5E', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>{'<'}</button>
          <button aria-label="Next player" onClick={() => { setFade(false); setTimeout(() => { setCurrent((current + 1) % PLAYERS.length); setFade(true); }, 400); }} style={{ background: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A', color: '#2E9E5E', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>{'>'}</button>
        </div>
      </div>
      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: pl.color }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }} dangerouslySetInnerHTML={{ __html: pl.flag }} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', fontFamily: 'Georgia, serif' }}>{pl.name}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{pl.club}</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: pl.color, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '999px', border: '1px solid ' + pl.color }}>{pl.country}</div>
        </div>
        <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>{pl.bio}</p>
        <div style={{ backgroundColor: '#050E05', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold' }}>&#x26BD; WC 2026 - </span>
          <span style={{ fontSize: '12px', color: '#D1FAE5' }}>{pl.wc_fact}</span>
        </div>
        <a href="/predict" style={{ display: 'block', textAlign: 'center', backgroundColor: 'rgba(46,158,94,0.15)', border: '1px solid #2E9E5E', color: '#2E9E5E', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
          &#x1F3AF; Predict {pl.country} next match -&gt;
        </a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {PLAYERS.map((p, i) => (
          <button key={i} aria-label={`View ${p.name}`} onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 400); }} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: i === current ? '#2E9E5E' : '#1A3A1A' }} />
        ))}
      </div>

    </section>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);
  const [heroNation, setHeroNation] = useState('');
  const [nationRank, setNationRank] = useState(0);
  const [nationForecasters, setNationForecasters] = useState(0);
  const [nextMatchCountdown, setNextMatchCountdown] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeForecasters, setActiveForecasters] = useState(0);
  const [predictions24h, setPredictions24h] = useState(0);
  const [isRealLeaderboard, setIsRealLeaderboard] = useState(false);
  const [realLeaderboard, setRealLeaderboard] = useState<any[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // WC day counter
  useEffect(() => {
    const wcStart = new Date('2026-06-11T19:00:00Z');
    const interval = setInterval(() => {
      const elapsed = Date.now() - wcStart.getTime();
      setDays(Math.floor(elapsed / (1000 * 60 * 60 * 24)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buzz stats
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [{ count: predCount }, { count: userCount }, { count: activeCount }] = await Promise.all([
          supabase.from('predictions').select('*', { count: 'exact', head: true }).gte('created_at', since),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('prediction_count', 0),
        ]);
        setPredictions24h(predCount || 0);
        setTotalUsers(userCount || 0);
        setActiveForecasters(activeCount || 0);

        // Nation detection
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzToCountry: { [key: string]: string } = {
          'Asia/Calcutta': 'India', 'Asia/Kolkata': 'India',
          'Asia/Jakarta': 'Indonesia', 'Asia/Makassar': 'Indonesia', 'Asia/Jayapura': 'Indonesia',
          'Africa/Lagos': 'Nigeria', 'Africa/Abuja': 'Nigeria',
          'America/Sao_Paulo': 'Brazil', 'America/Fortaleza': 'Brazil',
          'America/Buenos_Aires': 'Argentina', 'America/Argentina/Buenos_Aires': 'Argentina',
          'America/Mexico_City': 'Mexico', 'America/New_York': 'USA',
          'America/Chicago': 'USA', 'America/Los_Angeles': 'USA',
          'Europe/London': 'England', 'Europe/Paris': 'France',
          'Europe/Berlin': 'Germany', 'Europe/Madrid': 'Spain',
          'Europe/Lisbon': 'Portugal', 'Europe/Amsterdam': 'Netherlands',
          'Africa/Accra': 'Ghana', 'Africa/Johannesburg': 'South Africa',
          'Africa/Casablanca': 'Morocco', 'Africa/Cairo': 'Egypt',
          'Africa/Nairobi': 'Kenya', 'Africa/Dakar': 'Senegal',
          'Africa/Kinshasa': 'DR Congo', 'Africa/Abidjan': 'Ivory Coast',
          'Africa/Tunis': 'Tunisia', 'Africa/Algiers': 'Algeria',
          'Asia/Tokyo': 'Japan', 'Asia/Seoul': 'South Korea',
          'Asia/Karachi': 'Pakistan', 'Asia/Dhaka': 'Bangladesh',
          'Asia/Bangkok': 'Thailand', 'Asia/Manila': 'Philippines',
          'Asia/Riyadh': 'Saudi Arabia', 'Asia/Dubai': 'UAE',
          'Asia/Singapore': 'Singapore', 'Asia/Kuala_Lumpur': 'Malaysia',
          'Asia/Tehran': 'Iran', 'Asia/Baghdad': 'Iraq',
          'Asia/Tashkent': 'Uzbekistan', 'Asia/Amman': 'Jordan',
          'America/Toronto': 'Canada', 'America/Vancouver': 'Canada',
          'America/Bogota': 'Colombia', 'America/Lima': 'Peru',
          'America/Santiago': 'Chile', 'America/Montevideo': 'Uruguay',
          'America/Asuncion': 'Paraguay', 'America/Port-au-Prince': 'Haiti',
          'Australia/Sydney': 'Australia', 'Australia/Melbourne': 'Australia',
          'Europe/Istanbul': 'Turkey', 'Europe/Stockholm': 'Sweden',
          'Europe/Zagreb': 'Croatia', 'Europe/Brussels': 'Belgium',
          'Europe/Vienna': 'Austria', 'Europe/Warsaw': 'Poland',
          'Europe/Prague': 'Czech Republic', 'Europe/Oslo': 'Norway',
          'Pacific/Auckland': 'New Zealand',
        };
        const tzToCode: { [key: string]: string } = {
          'Asia/Calcutta': 'IN', 'Asia/Kolkata': 'IN',
          'Asia/Jakarta': 'ID', 'Asia/Makassar': 'ID', 'Asia/Jayapura': 'ID',
          'Africa/Lagos': 'NG', 'Africa/Abuja': 'NG',
          'America/Sao_Paulo': 'BR', 'America/Buenos_Aires': 'AR',
          'America/Argentina/Buenos_Aires': 'AR', 'America/Mexico_City': 'MX',
          'America/New_York': 'US', 'America/Chicago': 'US', 'America/Los_Angeles': 'US',
          'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
          'Europe/Madrid': 'ES', 'Europe/Lisbon': 'PT',
          'Africa/Accra': 'GH', 'Africa/Johannesburg': 'ZA',
          'Africa/Casablanca': 'MA', 'Africa/Nairobi': 'KE',
          'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR',
          'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD',
          'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
          'America/Toronto': 'CA', 'America/Bogota': 'CO',
          'Asia/Riyadh': 'SA', 'Asia/Tashkent': 'UZ',
          'Africa/Kinshasa': 'CD', 'Europe/Istanbul': 'TR',
          'Europe/Zagreb': 'HR', 'America/Port-au-Prince': 'HT',
        };
        const detectedNation = tzToCountry[tz] || '';
        const visitorCode = tzToCode[tz] || '';
        if (detectedNation) {
          setHeroNation(detectedNation);
          try { localStorage.setItem('flipseer_detected_nation', detectedNation); } catch (e) {}
        }

        // Leaderboard
        let leaderboardData: any[] = [];
        if ((userCount || 0) >= 10) {
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

            // Nation rank for visitor
            const visitorRankIdx = ranked.findIndex(([c]) => c === visitorCode);
            if (visitorRankIdx >= 0) {
              setNationRank(visitorRankIdx + 1);
              setNationForecasters(ranked[visitorRankIdx][1].forecasters);
            }

            // Leaderboard display
            const sorted = ranked.slice(0, 6).map(([country, stats], i) => {
              const countryNames: { [key: string]: string } = {
                'IN': 'India', 'ID': 'Indonesia', 'NG': 'Nigeria', 'BR': 'Brazil',
                'AR': 'Argentina', 'FR': 'France', 'DE': 'Germany', 'GB': 'England',
                'ES': 'Spain', 'PT': 'Portugal', 'MX': 'Mexico', 'US': 'USA',
                'GH': 'Ghana', 'ZA': 'South Africa', 'MA': 'Morocco',
                'JP': 'Japan', 'KR': 'South Korea', 'AU': 'Australia',
                'CA': 'Canada', 'CO': 'Colombia', 'TR': 'Turkey',
                'Other': 'Other Nations',
              };
              return {
                rank: i + 1,
                flag: COUNTRY_FLAGS[country] || '&#x1F30D;',
                country: countryNames[country] || country,
                forecasters: stats.forecasters,
                points: stats.points,
              };
            });
            if (sorted.length >= 1) { setRealLeaderboard(sorted); setIsRealLeaderboard(true); }
          }
        }

        // Next match countdown
        const { data: nextMatch } = await supabase
          .from('matches').select('kickoff').in('status', ['upcoming', 'locked'])
          .order('kickoff', { ascending: true }).limit(1).single();
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

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>

      {/* ── EPL FLOATING CORNER CARD (top-right) ── */}
      {mounted && (
        <a href="/epl" style={{ textDecoration: 'none' }}>
          <div style={{
            position: 'fixed', top: 70, right: 16, zIndex: 400,
            backgroundColor: '#0D2B14',
            border: '1px solid #8B5CF6',
            borderRadius: 12,
            padding: '12px 14px',
            maxWidth: 160,
            boxShadow: '0 0 24px rgba(139,92,246,0.25)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(139,92,246,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(139,92,246,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            {/* Top badge */}
            <div style={{
              fontSize: 9, color: '#8B5CF6', fontWeight: 700,
              letterSpacing: '1.5px', marginBottom: 6,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
              COMING AUG 16
            </div>

            {/* Trophy + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 24, filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' }}>🏆</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                  Premier League
                </div>
                <div style={{ fontSize: 10, color: '#8895A3' }}>is next.</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ fontSize: 10, color: '#8895A3', lineHeight: 1.6, marginBottom: 8, borderTop: '1px solid #1A3A1A', paddingTop: 6 }}>
              380 matches<br/>
              Your reputation carries forward<br/>
              Free forever
            </div>

            {/* CTA */}
            <div style={{
              backgroundColor: '#8B5CF6', color: 'white',
              borderRadius: 6, padding: '6px 10px',
              fontSize: 10, fontWeight: 700, textAlign: 'center',
              letterSpacing: '0.3px',
            }}>
              Join the Waitlist →
            </div>
          </div>
        </a>
      )}
      <ClaimModal />
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* ── SECTION 1: LIVE TICKER + BUZZ BAR ── */}
      <div aria-hidden="true" style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A7A4A', overflow: 'hidden', padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'ticker 40s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[
            'World Cup 2026 is LIVE -- 104 matches -- whose nation will top the world?',
            'India vs Indonesia vs Nigeria -- the Nation Battle is on',
            'Predict exact scores for up to 108 pts per match -- no betting ever',
            'Your predictions lock at kick-off -- permanent proof of your football intelligence',
            'No betting. No luck. No AI tips. Pure football intelligence.',
            'Represent your nation -- every correct call earns points for your country',
            'Build your permanent football reputation -- free forever -- no card required',
            'The World Cup only comes every 4 years -- your record lasts forever',
            'World Cup 2026 is LIVE -- 104 matches -- whose nation will top the world?',
            'India vs Indonesia vs Nigeria -- the Nation Battle is on',
            'Predict exact scores for up to 108 pts per match -- no betting ever',
            'Your predictions lock at kick-off -- permanent proof of your football intelligence',
            'No betting. No luck. No AI tips. Pure football intelligence.',
            'Represent your nation -- every correct call earns points for your country',
            'Build your permanent football reputation -- free forever -- no card required',
            'The World Cup only comes every 4 years -- your record lasts forever',
          ].map((item, i) => (
            <span key={i} style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#2E9E5E' }}>⚽</span> {item}
              <span style={{ color: '#1A3A20', marginLeft: '16px' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* Buzz bar */}
      {mounted && totalUsers > 0 && (
        <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '7px 20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>⚡ {predictions24h} predictions</span> in last 24h
            </span>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>👥 {totalUsers} registered</span> · {activeForecasters} active
            </span>
            {nextMatchCountdown && (
              <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}>
                ⏱ Next match in {nextMatchCountdown}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Live banner */}
      <div style={{ backgroundColor: '#1A7A4A', padding: '9px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>
            ⚽ LIVE -- World Cup 2026 -- Predict matches. Represent your nation. Free forever.
          </span>
          <a href="/auth?utm_source=homepage&utm_medium=banner&utm_campaign=wc2026" style={{ backgroundColor: 'white', color: '#1A7A4A', padding: '4px 16px', borderRadius: '999px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            Join Free →
          </a>
        </div>
      </div>


      {/* ── NATION TICKER — scrolling flags, click to set nation ── */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '8px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '6px', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[
            { code: 'IN', flag: '&#x1F1EE;&#x1F1F3;', name: 'India' },
            { code: 'ID', flag: '&#x1F1EE;&#x1F1E9;', name: 'Indonesia' },
            { code: 'NG', flag: '&#x1F1F3;&#x1F1EC;', name: 'Nigeria' },
            { code: 'BR', flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
            { code: 'AR', flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' },
            { code: 'FR', flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
            { code: 'DE', flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' },
            { code: 'ES', flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain' },
            { code: 'PT', flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' },
            { code: 'GB', flag: '&#x1F3F4;', name: 'England' },
            { code: 'MX', flag: '&#x1F1F2;&#x1F1FD;', name: 'Mexico' },
            { code: 'US', flag: '&#x1F1FA;&#x1F1F8;', name: 'USA' },
            { code: 'GH', flag: '&#x1F1EC;&#x1F1ED;', name: 'Ghana' },
            { code: 'MA', flag: '&#x1F1F2;&#x1F1E6;', name: 'Morocco' },
            { code: 'JP', flag: '&#x1F1EF;&#x1F1F5;', name: 'Japan' },
            { code: 'KR', flag: '&#x1F1F0;&#x1F1F7;', name: 'S.Korea' },
            { code: 'AU', flag: '&#x1F1E6;&#x1F1FA;', name: 'Australia' },
            { code: 'CA', flag: '&#x1F1E8;&#x1F1E6;', name: 'Canada' },
            { code: 'ZA', flag: '&#x1F1FF;&#x1F1E6;', name: 'S.Africa' },
            { code: 'EG', flag: '&#x1F1EA;&#x1F1EC;', name: 'Egypt' },
            { code: 'PK', flag: '&#x1F1F5;&#x1F1F0;', name: 'Pakistan' },
            { code: 'BD', flag: '&#x1F1E7;&#x1F1E9;', name: 'Bangladesh' },
            { code: 'SA', flag: '&#x1F1F8;&#x1F1E6;', name: 'Saudi Arabia' },
            { code: 'TR', flag: '&#x1F1F9;&#x1F1F7;', name: 'Turkey' },
            { code: 'NO', flag: '&#x1F1F3;&#x1F1F4;', name: 'Norway' },
            { code: 'SE', flag: '&#x1F1F8;&#x1F1EA;', name: 'Sweden' },
            { code: 'IN', flag: '&#x1F1EE;&#x1F1F3;', name: 'India' },
            { code: 'ID', flag: '&#x1F1EE;&#x1F1E9;', name: 'Indonesia' },
            { code: 'NG', flag: '&#x1F1F3;&#x1F1EC;', name: 'Nigeria' },
            { code: 'BR', flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil' },
            { code: 'AR', flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina' },
            { code: 'FR', flag: '&#x1F1EB;&#x1F1F7;', name: 'France' },
            { code: 'DE', flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany' },
            { code: 'ES', flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain' },
            { code: 'PT', flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal' },
            { code: 'GB', flag: '&#x1F3F4;', name: 'England' },
            { code: 'MX', flag: '&#x1F1F2;&#x1F1FD;', name: 'Mexico' },
            { code: 'US', flag: '&#x1F1FA;&#x1F1F8;', name: 'USA' },
            { code: 'GH', flag: '&#x1F1EC;&#x1F1ED;', name: 'Ghana' },
            { code: 'MA', flag: '&#x1F1F2;&#x1F1E6;', name: 'Morocco' },
            { code: 'JP', flag: '&#x1F1EF;&#x1F1F5;', name: 'Japan' },
            { code: 'KR', flag: '&#x1F1F0;&#x1F1F7;', name: 'S.Korea' },
            { code: 'AU', flag: '&#x1F1E6;&#x1F1FA;', name: 'Australia' },
            { code: 'CA', flag: '&#x1F1E8;&#x1F1E6;', name: 'Canada' },
            { code: 'ZA', flag: '&#x1F1FF;&#x1F1E6;', name: 'S.Africa' },
            { code: 'EG', flag: '&#x1F1EA;&#x1F1EC;', name: 'Egypt' },
            { code: 'PK', flag: '&#x1F1F5;&#x1F1F0;', name: 'Pakistan' },
            { code: 'BD', flag: '&#x1F1E7;&#x1F1E9;', name: 'Bangladesh' },
            { code: 'SA', flag: '&#x1F1F8;&#x1F1E6;', name: 'Saudi Arabia' },
            { code: 'TR', flag: '&#x1F1F9;&#x1F1F7;', name: 'Turkey' },
            { code: 'NO', flag: '&#x1F1F3;&#x1F1F4;', name: 'Norway' },
            { code: 'SE', flag: '&#x1F1F8;&#x1F1EA;', name: 'Sweden' },
          ].map((n, i) => (
            <a key={i} href={'/auth?nation=' + n.code}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', border: '1px solid #1A3A1A', backgroundColor: heroNation === n.name ? 'rgba(46,158,94,0.15)' : 'transparent', textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: n.flag }} />
              <span style={{ fontSize: '11px', color: heroNation === n.name ? '#2E9E5E' : '#8895A3', fontWeight: heroNation === n.name ? 'bold' : 'normal' }}>{n.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: LIVE SCORES + ACTIVITY ── */}
      <LiveScoreCard />
      <LiveActivity />

      {/* ── SECTION 3: HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 20px 64px', maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Live badge */}
        <div suppressHydrationWarning style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '999px', padding: '8px 20px', marginBottom: '40px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span suppressHydrationWarning style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>
            {mounted ? `WORLD CUP 2026 · LIVE · DAY ${days + 1}` : 'WORLD CUP 2026 · LIVE NOW'}
          </span>
        </div>

        {/* Hero headline */}
        <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: '1.08', marginBottom: '16px', fontWeight: 'bold', animation: 'flicker 8s infinite' }}>
          {heroNation && nationRank > 0 ? (
            <>
              <span style={{ fontSize: 'clamp(32px, 6vw, 56px)', color: '#9CA3AF', display: 'block', marginBottom: '8px', letterSpacing: '-0.5px' }}>{heroNation.toUpperCase()} IS RANKED</span>
              <span style={{ fontSize: 'clamp(80px, 18vw, 140px)', color: '#F59E0B', display: 'block', lineHeight: '0.9', letterSpacing: '-4px' }}>#{nationRank}</span>
              <span style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#2E9E5E', display: 'block', marginTop: '12px' }}>CAN YOU HELP THEM REACH #1?</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', display: 'block', letterSpacing: '-2px' }}>PROVE YOUR</span>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', color: '#2E9E5E', display: 'block', letterSpacing: '-2px' }}>FOOTBALL</span>
              <span style={{ fontSize: 'clamp(40px, 9vw, 80px)', display: 'block', letterSpacing: '-2px' }}>INTELLIGENCE.</span>
            </>
          )}
        </h1>

        {/* One-line value prop — answers "What is Flipseer?" in 5 seconds */}
        <p style={{ fontSize: 'clamp(15px,2.5vw,19px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 28px', fontFamily: 'Georgia, serif' }}>
          Predict matches before kick-off. Build a permanent Football Reputation.{' '}
          <span style={{ color: '#2E9E5E' }}>Represent your country.</span>
        </p>



        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a href="/auth?utm_source=homepage&utm_medium=hero&utm_campaign=wc2026"
            style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 48px rgba(46,158,94,0.4)', letterSpacing: '0.3px' }}>
            Predict Free &#x2192;
          </a>
          <a href="/groups?utm_source=homepage&utm_medium=hero&utm_campaign=groups"
            style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '18px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', border: '1px solid rgba(245,158,11,0.4)', fontWeight: 'bold' }}>
            &#x1F3C6; Challenge Friends
          </a>
        </div>

        {/* Trust + groups hook */}
        <p style={{ fontSize: '13px', color: '#8895A3', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Free forever &nbsp;&#xB7;&nbsp; No betting &nbsp;&#xB7;&nbsp; No card required
        </p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>
          Already predicting? <a href="/groups" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' }}>Create a private league</a> and challenge your WhatsApp group.
        </p>

        {/* FOMO — only if data exists, compact */}
        {mounted && (nationForecasters > 0 || nextMatchCountdown) && (
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #1A3A1A' }}>
            {nationForecasters > 0 && nationRank > 0 && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                &#x1F525; <strong style={{ color: '#F59E0B' }}>{nationForecasters}</strong> {heroNation} forecasters competing
              </span>
            )}
            {nextMatchCountdown && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                &#x23F1; Next match locks in <strong style={{ color: '#EF4444' }}>{nextMatchCountdown}</strong>
              </span>
            )}
            {totalUsers > 0 && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                &#x1F30D; <strong style={{ color: '#2E9E5E' }}>{totalUsers}</strong> forecasters globally
              </span>
            )}
          </div>
        )}
      </section>


      {/* ── THREE STEP — Predict → Prove → Build ── */}
      <section style={{ padding: '40px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { num: '1', icon: '🎯', title: 'Predict', desc: 'Choose a match before kick-off. Set your confidence level.' },
              { num: '2', icon: '🔒', title: 'Prove', desc: 'Your call locks forever. No edits. No excuses. Pure record.' },
              { num: '3', icon: '🔁', title: 'Repeat', desc: 'Every match builds your permanent Football Reputation. Forever.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A7A4A',
                borderRadius: 12, padding: '18px 14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 9, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px', marginBottom: 6 }}>STEP {num}</div>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 11, color: '#8895A3', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: UPCOMING MATCHES ── */}
      {/* PLAYER SPOTLIGHT */}
      <PlayerSpotlight />

      <UpcomingMatches />

      {/* ── SECTION 5: NATION BATTLE ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>NATION BATTLE · LIVE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '34px', marginBottom: '8px' }}>
            {heroNation ? <>Can <span style={{ color: '#2E9E5E' }}>{heroNation}</span> top the world?</> : 'Which nation leads the world?'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '32px' }}>
            Every prediction earns points for your country. The rivalry is real — and it&apos;s live right now.
          </p>

          {isRealLeaderboard ? (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', overflow: 'hidden', maxWidth: '520px', margin: '0 auto 24px' }}>
              <div style={{ backgroundColor: '#050E05', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                <span>RANK · NATION</span>
                <span style={{ color: '#2E9E5E' }}>LIVE · FORECASTERS · POINTS</span>
              </div>
              {realLeaderboard.map(({ rank, flag, country, forecasters, points }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #1A3A1A' }}>
                  <span style={{ fontSize: '13px', color: rank === 1 ? '#F59E0B' : '#6B7280', fontWeight: 'bold', minWidth: '28px' }}>#{rank}</span>
                  <span style={{ fontSize: '18px', marginRight: '10px' }} dangerouslySetInnerHTML={{ __html: flag }} />
                  <span style={{ flex: 1, fontSize: '14px', color: 'white', textAlign: 'left' }}>{country}</span>
                  <span style={{ fontSize: '11px', color: '#6B7280', marginRight: '12px' }}>{forecasters} forecasters</span>
                  <span style={{ fontSize: '13px', color: rank === 1 ? '#F59E0B' : '#9CA3AF', fontWeight: 'bold' }}>{points} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', maxWidth: '520px', margin: '0 auto 24px', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Your nation needs you.</p>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Predict matches to earn points for your country.</p>
              <a href="/nations" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>View Nation Battle →</a>
            </div>
          )}

          <a href="/nations" style={{ color: '#2E9E5E', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
            Full Nation Battle standings →
          </a>
        </div>
      </section>


      {/* ── COMING NEXT TIMELINE ── */}
      <section style={{ backgroundColor: '#050E05', padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>YOUR RECORD NEVER STOPS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>
            Sign up once. Predict forever.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            World Cup is just the beginning. One permanent record across every competition. Forever.
          </p>

          {/* Timeline */}
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 40px' }}>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
              {[
                { icon: '&#x1F3C6;', label: 'World Cup 2026', date: 'LIVE NOW', color: '#2E9E5E', active: true },
              ].map(({ icon, label, date, color, active }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {/* Circle */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid ' + color, backgroundColor: active ? color + '30' : '#0D2B14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: active ? '0 0 20px ' + color + '60' : 'none' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  {/* Date badge */}
                  <div style={{ backgroundColor: active ? color : '#1A3A1A', color: active ? 'white' : '#6B7280', fontSize: '10px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    {date}
                  </div>
                  {/* Label */}
                  <div style={{ fontSize: '11px', color: active ? color : '#6B7280', fontWeight: active ? 'bold' : 'normal', textAlign: 'center', lineHeight: '1.3' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points carry over message */}
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px 24px', maxWidth: '500px', margin: '0 auto 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px', flexShrink: 0 }}>&#x1F4CA;</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                Your points carry over automatically
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6' }}>
                World Cup points + EPL points + UCL points = your permanent total.<br />
                <span style={{ color: '#2E9E5E' }}>One profile. Every competition. Forever.</span>
              </div>
            </div>
          </div>

          <a href="/auth?utm_source=homepage&utm_medium=timeline&utm_campaign=coming_next"
            style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(46,158,94,0.3)' }}>
            &#x26BD; Start Your Record Now &#x2192;
          </a>
          <p style={{ fontSize: '11px', color: '#8895A3', marginTop: '10px' }}>Free forever. No card. No betting.</p>
        </div>
      </section>


      {/* ── SECTION 6: HOW IT WORKS + FINAL CTA ── */}
      <section style={{ backgroundColor: '#050E05', padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '32px', textAlign: 'center' }}>From prediction to legend.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              { step: '01', icon: '🎯', title: 'Call the match', desc: 'Pick the winner. Predict the exact score. Set your confidence before kick-off.' },
              { step: '02', icon: '🔒', title: 'It locks forever', desc: 'Once the whistle blows, your call is sealed. No edits. No excuses. Pure record.' },
              { step: '03', icon: '⚡', title: 'Earn reputation', desc: 'Correct calls earn points for you and your nation. Upsets earn glory.' },
              { step: '04', icon: '👑', title: 'Build your legacy', desc: 'World Cup → EPL → Champions League. One permanent record. Forever.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '22px 20px' }}>
                <div style={{ fontSize: '10px', color: '#1A7A4A', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>STEP {step}</div>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
                <h3 style={{ fontSize: '15px', color: '#2E9E5E', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Trust signals — compact */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {[
              { icon: '🚫', text: 'No Betting. Ever.' },
              { icon: '📖', text: 'Permanent Record.' },
              { icon: '🌍', text: 'Global Rankings.' },
              { icon: '🆓', text: 'Always Free.' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold' }}>{text}</div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '12px', lineHeight: '1.2' }}>
              {heroNation
                ? <>{heroNation}&apos;s #1 football mind<br /><span style={{ color: '#2E9E5E' }}>could be you.</span></>
                : <>World Cup 2026 is live.<br /><span style={{ color: '#2E9E5E' }}>Is your record growing?</span></>
              }
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '16px' }}>
              Every match is a chance to prove your football intelligence.<br />
              Predict. Represent your nation. Build your legacy.
            </p>
            <a href="/auth?utm_source=homepage&utm_medium=final&utm_campaign=wc2026" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '18px 52px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 50px rgba(46,158,94,0.4)' }}>
              ⚽ Predict Your First Match Free →
            </a>
            <p style={{ color: '#8895A3', fontSize: '12px', marginTop: '12px' }}>Free. No betting. No risk. Pure football reputation.</p>
          </div>
        </div>
      </section>



      {/* ── FOOTER ── */}
      <footer style={{
        backgroundColor: '#050E05',
        borderTop: '1px solid #1A3A1A',
        padding: '32px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2E9E5E', marginBottom: 16, letterSpacing: '-0.5px' }}>
            ⚽ FLIPSEER
          </div>

          {/* Footer links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { href: '/how-to-play', label: 'How to Play' },
              { href: '/how-to-predict-football', label: 'Prediction Guide' },
              { href: '/football-reputation', label: 'Football Reputation' },
              { href: '/about', label: 'About' },
              { href: '/faq', label: 'FAQ' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                color: '#6B7280', fontSize: 13,
                textDecoration: 'none', fontWeight: 500,
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#2E9E5E'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Tagline */}
          <p style={{ color: '#4B5563', fontSize: 12, marginBottom: 8 }}>
            Free forever · No betting · No gambling · Pure football intelligence
          </p>
          <p style={{ color: '#2E4A2E', fontSize: 11 }}>
            © 2026 Flipseer · Global Football Reputation Network
          </p>
        </div>
      </footer>

    </main>
  );
}
