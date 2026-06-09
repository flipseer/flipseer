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
};

const STATIC_TICKER = [
  'World Cup 2026 kicks off June 11 -- 104 matches to predict',
  'Predict exact scores for up to 108 pts per match',
  'Represent your nation on the global leaderboard',
  'Your predictions lock at kick-off -- forever on record',
  'No betting. No luck. Pure football intelligence.',
  'June 11 -- Mexico vs South Africa -- Group A kicks off',
  'Build your permanent football reputation -- free forever',
  'Every correct call earns points toward your legacy',
];

const COMING_SOON = [
  { icon: '&#x1F3C6;', title: 'EPL & Champions League', desc: "Europe's biggest stages. Your biggest calls.", date: 'Aug 2026' },
  { icon: '&#x1F1EA;&#x1F1F8;', title: 'La Liga & Serie A', desc: 'El Clasico. Derby della Madonnina. Predict them all.', date: 'Sep 2026' },
  { icon: '&#x1F1E9;&#x1F1EA;', title: 'Bundesliga & Ligue 1', desc: 'Der Klassiker. PSG. The rivalries never end.', date: 'Oct 2026' },
  { icon: '&#x1F91D;', title: 'Brand Partnerships', desc: "Exclusive rewards from the world's top football brands.", date: 'Late 2026' },
];

const REAL_USER_THRESHOLD = 100;

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
  { flag: '&#x1F1F5;&#x1F1F9;', name: 'Portugal', slug: 'portugal' },
];

