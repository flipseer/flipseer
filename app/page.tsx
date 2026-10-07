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
  'Ghana': '&#x1F1EC;&#x1F1ED;', 'Other': '&#x1F30D;',
  'IN': '&#x1F1EE;&#x1F1F3;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'FR': '&#x1F1EB;&#x1F1F7;',
  'DE': '&#x1F1E9;&#x1F1EA;', 'GB': '&#x1F3F4;',
  'ES': '&#x1F1EA;&#x1F1F8;', 'PT': '&#x1F1F5;&#x1F1F9;',
  'NL': '&#x1F1F3;&#x1F1F1;', 'IT': '&#x1F1EE;&#x1F1F9;',
  'MX': '&#x1F1F2;&#x1F1FD;', 'US': '&#x1F1FA;&#x1F1F8;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'GH': '&#x1F1EC;&#x1F1ED;',
  'ID': '&#x1F1EE;&#x1F1E9;',
};

const STATIC_TICKER = [
  'EPL 2026/27 · Predict every match before kick-off',
  'UEFA Champions League · Group stage predictions open now',
  'Liga 1 Indonesia · Ghana Premier League · ISL India — all live',
  'Your predictions lock at kick-off — forever on record',
  'No betting. No luck. Pure football intelligence.',
  'Predict exact scores for up to 108 pts per match',
  'Build your permanent football reputation — free forever',
  'Every correct call earns points toward your legacy',
];

const LIVE_COMPETITIONS = [
  { icon: '&#x1F3F4;', name: 'EPL 2026/27', desc: "England's top flight. 380 matches.", color: '#8B5CF6' },
  { icon: '&#x2B50;', name: 'UCL 2026/27', desc: "Europe's elite. Group stage live.", color: '#A78BFA' },
  { icon: '&#x1F1EE;&#x1F1E9;', name: 'Liga 1 Indonesia', desc: 'Indonesian top flight.', color: '#CE1126' },
  { icon: '&#x1F1EC;&#x1F1ED;', name: 'Ghana Premier League', desc: 'West Africa\'s finest.', color: '#F59E0B' },
  { icon: '&#x1F1EE;&#x1F1F3;', name: 'ISL India', desc: 'Indian Super League.', color: '#FF6B35' },
];

const TOP_NATIONS = [
  { flag: '&#x1F1EE;&#x1F1F3;', name: 'India', slug: 'india' },
  { flag: '&#x1F1E7;&#x1F1F7;', name: 'Brazil', slug: 'brazil' },
  { flag: '&#x1F1E6;&#x1F1F7;', name: 'Argentina', slug: 'argentina' },
  { flag: '&#x1F3F4;', name: 'England', slug: 'england' },
  { flag: '&#x1F1F3;&#x1F1EC;', name: 'Nigeria', slug: 'nigeria' },
  { flag: '&#x1F1F2;&#x1F1FD;', name: 'Mexico', slug: 'mexico' },
  { flag: '&#x1F1FA;&#x1F1F8;', name: 'USA', slug: 'usa' },
  { flag: '&#x1F1E9;&#x1F1EA;', name: 'Germany', slug: 'germany' },
  { flag: '&#x1F1EE;&#x1F1E9;', name: 'Indonesia', slug: 'indonesia' },
  { flag: '&#x1F1EB;&#x1F1F7;', name: 'France', slug: 'france' },
  { flag: '&#x1F1EA;&#x1F1F8;', name: 'Spain', slug: 'spain' },
  { flag: '&#x1F1EC;&#x1F1ED;', name: 'Ghana', slug: 'ghana' },
];

const REAL_USER_THRESHOLD = 100;

function CTAButton({ label = '&#x26BD; START PREDICTING FREE', href = '/auth', size = 'md' }: { label?: string; href?: string; size?: 'sm' | 'md' | 'lg' }) {
  const pad = size === 'lg' ? '20px 56px' : size === 'sm' ? '12px 28px' : '16px 40px';
  const fs = size === 'lg' ? '20px' : size === 'sm' ? '14px' : '17px';
  return (
    <a
      href={href}
      dangerouslySetInnerHTML={{ __html: label }}
      style={{
        display: 'inline-block',
        backgroundColor: '#1A7A4A',
        color: 'white',
        padding: pad,
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: fs,
        fontWeight: 'bold',
        boxShadow: '0 0 32px rgba(46,158,94,0.3)',
        letterSpacing: '0.2px',
      }}
    />
  );
}

