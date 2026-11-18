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

// ── TELEGRAM BANNER — dismissible, shows once per session ──
function TelegramBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('flipseer_tg_banner');
      if (!dismissed) setShow(true);
    } catch (e) { setShow(true); }
  }, []);
  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem('flipseer_tg_banner', '1'); } catch (e) {}
  };
  if (!show) return <div style={{ minHeight: '53px' }} />;
  return (
    <div style={{ backgroundColor: '#0A1929', borderBottom: '1px solid #1E3A5F', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', position: 'relative' }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>📣</span>
      <span style={{ fontSize: '13px', color: '#93C5FD', fontWeight: 'bold' }}>
        Get pre-match predictions &amp; live results on Telegram →
      </span>
      <a
        href="https://t.me/flipseer"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#2AABEE', color: 'white', padding: '6px 16px', borderRadius: '999px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/></svg>
        Join @flipseer
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4B6A8A', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
      >×</button>
    </div>
  );
}

// ── TELEGRAM FLOATING BUTTON ──
function TelegramFloatingButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <a
      href="https://t.me/flipseer"
      target="_blank"
      rel="noopener noreferrer"
      title="Join Flipseer on Telegram"
      style={{ position: 'fixed', bottom: '24px', right: '20px', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#2AABEE', boxShadow: '0 4px 20px rgba(42,171,238,0.5)', textDecoration: 'none', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(42,171,238,0.7)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(42,171,238,0.5)'; }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/></svg>
    </a>
  );
}

// ── TOP TICKER: national leaderboard + upcoming matches ──
function TopTicker({ topNations }: { topNations: any[] }) {
  const [matches, setMatches] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('matches')
          .select('id, home_team, away_team, kickoff, status, competition')
          .in('competition', ['EPL 2026/27', 'Liga 1 2026/27', 'Ghana PL 2026/27', 'UCL 2026/27', 'ISL 2026/27'])
          .in('status', ['upcoming', 'live'])
          .order('kickoff', { ascending: true })
          .limit(8);
        setMatches(data || []);
      } catch (e) {}
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const COMP_FLAGS: { [k: string]: string } = {
    'EPL 2026/27': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'UCL 2026/27': '⭐', 'Liga 1 2026/27': '🇮🇩',
    'Ghana PL 2026/27': '🇬🇭', 'ISL 2026/27': '🇮🇳',
  };

  const now = new Date();
  const matchItems = matches.map(m => {
    const utc = m.kickoff.endsWith('Z') ? m.kickoff : m.kickoff.replace(' ', 'T') + 'Z';
    const diff = new Date(utc).getTime() - now.getTime();
    const isLive = m.status === 'live' || (diff < 0 && diff > -105 * 60 * 1000);
    const flag = COMP_FLAGS[m.competition] || '⚽';
    let timeLabel = '';
    if (isLive) { timeLabel = '🔴 LIVE'; }
    else if (diff > 0) {
      const h = Math.floor(diff / 3600000);
      const min = Math.floor((diff % 3600000) / 60000);
      timeLabel = h > 0 ? 'in ' + h + 'h ' + min + 'm' : 'in ' + min + 'm';
    }
    return { flag, text: m.home_team + ' vs ' + m.away_team, timeLabel, isLive };
  });

  const nationItems = topNations.map((n, i) => ({
    icon: n.flag, text: '#' + (i + 1) + ' ' + n.name + ' · ' + n.pts + ' rep', color: '#F59E0B',
  }));

  const allItems: { icon: string; text: string; color: string; pill?: string; pillColor?: string }[] = [
    ...nationItems,
    ...matchItems.map(m => ({
      icon: m.flag, text: m.text, color: m.isLive ? '#EF4444' : '#9CA3AF',
      pill: m.timeLabel, pillColor: m.isLive ? '#EF4444' : '#8B5CF6',
    })),
  ];
  if (allItems.length === 0) return null;
  const band = [...allItems, ...allItems];
  const speed = Math.max(35, band.length * 2.5);

  return (
    <div aria-hidden="true" style={{ backgroundColor: '#050E05', borderBottom: '1px solid #2D1B69', overflow: 'hidden', padding: '7px 0', contain: 'layout', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#050E05', paddingLeft: '12px', paddingRight: '14px', borderRight: '1px solid #2D1B69' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block', animation: 'repPulse 1s ease-in-out infinite', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '2px', whiteSpace: 'nowrap' }}>🌍 NATIONS</span>
      </div>
      <div style={{ display: 'flex', gap: '0', animation: 'ticker ' + speed + 's linear infinite', whiteSpace: 'nowrap', width: 'max-content', willChange: 'transform', transform: 'translateZ(0)', paddingLeft: '110px' }}>
        {band.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0 20px' }}>
            <span style={{ fontSize: '13px' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', color: item.color, fontWeight: 'bold' }}>{item.text}</span>
            {item.pill && (
              <span style={{ fontSize: '9px', backgroundColor: (item.pillColor || '#8B5CF6') + '22', color: item.pillColor || '#8B5CF6', border: '1px solid ' + (item.pillColor || '#8B5CF6') + '60', padding: '1px 6px', borderRadius: '999px', fontWeight: 'bold' }}>{item.pill}</span>
            )}
            <span style={{ color: '#2D1B69', marginLeft: '8px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── shared scrolling band renderer ──
function ScrollBand({ items, label, labelColor, pointsColor, bgColor, borderColor, speed }: {
  items: { username: string; flag: string; points: number; accuracy?: number }[];
  label: string; labelColor: string; pointsColor: string;
  bgColor: string; borderColor: string; speed: number;
}) {
  if (items.length === 0) return <div style={{ minHeight: '37px', backgroundColor: bgColor, borderTop: '1px solid ' + borderColor, borderBottom: '1px solid ' + borderColor }} />;
  const band = [...items, ...items];
  return (
    <div style={{ backgroundColor: bgColor, borderTop: '1px solid ' + borderColor, borderBottom: '1px solid ' + borderColor, padding: '8px 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: bgColor, paddingLeft: '12px', paddingRight: '14px', borderRight: '1px solid ' + borderColor }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: labelColor, display: 'inline-block', animation: 'repPulse 1s ease-in-out infinite', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', color: labelColor, fontWeight: 'bold', letterSpacing: '2px', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', animation: 'repTicker ' + speed + 's linear infinite', whiteSpace: 'nowrap', width: 'max-content', willChange: 'transform', transform: 'translateZ(0)', paddingLeft: '120px' }}>
        {band.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0 22px' }}>
            <span style={{ fontSize: '13px' }} dangerouslySetInnerHTML={{ __html: item.flag }} />
            <a href={'/u/' + item.username} style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}>@{item.username}</a>
            <span style={{ fontSize: '12px', color: pointsColor, fontWeight: 'bold', animation: 'repFlash 2s ease-in-out infinite' }}>{item.points} rep</span>
            {(item.accuracy || 0) > 0 && (
              <span style={{ fontSize: '10px', color: '#2E9E5E', backgroundColor: 'rgba(46,158,94,0.12)', border: '1px solid rgba(46,158,94,0.25)', padding: '1px 6px', borderRadius: '999px', fontWeight: 'bold' }}>{item.accuracy}%</span>
            )}
            <span style={{ color: '#1A3A1A', fontSize: '10px', marginLeft: '6px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── TICKER 1: All-time reputation ──
function AllTimeRepTicker() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username, country, total_points, accuracy_pct')
          .gt('total_points', 0)
          .not('username', 'is', null)
          .order('total_points', { ascending: false })
          .limit(100);
        if (!data || data.length === 0) return;
        setItems(data.filter((p: any) => p.username).map((p: any) => ({
          username: p.username,
          flag: COUNTRY_FLAGS[p.country || ''] || '&#x1F30D;',
          points: p.total_points,
          accuracy: p.accuracy_pct || 0,
        })));
      } catch (e) {}
    };
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, []);
  return <ScrollBand items={items} label="🏆 ALL-TIME REP" labelColor="#F59E0B" pointsColor="#F59E0B" bgColor="#020D04" borderColor="#F59E0B30" speed={Math.max(40, items.length * 3)} />;
}

// ── TICKER 2: Today's live rep ──
function TodayRepTicker() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);
        const { data: preds } = await supabase
          .from('predictions')
          .select('user_id, points_earned')
          .eq('prediction_processed', true)
          .gt('points_earned', 0)
          .gte('updated_at', todayStart.toISOString())
          .order('updated_at', { ascending: false })
          .limit(200);
        if (!preds || preds.length === 0) return;
        const totals: { [uid: string]: number } = {};
        preds.forEach((p: any) => { totals[p.user_id] = (totals[p.user_id] || 0) + (p.points_earned || 0); });
        const userIds = Object.keys(totals);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, country, accuracy_pct')
          .in('id', userIds);
        if (!profiles || profiles.length === 0) return;
        const mapped = profiles
          .filter((p: any) => p.username)
          .map((p: any) => ({ username: p.username, flag: COUNTRY_FLAGS[p.country || ''] || '&#x1F30D;', points: totals[p.id] || 0, accuracy: p.accuracy_pct || 0 }))
          .sort((a: any, b: any) => b.points - a.points);
        setItems(mapped);
      } catch (e) {}
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);
  return <ScrollBand items={items} label="⚡ TODAY'S REP" labelColor="#2E9E5E" pointsColor="#2E9E5E" bgColor="#020B04" borderColor="#2E9E5E30" speed={Math.max(30, items.length * 4)} />;
}

// ── TRACK RECORD STRIP — community accuracy vs random baseline ──
function TrackRecordStrip() {
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [totalPredictions, setTotalPredictions] = useState(0);
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('accuracy_pct, total_predictions')
          .gt('total_predictions', 10)
          .not('accuracy_pct', 'is', null);
        if (!data || data.length === 0) return;
        const totalPreds = data.reduce((sum: number, p: any) => sum + (p.total_predictions || 0), 0);
        const weightedAcc = data.reduce((sum: number, p: any) => sum + (p.accuracy_pct || 0) * (p.total_predictions || 0), 0);
        const avg = totalPreds > 0 ? Math.round((weightedAcc / totalPreds) * 10) / 10 : 0;
        setAccuracy(avg);
        setTotalPredictions(totalPreds);
      } catch (e) {}
    };
    load();
  }, []);

  if (accuracy === null) return null;
  const aboveRandom = Math.round((accuracy - 33.3) * 10) / 10;
  const isPositive = aboveRandom > 0;

  return (
    <a
      href="/track-record"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', flexWrap: 'wrap',
        backgroundColor: 'rgba(139,92,246,0.06)',
        borderTop: '1px solid rgba(139,92,246,0.15)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        padding: '10px 20px',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>📊 COMMUNITY TRACK RECORD</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 'bold', color: '#2E9E5E' }}>
        {accuracy}% accuracy
      </span>
      {isPositive && (
        <span style={{ fontSize: '12px', backgroundColor: 'rgba(46,158,94,0.12)', color: '#2E9E5E', border: '1px solid rgba(46,158,94,0.3)', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold' }}>
          +{aboveRandom}pp above random
        </span>
      )}
      <span style={{ fontSize: '11px', color: '#6B7280' }}>·</span>
      <span style={{ fontSize: '11px', color: '#6B7280' }}>{totalPredictions.toLocaleString()} predictions</span>
      <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold' }}>See full record →</span>
    </a>
  );
}

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
        const slugs = data.live.map((m: any) =>
          (m.home || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          '-vs-' +
          (m.away || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
        );
        const checks = await Promise.all(
          slugs.map((slug: string) =>
            fetch(`/api/match-status?slug=${slug}`, { cache: 'no-store' })
              .then(r => r.json())
              .catch(() => null)
          )
        );
        const stillLive = data.live.filter((_: any, i: number) => {
          const check = checks[i];
          return !check || check.status !== 'completed';
        });
        if (stillLive.length > 0) {
          setLiveMatches(stillLive);
          setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          const evMap: { [key: number]: any[] } = {};
          await Promise.all(stillLive.map(async (match: any) => {
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

function UpcomingMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState<number | null>(null);
  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select('id, home_team, away_team, kickoff, status, league, competition')
        .in('competition', ['EPL 2026/27', 'Liga 1 2026/27', 'Ghana PL 2026/27', 'UCL 2026/27', 'ISL 2026/27'])
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
  const handleShare = (match: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const slug = match.home_team.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-vs-' + match.away_team.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const url = `https://flipseer.com/matches/${slug}`;
      const comp = match.competition?.replace(/ 202\d\/\d\d$/, '') || 'Football';
      const shareText = `⚽ ${match.home_team} vs ${match.away_team} · ${comp}\n\nPredict the winner before kickoff 🔒\n👉 ${url}\n\n📲 Get live alerts → t.me/flipseer\n#Flipseer #Football`;
      if (navigator.share) {
        navigator.share({ title: `${match.home_team} vs ${match.away_team} — Flipseer`, text: shareText, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          setCopied(match.id);
          setTimeout(() => setCopied(null), 2000);
        }).catch(() => {});
      }
    } catch (e) {}
  };
  if (loading) return (
    <section style={{ padding: '32px 20px', borderBottom: '1px solid #1A3A1A', minHeight: '300px' }} aria-hidden="true">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ height: '14px', width: '140px', backgroundColor: '#1A3A1A', borderRadius: '4px', margin: '0 auto 12px' }} />
        <div style={{ height: '32px', width: '240px', backgroundColor: '#1A3A1A', borderRadius: '4px', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: '72px', backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    </section>
  );
  if (matches.length === 0) return null;
  return (
    <section style={{ padding: '32px 20px', borderBottom: '1px solid #1A3A1A' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>⚽ PREDICT NOW</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', textAlign: 'center', marginBottom: '4px' }}>Upcoming Matches</h2>
        <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>Predict before kick-off. Your call is locked forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {matches.map((match) => {
            const live = isLive(match.kickoff, match.status);
            const countdown = getCountdown(match.kickoff);
            const utcString = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
            const kickoffPast = new Date(utcString).getTime() < now.getTime();
            const slug = match.home_team.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-vs-' + match.away_team.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <a key={match.id} href={`/matches/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid ' + (live ? '#8B5CF6' : '#2D1B69'), borderRadius: '12px', padding: '14px 16px', boxShadow: live ? '0 0 16px rgba(139,92,246,0.15)' : 'none', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
                  {live ? (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px' }}>LIVE</span>
                  ) : countdown ? (
                    <span style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#8B5CF6', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px', border: '1px solid #8B5CF6' }}>{countdown}</span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#6B7280', backgroundColor: 'rgba(127,29,29,0.2)', padding: '2px 8px', borderRadius: '999px' }}>🔒 LOCKED</span>
                  )}
                  <div suppressHydrationWarning style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{formatKickoff(match.kickoff)}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', textAlign: 'center', lineHeight: 1.3 }}>{match.home_team}</span>
                    <span style={{ fontSize: '10px', color: '#8895A3', fontWeight: 'bold' }}>vs</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', textAlign: 'center', lineHeight: 1.3 }}>{match.away_team}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '3px' }}>{match.competition?.replace(/ 202\d\/\d\d$/, '') || ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => handleShare(match, e)}
                    title="Share this match"
                    style={{ background: 'transparent', border: '1px solid #2D3748', borderRadius: '7px', color: copied === match.id ? '#2E9E5E' : '#6B7280', padding: '7px 10px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {copied === match.id ? '✓' : '📤'}
                  </button>
                  <a href="/predict" onClick={e => e.stopPropagation()} style={{ backgroundColor: kickoffPast ? 'transparent' : '#8B5CF6', color: kickoffPast ? '#6B7280' : 'white', border: kickoffPast ? '1px solid #1A3A1A' : 'none', padding: '7px 14px', borderRadius: '7px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {kickoffPast ? 'Locked' : 'Predict →'}
                  </a>
                </div>
              </a>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ color: '#8B5CF6', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>Predict EPL · UCL · Liga 1 · Ghana PL · ISL →</a>
        </div>
      </div>
    </section>
  );
}

function ClaimModal() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) return;
      const seen = sessionStorage.getItem('flipseer_welcome_modal');
      if (seen) return;
      setTimeout(() => { setShow(true); sessionStorage.setItem('flipseer_welcome_modal', '1'); }, 3000);
    });
  }, []);
  if (!mounted || !show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShow(false)}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px', backgroundColor: '#0D1F0F', border: '2px solid #8B5CF6', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(139,92,246,0.4)' }}>
        <div style={{ background: 'linear-gradient(135deg,#4C1D95,#8B5CF6)', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚽</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: 'white', margin: '0 0 6px' }}>Predict. Prove. Repeat.</h2>
          <p style={{ fontSize: '13px', color: '#C4B5FD', margin: 0 }}>EPL · UCL · Liga 1 · Ghana PL · ISL all live now.</p>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {[
              { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'EPL 2026/27', status: 'LIVE', color: '#8B5CF6' },
              { flag: '⭐', name: 'UCL 2026/27', status: 'LIVE', color: '#A78BFA' },
              { flag: '🇮🇩', name: 'Liga 1 Indonesia', status: 'LIVE', color: '#CE1126' },
              { flag: '🇬🇭', name: 'Ghana Premier League', status: 'LIVE', color: '#F59E0B' },
              { flag: '🇮🇳', name: 'Indian Super League', status: 'LIVE', color: '#FF6B35' },
            ].map(({ flag, name, status, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '8px 12px' }}>
                <span style={{ fontSize: '14px' }}>{flag} <span style={{ color: 'white', fontSize: '13px' }}>{name}</span></span>
                <span style={{ fontSize: '9px', backgroundColor: color, color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>{status}</span>
              </div>
            ))}
          </div>
          <a href="/predict" style={{ display: 'block', backgroundColor: '#8B5CF6', color: 'white', padding: '13px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            ⚽ Start Predicting Free →
          </a>
          <p style={{ fontSize: '11px', color: '#4B5563', textAlign: 'center', margin: '8px 0 0' }}>Free forever · No betting · No card required</p>
        </div>
      </div>
    </div>
  );
}

function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', handler);
    if (window.matchMedia('(display-mode: standalone)').matches) setShow(false);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  if (!show) return null;
  return (
    <button onClick={async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)', color: '#C4B5FD', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
      📲 Install Flipseer App
    </button>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [heroNation, setHeroNation] = useState('');
  const [nationRank, setNationRank] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topNations, setTopNations] = useState<any[]>([]);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        const stats = await statsRes.json();
        setTotalUsers(stats.totalUsers || 0);
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
          'America/Bogota': 'Colombia', 'Asia/Riyadh': 'Saudi Arabia',
          'Europe/Istanbul': 'Turkey',
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
          'Asia/Riyadh': 'SA', 'Europe/Istanbul': 'TR',
        };
        const detectedNation = tzToCountry[tz] || '';
        const visitorCode = tzToCode[tz] || '';
        if (detectedNation) {
          setHeroNation(detectedNation);
          try { localStorage.setItem('flipseer_detected_nation', detectedNation); } catch (e) {}
        }
        // Nation ranks from leaderboard
        if ((stats.totalUsers || 0) >= 5) {
          const res = await fetch('/api/leaderboard');
          const leaderboardData = await res.json();
          if (Array.isArray(leaderboardData) && leaderboardData.length >= 1) {
            const countryMap: { [key: string]: number } = {};
            leaderboardData.forEach((u: any) => {
              const c = u.country || 'Other';
              countryMap[c] = (countryMap[c] || 0) + (u.total_points || 0);
            });
            const ranked = Object.entries(countryMap).sort((a, b) => b[1] - a[1]);
            const visitorRankIdx = ranked.findIndex(([c]) => c === visitorCode);
            if (visitorRankIdx >= 0) setNationRank(visitorRankIdx + 1);
          }
        }
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
            .map(([code, pts], idx) => ({ rank: idx + 1, flag: FLAGS[code] || '🌍', name: NAMES[code] || code, pts }));
          setTopNations(nationsSorted);
        }
      } catch (err) { console.error('Data fetch error:', err); }
    };
    fetchData();
  }, []);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>
      <ClaimModal />
      <TelegramFloatingButton />
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes bannerPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes liveBadgePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.75; transform: scale(0.95); } }
        @keyframes ctaPulse { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes repPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }
        @keyframes repFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes repTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(180deg, #071408 0%, #0D1F0F 100%)',
        padding: 'clamp(40px,8vw,72px) 20px clamp(32px,6vw,56px)',
        textAlign: 'center',
        borderBottom: '1px solid #1A3A1A',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70%', height: '100%', background: 'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
          {/* What it is */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '1.5px' }}>EPL · UCL · Liga 1 · Ghana PL · ISL — LIVE NOW</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,7vw,60px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: '16px', animation: 'flicker 8s infinite' }}>
            {heroNation && nationRank > 0 ? (
              <>
                {nationRank === 1 ? (
                  <>
                    <span style={{ fontSize: 'clamp(18px,3.5vw,26px)', color: '#F59E0B', display: 'block', marginBottom: '8px', letterSpacing: '0px', fontWeight: 700 }}>{heroNation.toUpperCase()} IS</span>
                    <span style={{ fontSize: 'clamp(72px,16vw,120px)', color: '#F59E0B', display: 'block', lineHeight: '0.9', letterSpacing: '-4px' }}>#1</span>
                    <span style={{ fontSize: 'clamp(20px,4vw,32px)', color: '#F59E0B', display: 'block', marginTop: '12px', fontWeight: 800 }}>DEFEND THE TOP SPOT.</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 'clamp(18px,3.5vw,26px)', color: '#9CA3AF', display: 'block', marginBottom: '8px', letterSpacing: '0px', fontWeight: 700 }}>{heroNation.toUpperCase()} IS RANKED</span>
                    <span style={{ fontSize: 'clamp(72px,16vw,120px)', color: '#8B5CF6', display: 'block', lineHeight: '0.9', letterSpacing: '-4px' }}>#{nationRank}</span>
                    <span style={{ fontSize: 'clamp(20px,4vw,32px)', color: '#8B5CF6', display: 'block', marginTop: '12px', fontWeight: 800 }}>PUSH THEM TO #1.</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span style={{ display: 'block' }}>Your football calls.</span>
                <span style={{ display: 'block', color: '#8B5CF6' }}>Permanent record.</span>
                <span style={{ display: 'block' }}>Forever.</span>
              </>
            )}
          </h1>

          {/* One-line value prop */}
          <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 24px', fontFamily: 'Georgia, serif' }}>
            Predict EPL, UCL, Liga 1, Ghana PL and ISL matches before kickoff.
            Every correct call builds your <span style={{ color: '#8B5CF6' }}>Football Reputation</span> — verified, locked, yours forever.
          </p>

          {/* Trust signals */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', padding: '4px 12px', borderRadius: '999px' }}>✓ Free forever</span>
            <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', padding: '4px 12px', borderRadius: '999px' }}>✓ No betting</span>
            <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', padding: '4px 12px', borderRadius: '999px' }}>✓ No card required</span>
            {totalUsers > 0 && <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', padding: '4px 12px', borderRadius: '999px' }}>🌍 {totalUsers} forecasters</span>}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '17px', fontWeight: 'bold', boxShadow: '0 0 40px rgba(139,92,246,0.4)', letterSpacing: '0.3px' }}>
              ⚽ Make Your First Prediction — Free →
            </a>
            <a href="/groups" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '16px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '17px', border: '1px solid rgba(245,158,11,0.4)', fontWeight: 'bold' }}>
              👥 Challenge a Friend
            </a>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280' }}>
            Already predicting? <a href="/groups" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' }}>Create a private league</a> with your WhatsApp group.
          </p>
        </div>
      </section>

      {/* ── TICKER BARS ── */}
      <TelegramBanner />
      <TopTicker topNations={topNations} />

      {/* ── P0: MATCH CARDS — first clickable content ── */}
      <UpcomingMatches />

      {/* ── P0: TRACK RECORD STRIP — trust signal below match cards ── */}
      <TrackRecordStrip />

      {/* ── LIVE SCORES (only shown when matches are live) ── */}
      <LiveScoreCard />

      {/* ── THREE STEPS ── */}
      <section style={{ padding: '40px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
            {[
              { num: '1', icon: '🎯', title: 'Predict', desc: 'Pick the outcome before kick-off. Set your confidence.' },
              { num: '2', icon: '🔒', title: 'Lock', desc: 'Prediction locks at kick-off. No edits. Permanent record.' },
              { num: '3', icon: '📈', title: 'Track', desc: 'See your accuracy, streak and global rank after every result.' },
              { num: '4', icon: '🏆', title: 'Build Reputation', desc: 'Earn reputation across EPL, UCL, Liga 1 and Ghana PL. Forever.' },
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

      {/* ── P0: REP TICKERS — demoted to below Three Steps ── */}
      <AllTimeRepTicker />
      <TodayRepTicker />

      {/* ── INVITE BANNER ── */}
      <InviteBanner />

      {/* ── P0: INLINE TELEGRAM CTA — more prominent than floating button ── */}
      <section style={{ backgroundColor: '#060D1A', borderTop: '1px solid #1E3A5F', borderBottom: '1px solid #1E3A5F', padding: '36px 20px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#2AABEE" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/></svg>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '8px', fontWeight: 800 }}>
            Never miss a prediction window
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px' }}>
            Get pre-match predictions, live score alerts, and results for EPL, Liga 1, Ghana PL and ISL — straight to Telegram.
            Over <strong style={{ color: 'white' }}>10,000 football fans</strong> already in the channel.
          </p>
          <a
            href="https://t.me/flipseer"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#2AABEE', color: 'white', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 32px rgba(42,171,238,0.4)', marginBottom: '12px' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/></svg>
            Join @flipseer on Telegram →
          </a>
          <p style={{ fontSize: '11px', color: '#4B6A8A', marginTop: '8px' }}>Free · No spam · Unsubscribe anytime</p>
        </div>
      </section>

      {/* ── 5 COMPETITIONS ── */}
      <section style={{ padding: '56px 20px', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg, #1A0B2E 0%, #0D1F0F 100%)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '16px', padding: '32px 24px' }}>
            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: '12px' }}>5 COMPETITIONS · LIVE NOW</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,5vw,32px)', marginBottom: '12px', fontWeight: 800 }}>
              One reputation.<br /><span style={{ color: '#8B5CF6' }}>Every competition.</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
              EPL · UCL · Liga 1 · Ghana PL · ISL — your predictions across all competitions build one permanent Football Reputation. Forever.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[
                { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'EPL', color: '#8B5CF6' },
                { flag: '⭐', name: 'UCL', color: '#A78BFA' },
                { flag: '🇮🇩', name: 'Liga 1', color: '#CE1126' },
                { flag: '🇬🇭', name: 'Ghana PL', color: '#F59E0B' },
                { flag: '🇮🇳', name: 'ISL', color: '#FF6B35' },
              ].map(({ flag, name, color }) => (
                <div key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: color + '15', border: '1px solid ' + color + '50', borderRadius: '999px', padding: '5px 14px' }}>
                  <span>{flag}</span>
                  <span style={{ fontSize: '12px', color, fontWeight: 700 }}>{name}</span>
                  <span style={{ fontSize: '9px', backgroundColor: color, color: 'white', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>LIVE</span>
                </div>
              ))}
            </div>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
              ⚽ Start Predicting Free →
            </a>
            <p style={{ fontSize: '11px', color: '#4B5563', marginTop: '12px' }}>Free forever · No betting · No card required</p>
          </div>
        </div>
      </section>

      {/* ── NATION BATTLE ── */}
      <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>NATION BATTLE · LIVE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '34px', marginBottom: '8px' }}>Which nation leads the world?</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '24px' }}>Every prediction earns points for your country. The rivalry is real.</p>
          <div style={{ textAlign: 'center' }}>
            <a href="/nations" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>View Nation Battle →</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#8B5CF6', marginBottom: 16, letterSpacing: '-0.5px' }}>⚽ FLIPSEER</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { href: '/about', label: 'About' },
              { href: '/how-to-play', label: 'How to Play' },
              { href: '/football-reputation', label: 'Football Reputation' },
              { href: '/nations', label: 'Nation Battle' },
              { href: '/leaderboard', label: 'Leaderboard' },
              { href: '/track-record', label: 'Track Record' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ color: '#6B7280', fontSize: 13, textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
          <p style={{ color: '#4B5563', fontSize: 12, marginBottom: 8 }}>Free forever · No betting · No gambling · Pure football intelligence</p>
          <p style={{ marginBottom: 8 }}>
            <a href="https://t.me/flipseer" target="_blank" rel="noopener noreferrer" style={{ color: '#2AABEE', fontSize: 13, textDecoration: 'none', fontWeight: 'bold' }}>
              📣 Join us on Telegram → t.me/flipseer
            </a>
          </p>
          <p style={{ color: '#2E4A2E', fontSize: 11 }}>© 2026 Flipseer · Global Football Reputation Network</p>
        </div>
      </footer>
    </main>
  );
}