// -- DYNAMIC BANNER with real spots count --
function DynamicBanner() {
  const [bannerText, setBannerText] = useState('FIFA World Cup 2026 -- Build your football reputation!');
  const [bgColor, setBgColor] = useState('#1A7A4A');
  const [mounted, setMounted] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(83);

  const updateBannerText = (spots: number) => {
    const now = new Date();
    const kickoff = new Date('2026-06-11T19:00:00Z');
    const diff = kickoff.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.ceil(diff / (1000 * 60 * 60));
    const minutesLeft = Math.ceil(diff / (1000 * 60));

    if (diff <= 0) {
      setBannerText('LIVE NOW -- Mexico vs South Africa -- Predict before it locks!');
      setBgColor('#EF4444');
    } else if (minutesLeft <= 60) {
      setBannerText('KICKS OFF IN ' + minutesLeft + ' MINUTES -- Last chance to predict!');
      setBgColor('#EF4444');
    } else if (hoursLeft <= 24) {
      setBannerText('TODAY -- Mexico vs South Africa kicks off 19:00 UTC -- Predict NOW!');
      setBgColor('#DC2626');
    } else if (daysLeft === 1) {
      setBannerText('TOMORROW -- World Cup kicks off! Only ' + spots + ' Founding spots left!');
      setBgColor('#B45309');
    } else if (daysLeft === 2) {
      setBannerText('2 DAYS TO GO -- Only ' + spots + ' Founding Forecaster spots remaining!');
      setBgColor('#92400E');
    } else if (daysLeft === 3) {
      setBannerText('3 DAYS TO GO -- Only ' + spots + ' Founding Forecaster spots left!');
      setBgColor('#1A7A4A');
    } else if (daysLeft <= 7) {
      setBannerText(daysLeft + ' days until World Cup -- Only ' + spots + ' Founding spots left!');
      setBgColor('#1A7A4A');
    } else {
      setBannerText('FIFA World Cup 2026 starts June 11 -- Build your permanent football reputation!');
      setBgColor('#1A7A4A');
    }
  };

  useEffect(() => {
    setMounted(true);

    // Fetch real founding forecaster count from DB
    const fetchSpots = async () => {
      try {
        const res = await fetch('/api/founding-spots');
        const data = await res.json();
        if (data.spots_left !== undefined) {
          setSpotsLeft(data.spots_left);
          updateBannerText(data.spots_left);
        }
      } catch (e) {
        updateBannerText(83);
      }
    };
    fetchSpots();

    // Refresh countdown every minute
    const interval = setInterval(() => {
      setSpotsLeft(prev => { updateBannerText(prev); return prev; });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: bgColor, padding: '10px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>
          &#x26BD; {bannerText}
        </span>
        <a href="/auth" style={{ backgroundColor: 'white', color: bgColor, padding: '5px 18px', borderRadius: '999px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          Join Free &#x2192;
        </a>
      </div>
    </div>
  );
}

// -- LIVE SCORECARD COMPONENT --
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
      } else {
        setLiveMatches([]);
      }
    } catch (e) {
      setLiveMatches([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLive();
    // Poll every 60 seconds
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
            <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #EF444440', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', boxShadow: '0 0 16px rgba(239,68,68,0.08)' }}>
              {/* Minute */}
              <div style={{ minWidth: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#EF4444', fontWeight: 'bold' }}>
                  {match.elapsed ? match.elapsed + "'" : 'LIVE'}
                </div>
                <div style={{ fontSize: '10px', color: '#4B5563', marginTop: '2px' }}>
                  {match.status === 'HT' ? 'HT' : match.status === 'FT' ? 'FT' : ''}
                </div>
              </div>
              {/* Teams + Score */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', textAlign: 'right', flex: 1 }}>{match.home}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '6px 16px', minWidth: '80px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.home_score}</span>
                  <span style={{ fontSize: '16px', color: '#4B5563' }}>-</span>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.away_score}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', textAlign: 'left', flex: 1 }}>{match.away}</span>
              </div>
              {/* Round */}
              <div style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                {match.round?.replace('Group Stage - ', 'Group ')}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a href="/predict" style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', textDecoration: 'none' }}>
            &#x1F3AF; Predict upcoming matches &#x2192;
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

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select('id, home_team, away_team, kickoff, status, league')
        .in('status', ['upcoming', 'live', 'locked'])
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
      'Africa/Lagos': 'WAT', 'Africa/Abuja': 'WAT',
      'Asia/Jakarta': 'WIB', 'America/Mexico_City': 'CST',
      'America/New_York': 'EDT', 'Europe/London': 'BST',
      'Asia/Dubai': 'GST', 'Asia/Singapore': 'SGT',
      'Asia/Tokyo': 'JST', 'America/Sao_Paulo': 'BRT',
    };
    const formatted = date.toLocaleString('en-GB', {
      timeZone: tz, day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
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

  const isLive = (kickoff: string, status: string) => {
    if (status === 'live') return true;
    const utcString = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const diff = now.getTime() - new Date(utcString).getTime();
    return diff > 0 && diff < 105 * 60 * 1000;
  };

  if (loading || matches.length === 0) return null;

  return (
    <section style={{ padding: '64px 20px', borderBottom: '1px solid #1A3A1A' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>WORLD CUP 2026</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>Upcoming Matches</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>Predict before kick-off. Your call is locked forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {matches.map((match) => {
            const live = isLive(match.kickoff, match.status);
            const countdown = getCountdown(match.kickoff);
            const utcString = match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z';
            const kickoffPast = new Date(utcString).getTime() < now.getTime();
            return (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (live ? '#2E9E5E' : '#1A7A4A'), borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: live ? '0 0 20px rgba(46,158,94,0.15)' : 'none' }}>
                <div style={{ minWidth: '90px', textAlign: 'center' }}>
                  {live ? (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '999px', letterSpacing: '1px' }}>LIVE</span>
                  ) : countdown ? (
                    <span style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '999px', border: '1px solid #F59E0B' }}>{countdown}</span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>Soon</span>
                  )}
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', fontWeight: 'bold' }}>{formatKickoff(match.kickoff)}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white' }}>{match.home_team}</span>
                    <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 'bold' }}>vs</span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'white' }}>{match.away_team}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{match.league}</div>
                </div>
                <a href="/predict" style={{ backgroundColor: kickoffPast ? 'transparent' : '#1A7A4A', color: kickoffPast ? '#6B7280' : 'white', border: kickoffPast ? '1px solid #1A3A1A' : 'none', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {kickoffPast ? 'Locked' : 'Predict ->'}
                </a>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/predict" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>View all 104 World Cup matches &#x2192;</a>
        </div>
      </div>
    </section>
  );
}

const PARTICLES = [
  { id: 0, left: 5, delay: 0.0, dur: 3.0, icon: '&#x26BD;', size: 24 },
  { id: 1, left: 12, delay: 0.3, dur: 2.8, icon: '&#x1F3C6;', size: 18 },
  { id: 2, left: 20, delay: 0.1, dur: 3.2, icon: '&#x2B50;', size: 20 },
  { id: 3, left: 28, delay: 0.5, dur: 2.6, icon: '&#x26BD;', size: 28 },
  { id: 4, left: 35, delay: 0.2, dur: 3.5, icon: '&#x1F3C6;', size: 22 },
  { id: 5, left: 42, delay: 0.4, dur: 2.9, icon: '&#x26BD;', size: 16 },
  { id: 6, left: 50, delay: 0.1, dur: 3.1, icon: '&#x2B50;', size: 26 },
  { id: 7, left: 58, delay: 0.6, dur: 2.7, icon: '&#x26BD;', size: 20 },
  { id: 8, left: 65, delay: 0.3, dur: 3.3, icon: '&#x1F3C6;', size: 24 },
  { id: 9, left: 72, delay: 0.2, dur: 2.5, icon: '&#x26BD;', size: 18 },
  { id: 10, left: 80, delay: 0.5, dur: 3.0, icon: '&#x2B50;', size: 22 },
  { id: 11, left: 88, delay: 0.1, dur: 2.8, icon: '&#x26BD;', size: 28 },
  { id: 12, left: 95, delay: 0.4, dur: 3.4, icon: '&#x1F3C6;', size: 20 },
  { id: 13, left: 15, delay: 0.7, dur: 2.6, icon: '&#x26BD;', size: 16 },
  { id: 14, left: 45, delay: 0.8, dur: 3.2, icon: '&#x2B50;', size: 24 },
  { id: 15, left: 75, delay: 0.6, dur: 2.9, icon: '&#x26BD;', size: 20 },
];

function WelcomeConfetti() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem('flipseer_welcome');
    if (!seen) {
      setShow(true);
      sessionStorage.setItem('flipseer_welcome', '1');
      const timer = setTimeout(() => setShow(false), 4500);
      return () => clearTimeout(timer);
    }
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      <style>{`
        @keyframes fall { 0% { transform: translateY(-60px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(540deg); opacity: 0; } }
        @keyframes fadeWelcome { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } 20% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 75% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } }
      `}</style>
      <div style={{ position: 'fixed', top: '50%', left: '50%', textAlign: 'center', animation: 'fadeWelcome 4s forwards', zIndex: 1000, pointerEvents: 'none', backgroundColor: 'rgba(13,31,15,0.92)', border: '2px solid #2E9E5E', borderRadius: '20px', padding: '32px 48px', boxShadow: '0 0 60px rgba(46,158,94,0.4)' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>&#x26BD;</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: 'white', fontWeight: 'bold' }}>Welcome to Flipseer!</div>
        <div style={{ fontSize: '15px', color: '#2E9E5E', marginTop: '8px' }}>Build your permanent football legacy</div>
        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>World Cup 2026 &#xB7; June 11</div>
      </div>
      {PARTICLES.map((p) => (
        <div key={p.id} dangerouslySetInnerHTML={{ __html: p.icon }}
          style={{ position: 'absolute', left: p.left + '%', top: '-60px', fontSize: p.size + 'px', animation: 'fall ' + p.dur + 's ' + p.delay + 's ease-in forwards' }}
        />
      ))}
    </div>
  );
}

// -- STICKY BOTTOM CTA --
function StickyBottomCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(83);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fetch real spots
    fetch('/api/founding-spots')
      .then(r => r.json())
      .then(d => { if (d.spots_left !== undefined) setSpotsLeft(d.spots_left); })
      .catch(() => {});

    // Show after scrolling 400px
    const onScroll = () => {
      if (window.scrollY > 400 && !dismissed) setVisible(true);
      else if (window.scrollY <= 400) setVisible(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (!mounted || dismissed || !visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, padding: '12px 16px 20px', background: 'linear-gradient(180deg, transparent 0%, #0D1F0F 20%)', pointerEvents: 'none' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', pointerEvents: 'all' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 -4px 32px rgba(46,158,94,0.25)' }}>
          {/* Left: urgency text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>
              &#x26BD; Only <span style={{ color: '#F59E0B' }}>{spotsLeft} spots</span> left
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Founding Forecaster badge -- never awarded again
            </div>
          </div>
          {/* CTA Button */}
          <a href="/auth" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '10px 18px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(46,158,94,0.4)', flexShrink: 0 }}>
            Join Free &#x2192;
          </a>
          {/* Dismiss */}
          <button onClick={() => setDismissed(true)} style={{ backgroundColor: 'transparent', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: '18px', padding: '0 4px', flexShrink: 0, lineHeight: 1 }}>
            &#x2715;
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [useRealTicker, setUseRealTicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRealLeaderboard, setIsRealLeaderboard] = useState(false);
  const [realLeaderboard, setRealLeaderboard] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const target = new Date('2026-06-12T01:00:00Z');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) { clearInterval(interval); return; }
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((diff / (1000 * 60)) % 60));
      setSeconds(Math.floor((diff / 1000) % 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTicker = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('predicted_outcome, confidence_pct, profiles(username, country)')
        .order('created_at', { ascending: false })
        .limit(30);
      if (data && data.length > 0) {
        const items = data
          .filter((p: any) => p.profiles?.username)
          .map((p: any) => ({
            type: 'real',
            country: p.profiles?.country || 'Other',
            username: p.profiles?.username,
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
        if (userCount >= REAL_USER_THRESHOLD) {
          const res = await fetch('/api/leaderboard');
          const data = await res.json();
          if (data && data.length >= 5) {
            const countryMap: { [key: string]: { points: number; forecasters: number } } = {};
            data.forEach((user: any) => {
              const country = user.country || 'Other';
              if (!countryMap[country]) countryMap[country] = { points: 0, forecasters: 0 };
              countryMap[country].points += user.total_points || 0;
              countryMap[country].forecasters += 1;
            });
            const sorted = Object.entries(countryMap)
              .sort((a, b) => b[1].points - a[1].points)
              .slice(0, 6)
              .map(([country, stats], i) => ({
                rank: i + 1,
                flag: COUNTRY_FLAGS[country] || '&#x1F30D;',
                country,
                forecasters: stats.forecasters.toLocaleString(),
                points: stats.points.toLocaleString(),
              }));
            if (sorted.length >= 3) { setRealLeaderboard(sorted); setIsRealLeaderboard(true); }
          }
        }
      } catch (err) { console.error('Leaderboard error:', err); }
    };
    fetchLeaderboard();
  }, []);

  const staticDoubled = [...STATIC_TICKER, ...STATIC_TICKER];
  const realDoubled = useRealTicker ? [...tickerItems, ...tickerItems] : [];
  const displayTicker = useRealTicker ? realDoubled : staticDoubled;

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>
      <WelcomeConfetti />
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

      {/* DYNAMIC BANNER */}
      <DynamicBanner />

      {/* LIVE SCORECARD - shows only during matches */}
      <LiveScoreCard />

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div suppressHydrationWarning style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '8px 20px', marginBottom: '32px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span suppressHydrationWarning style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '1px' }}>
            {mounted ? 'WORLD CUP 2026 \u00B7 ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's' : 'WORLD CUP 2026 \u00B7 June 11, 2026'}
          </span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '60px', lineHeight: '1.1', marginBottom: '20px', fontWeight: 'bold', animation: 'flicker 8s infinite' }}>
          104 Matches.<br />Your Record.<br /><span style={{ color: '#2E9E5E' }}>Forever.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 16px' }}>
          Predict every FIFA World Cup 2026 match before kick-off.<br />
          <strong style={{ color: '#D1FAE5' }}>Build your permanent football reputation. Free. No betting.</strong>
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(46,158,94,0.08)', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '6px 20px', marginBottom: '32px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {totalUsers > 0 ? 'Join ' + totalUsers + ' Founding Forecasters -- ' : 'Only 100 Founding Forecaster spots -- '}
            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>Exclusive badge. Never awarded again.</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <a href="/auth" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '18px 44px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 40px rgba(46,158,94,0.35)' }}>
            Sign-in/Sign-up to claim Your Record &#x2192;
          </a>
          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '8px' }}>Sign up free in 10 seconds. No card required.</p>
          <a href="/how-to-play" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '18px 44px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
            How It Works
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap' }}>
          {[{ value: '104', label: 'Matches to Predict' }, { value: '48', label: 'Nations' }, { value: '39', label: 'Days of Football' }].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', animation: 'countup 0.6s ease ' + (i * 0.2) + 's both' }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <UpcomingMatches />

      {/* TENSION */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '28px' }}>YOU KNOW THIS FEELING</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { moment: '"I said Brazil wins this. Nobody believed me."', emotion: 'Vindication' },
              { moment: '"I called the exact score. 2-1. Before anyone."', emotion: 'Glory' },
              { moment: '"My country vs yours. I\'ll put my reputation on it."', emotion: 'National Pride' },
              { moment: '"This upset is coming. I feel it in my bones."', emotion: 'Instinct' },
            ].map(({ moment, emotion }) => (
              <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px 24px', textAlign: 'left' }}>
                <div style={{ fontSize: '32px', minWidth: '44px', textAlign: 'center' }}>&#x26A1;</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', color: 'white', fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{moment}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '2px', fontWeight: 'bold' }}>{emotion.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', backgroundColor: '#0D1F0F', padding: '6px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Prove it &#x2192;</div>
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
            <a key={slug} href={'/world-cup-2026/' + slug} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 8px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: flag }} />
              <div style={{ fontSize: '12px', color: '#D1FAE5', fontWeight: 'bold' }}>{name}</div>
            </a>
          ))}
        </div>
        <a href="/world-cup-2026" style={{ color: '#2E9E5E', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>See all 48 nations and groups &#x2192;</a>
        <div style={{ marginTop: '48px' }}>
          {isRealLeaderboard ? (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', maxWidth: '560px', margin: '0 auto 16px' }}>
              <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                <span>RANK &#xB7; NATION</span>
                <span style={{ color: '#2E9E5E', fontSize: '10px' }}>LIVE &#xB7; FORECASTERS &#xB7; POINTS</span>
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
          ) : (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', maxWidth: '560px', margin: '0 auto 16px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#050E05', padding: '14px 20px', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>GLOBAL NATION LEADERBOARD -- LAUNCHING JUNE 11</div>
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x1F30D;</div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Your nation needs you.</p>
                <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '16px', lineHeight: '1.7' }}>The national leaderboard goes live June 11.<br />Early predictors shape their country's position from day one.</p>
                <p style={{ fontSize: '13px', color: '#4B5563' }}>
                  {totalUsers > 0
                    ? totalUsers + ' forecasters registered -- ' + (REAL_USER_THRESHOLD - totalUsers > 0 ? (REAL_USER_THRESHOLD - totalUsers) + ' more until live rankings' : 'rankings activating soon!')
                    : "Be among the founding forecasters. Claim your country's #1 spot."
                  }
                </p>
              </div>
            </div>
          )}
          <p style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic', marginTop: '8px' }}>Every prediction you make moves your nation up the table.</p>
        </div>
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
              { step: '04', icon: '&#x1F451;', title: 'Build your legacy', desc: 'Tournament after tournament. Your profile grows. Your reputation is permanent.' },
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

      {/* ROADMAP */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>ROADMAP</p>
          <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '34px', marginBottom: '8px' }}>The World Cup is just the start.</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>EPL. Champions League. El Clasico. Der Klassiker. Your reputation builds forever.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {COMING_SOON.map(({ icon, title, desc, date }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '26px', minWidth: '40px', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{desc}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM CTA */}
      <StickyBottomCTA />

      {/* FINAL CTA */}
      <section style={{ textAlign: 'center', padding: '80px 20px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>&#x1F3C6;</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', marginBottom: '16px', lineHeight: '1.2' }}>
          June 11. The whistle blows.<br /><span style={{ color: '#2E9E5E' }}>Will your record be ready?</span>
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '36px', fontSize: '17px', lineHeight: '1.7' }}>The forecasters who start now will have a head start.<br />Your legacy clock is ticking.</p>
        <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '20px 56px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 0 50px rgba(46,158,94,0.4)' }}>
          Start Your Legacy Now &#x2192;
        </a>
        <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '16px' }}>Free to join. Always.</p>
      </section>
    </main>
  );
}