function StickyMobileCTA({ user }: { user: any }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user) return;
    try {
      if (sessionStorage.getItem('sticky_cta_dismissed')) { setDismissed(true); return; }
    } catch (_) {}
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, [user]);

  if (user || dismissed || !visible) return null;

  return (
    <>
      <style>{`
        @media (min-width: 768px) { .fs-sticky-cta { display: none !important; } }
        @keyframes ctaSlideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fs-sticky-cta { animation: ctaSlideUp 0.35s ease-out forwards; }
      `}</style>
      <div className="fs-sticky-cta" style={{ height: '74px' }} aria-hidden="true" />
      <div className="fs-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, backgroundColor: '#0A1A0C', borderTop: '1px solid #1A7A4A', padding: '10px 14px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="/auth" style={{ flex: 1, display: 'block', textAlign: 'center', backgroundColor: '#2E9E5E', color: 'white', fontWeight: 'bold', fontSize: '15px', padding: '13px 16px', borderRadius: '10px', textDecoration: 'none' }}>
          &#x26BD; START PREDICTING FREE
        </a>
        <button onClick={() => { setDismissed(true); try { sessionStorage.setItem('sticky_cta_dismissed', '1'); } catch (_) {} }} aria-label="Dismiss" style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '18px', cursor: 'pointer', padding: '8px', lineHeight: 1, flexShrink: 0 }}>
          ✕
        </button>
      </div>
    </>
  );
}

function BuzzCounter() {
  const [count24h, setCount24h] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetch24h = async () => {
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: predCount } = await supabase.from('predictions').select('*', { count: 'exact', head: true }).gte('created_at', since);
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        setCount24h(predCount || 0);
        setTotalUsers(userCount || 0);
      } catch (e) {}
    };
    fetch24h();
    const interval = setInterval(fetch24h, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || (count24h === 0 && totalUsers === 0)) return null;

  return (
    <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '8px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {count24h > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>&#x26A1; {count24h} predictions</span> in last 24h
            </span>
          </div>
        )}
        {totalUsers > 0 && (
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>&#x1F465; {totalUsers} forecasters</span> building their legacy
          </span>
        )}
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
          <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>&#x1F3C6; 5 competitions</span> live now
        </span>
      </div>
    </div>
  );
}

function LiveScoreCard() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [mounted, setMounted] = useState(false);

  const fetchLive = async () => {
    try {
      const res = await fetch('/api/live-scores');
      const data = await res.json();
      if (data.live && data.live.length > 0) {
        setLiveMatches(data.live);
        setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else { setLiveMatches([]); }
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
    <section style={{ backgroundColor: '#0A1A0A', borderTop: '2px solid #EF4444', borderBottom: '1px solid #1A3A1A', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#EF4444', letterSpacing: '2px' }}>LIVE NOW</span>
          </div>
          <span style={{ fontSize: '11px', color: '#4B5563' }}>Updated {lastUpdated}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {liveMatches.map((match) => (
            <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #EF444440', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 'bold' }}>{match.elapsed ? match.elapsed + "'" : 'LIVE'}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', textAlign: 'right', flex: 1 }}>{match.home}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '6px 16px', minWidth: '80px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.home_score}</span>
                  <span style={{ fontSize: '16px', color: '#4B5563' }}>-</span>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.away_score}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', textAlign: 'left', flex: 1 }}>{match.away}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a href="/predict" style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', textDecoration: 'none' }}>&#x1F3AF; Predict upcoming matches &#x2192;</a>
        </div>
      </div>
    </section>
  );
}

function UpcomingMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from('matches').select('id, home_team, away_team, kickoff, status, league, competition').in('status', ['upcoming', 'live', 'locked']).order('kickoff', { ascending: true }).limit(4);
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
    const tzMap: { [key: string]: string } = { 'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST', 'Africa/Lagos': 'WAT', 'Asia/Jakarta': 'WIB', 'America/New_York': 'EDT', 'Europe/London': 'BST', 'Asia/Dubai': 'GST' };
    const formatted = date.toLocaleString('en-GB', { timeZone: tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
    const tzLabel = tzMap[tz] || '';
    return formatted + (tzLabel ? ' ' + tzLabel : '');
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

  if (loading || matches.length === 0) return null;

  return (
    <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>LIVE COMPETITIONS</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>Upcoming Matches</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>Predict before kick-off. Your call is locked forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {matches.map((match) => {
            const countdown = getCountdown(match.kickoff);
            const utcString = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
            const kickoffPast = new Date(utcString).getTime() < now.getTime();
            const isLive = match.status === 'live';
            return (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (isLive ? '#2E9E5E' : '#1A7A4A'), borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                <div style={{ minWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                  {isLive ? (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '999px' }}>LIVE</span>
                  ) : countdown ? (
                    <span style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '999px', border: '1px solid #F59E0B' }}>{countdown}</span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>Soon</span>
                  )}
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', fontWeight: 'bold' }}>{formatKickoff(match.kickoff)}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.home_team}</span>
                    <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 'bold', flexShrink: 0 }}>vs</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.away_team}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{match.competition}</div>
                </div>
                <a href="/predict" style={{ backgroundColor: kickoffPast ? 'transparent' : '#1A7A4A', color: kickoffPast ? '#6B7280' : 'white', border: kickoffPast ? '1px solid #1A3A1A' : 'none', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {kickoffPast ? 'Locked' : 'Predict →'}
                </a>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>View all upcoming matches &#x2192;</a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [useRealTicker, setUseRealTicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRealLeaderboard, setIsRealLeaderboard] = useState(false);
  const [realLeaderboard, setRealLeaderboard] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [foundingAwarded, setFoundingAwarded] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTicker = async () => {
      const { data } = await supabase.from('predictions').select('predicted_outcome, confidence_pct, profiles(username, country)').order('created_at', { ascending: false }).limit(30);
      if (data && data.length > 0) {
        const items = data.filter((p: any) => p.profiles?.username).map((p: any) => ({
          type: 'real', country: p.profiles?.country || 'Other', username: p.profiles?.username,
          pick: p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw',
          confidence: p.confidence_pct || 50,
        }));
        if (items.length >= 3) { setTickerItems(items); setUseRealTicker(true); }
      }
    };
    fetchTicker();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const userCount = count || 0;
        setTotalUsers(userCount);
        try {
          const spotsRes = await fetch('/api/founding-spots');
          const spotsData = await spotsRes.json();
          if (spotsData.awarded !== undefined) setFoundingAwarded(spotsData.awarded);
        } catch (e) { setFoundingAwarded(userCount); }
        if (userCount >= REAL_USER_THRESHOLD) {
          const res = await fetch('/api/leaderboard');
          const data = await res.json();
          if (data && data.length >= 5) {
            const countryMap: { [key: string]: { points: number; forecasters: number } } = {};
            data.forEach((u: any) => {
              const country = u.country || 'Other';
              if (!countryMap[country]) countryMap[country] = { points: 0, forecasters: 0 };
              countryMap[country].points += u.total_points || 0;
              countryMap[country].forecasters += 1;
            });
            const sorted = Object.entries(countryMap).sort((a, b) => b[1].points - a[1].points).slice(0, 6).map(([country, stats], i) => ({
              rank: i + 1, flag: COUNTRY_FLAGS[country] || '&#x1F30D;', country,
              forecasters: stats.forecasters.toLocaleString(), points: stats.points.toLocaleString(),
            }));
            if (sorted.length >= 3) { setRealLeaderboard(sorted); setIsRealLeaderboard(true); }
          }
        }
      } catch (err) {}
    };
    fetchLeaderboard();
  }, []);

  const staticDoubled = [...STATIC_TICKER, ...STATIC_TICKER];
  const realDoubled = useRealTicker ? [...tickerItems, ...tickerItems] : [];
  const displayTicker = useRealTicker ? realDoubled : staticDoubled;

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes countup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* TICKER */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A7A4A', overflow: 'hidden', padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'ticker 50s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {displayTicker.map((item: any, i: number) => (
            <span key={i} style={{ fontSize: '13px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {item.type === 'real' ? (
                <>
                  <span dangerouslySetInnerHTML={{ __html: COUNTRY_FLAGS[item.country] || '&#x1F30D;' }} />
                  <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>@{item.username}</span>
                  <span>predicted</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{item.pick}</span>
                  <span style={{ color: '#2E9E5E' }}>&#xB7; {item.confidence}% confidence</span>
                </>
              ) : (
                <span style={{ color: '#6B7280' }}>&#x26BD; {item}</span>
              )}
              <span style={{ color: '#1A3A20', marginLeft: '16px' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      <BuzzCounter />
      <LiveScoreCard />

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '8px 20px', marginBottom: '32px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '1px' }}>
            EPL · UCL · Liga 1 · Ghana PL · ISL — LIVE NOW
          </span>
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 8vw, 60px)', lineHeight: '1.1', marginBottom: '20px', fontWeight: 'bold', animation: 'flicker 8s infinite' }}>
          Your Football Knowledge<br />Deserves a Record.<br /><span style={{ color: '#2E9E5E' }}>Forever.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 16px' }}>
          Predict every match across 5 live competitions.<br />
          <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation. Free. No betting.</strong>
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(46,158,94,0.08)', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '6px 20px', marginBottom: '36px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {totalUsers > 0 ? 'Join ' + totalUsers + ' Founding Forecasters — ' : 'Only 100 Founding Forecaster spots — '}
            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>Exclusive badge. Never awarded again.</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
          <CTAButton label="&#x26BD; START PREDICTING FREE" size="lg" />
          <p style={{ fontSize: '12px', color: '#4B5563', margin: 0 }}>Free forever. No card required. 10-second sign-up.</p>
          <a href="/how-to-play" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>How it works &#x2192;</a>
        </div>

        <div style={{ display: 'inline-block', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '14px 24px', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center' }}>YOUR DATA. YOUR RULES.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[{ icon: '&#x1F512;', text: 'Your data stays yours' }, { icon: '&#x1F6E1;', text: 'Encrypted & Secure' }, { icon: '&#x1F6AB;', text: 'Never Sold' }, { icon: '&#x1F193;', text: 'Always Free' }].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <span style={{ fontSize: '12px', color: '#6EE7B7', fontWeight: 'bold' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap' }}>
          {[{ value: '5', label: 'Live Competitions' }, { value: '380+', label: 'EPL Matches' }, { value: '125+', label: 'UCL Matches' }].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', animation: 'countup 0.6s ease ' + (i * 0.2) + 's both' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE COMPETITIONS GRID */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '48px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>PREDICT ACROSS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', textAlign: 'center', marginBottom: '28px' }}>5 Live Competitions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {LIVE_COMPETITIONS.map(({ icon, name, desc, color }) => (
              <a key={name} href="/predict" style={{ backgroundColor: '#0D2B14', border: '1px solid ' + color + '40', borderRadius: '14px', padding: '20px 16px', textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <div style={{ fontSize: '13px', color: color, fontWeight: 'bold', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <UpcomingMatches />

      {/* MID-PAGE CTA */}
      <section style={{ backgroundColor: '#0A1A0C', borderTop: '1px solid #1A7A4A', borderBottom: '1px solid #1A7A4A', padding: '48px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>READY TO PROVE IT?</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '8px' }}>Your football knowledge deserves a record.</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Every prediction you make is sealed at kick-off. No edits. No luck. Pure football intelligence.</p>
        <CTAButton label="&#x26BD; START PREDICTING FREE" size="md" />
        <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '12px' }}>Free forever. 10-second sign-up.</p>
      </section>

      {/* TENSION */}
      <section style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '28px' }}>YOU KNOW THIS FEELING</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { moment: '"I said Arsenal wins the title. Nobody believed me."', emotion: 'VINDICATION' },
              { moment: '"I called the exact score. 2-1. Before anyone."', emotion: 'GLORY' },
              { moment: '"My country vs yours. I\'ll put my reputation on it."', emotion: 'NATIONAL PRIDE' },
              { moment: '"This upset is coming. I feel it in my bones."', emotion: 'INSTINCT' },
            ].map(({ moment, emotion }) => (
              <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px 24px', textAlign: 'left' }}>
                <div style={{ fontSize: '32px', minWidth: '44px', textAlign: 'center' }}>&#x26A1;</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', color: 'white', fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{moment}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '2px', fontWeight: 'bold' }}>{emotion}</div>
                </div>
                <a href="/auth" style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', backgroundColor: '#0D1F0F', padding: '6px 14px', borderRadius: '999px', whiteSpace: 'nowrap', textDecoration: 'none' }}>Prove it &#x2192;</a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '28px', fontStyle: 'italic' }}>Flipseer turns that feeling into permanent proof.</p>
        </div>
      </section>

      {/* NATIONAL PRIDE */}
      <section style={{ padding: '72px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>NATIONAL PRIDE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', marginBottom: '12px' }}>Which nation will you represent?</h2>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '40px' }}>Every prediction earns points for your country. India vs Brazil. England vs Argentina. The rivalry is real.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {TOP_NATIONS.map(({ flag, name, slug }) => (
            <a key={slug} href={'/predict'} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 8px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: flag }} />
              <div style={{ fontSize: '12px', color: '#D1FAE5', fontWeight: 'bold' }}>{name}</div>
            </a>
          ))}
        </div>
        {isRealLeaderboard && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', maxWidth: '560px', margin: '0 auto 16px' }}>
              <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                <span>RANK · NATION</span>
                <span style={{ color: '#2E9E5E', fontSize: '10px' }}>LIVE · FORECASTERS · POINTS</span>
              </div>
              {realLeaderboard.map(({ rank, flag, country, forecasters, points }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 'bold', minWidth: '28px' }}>#{rank}</span>
                  <span style={{ fontSize: '20px', marginRight: '10px' }} dangerouslySetInnerHTML={{ __html: flag }} />
                  <span style={{ flex: 1, fontSize: '15px', color: 'white' }}>{country}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280', marginRight: '16px' }}>{forecasters}</span>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 'bold' }}>{points} pts</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>Every prediction you make moves your nation up the table.</p>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>From prediction to legend.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[
              { step: '01', icon: '&#x1F3AF;', title: 'Call the match', desc: 'Pick the winner. Predict the exact score. Set your confidence before kick-off.' },
              { step: '02', icon: '&#x1F512;', title: 'It locks forever', desc: 'Once the whistle blows, your call is sealed. No edits. No excuses. Just your word.' },
              { step: '03', icon: '&#x26A1;', title: 'Earn reputation', desc: 'Correct calls earn points. Upsets earn glory. Exact scores earn legend status.' },
              { step: '04', icon: '&#x1F451;', title: 'Build your legacy', desc: 'Competition after competition. Your profile grows. Your reputation is permanent.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '28px 24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>STEP {step}</div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <h3 style={{ fontSize: '17px', color: '#2E9E5E', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/how-to-play" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>Full guide: scoring, badges and more &#x2192;</a>
          </div>
        </div>
      </section>

      {/* PRIVATE LEAGUES */}
      <section style={{ padding: '72px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>CHALLENGE YOUR FRIENDS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '12px' }}>Join your friends on Flipseer.</h2>
          <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '36px', lineHeight: '1.7' }}>Create a private league. Predict together. Your group's football reputation, on record forever.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
            {[
              { icon: '&#x1F465;', title: 'Private Leagues', desc: 'Create your group, share the code. Only your people in.' },
              { icon: '&#x1F3C6;', title: 'Your Group Table', desc: 'See who in your circle is the real football brain.' },
              { icon: '&#x1F4F2;', title: 'WhatsApp Ready', desc: 'Share your picks and your group link in one tap.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '28px 20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
          <a href="/groups" style={{ display: 'inline-block', backgroundColor: 'transparent', color: '#2E9E5E', border: '1px solid #2E9E5E', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            &#x1F465; CREATE A GROUP
          </a>
          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '8px' }}>Or join an existing group with a code from your friends.</p>
        </div>
      </section>

      {/* NO BETTING */}
      <section style={{ padding: '72px 20px', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>THE PROMISE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px' }}>Pure football.<br /><span style={{ color: '#2E9E5E' }}>Nothing else.</span></h2>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '40px', lineHeight: '1.7' }}>No money. No odds. No gambling. Just football intelligence.<br />The beautiful game. The right way.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[{ icon: '&#x1F6AB;', text: 'No Betting. Ever.' }, { icon: '&#x1F916;', text: 'No AI Tips.' }, { icon: '&#x1F4D6;', text: 'Permanent Record.' }, { icon: '&#x1F30D;', text: 'Global Rankings.' }, { icon: '&#x1F193;', text: 'Always Free.' }].map(({ icon, text }) => (
            <div key={text} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: icon }} />
              <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 'bold' }}>{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: 'center', padding: '80px 20px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>&#x26BD;</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', marginBottom: '16px', lineHeight: '1.2' }}>
          5 competitions live.<br /><span style={{ color: '#2E9E5E' }}>Will your record be ready?</span>
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '36px', fontSize: '17px', lineHeight: '1.7' }}>The forecasters who start now build the longest record.<br />Your legacy clock is ticking.</p>
        <CTAButton label="&#x26BD; START PREDICTING FREE" size="lg" />
        <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '16px' }}>Free to join. Always.</p>
      </section>

      <StickyMobileCTA user={user} />
    </main>
  );
}
