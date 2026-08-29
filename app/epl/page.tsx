'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

export default function EPLPage() {
  const [mounted, setMounted] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('username, total_points').eq('id', session.user.id).single();
          if (profile) {
            setUsername(profile.username);
            const { data: all } = await supabase.from('profiles').select('total_points').gt('total_points', 0).order('total_points', { ascending: false });
            const rank = (all || []).findIndex((p: any) => p.total_points <= profile.total_points) + 1;
            if (rank > 0) setUserRank(rank);
          }
        }
        const { data: matches } = await supabase.from('matches')
          .select('id, home_team, away_team, kickoff, status, round')
          .eq('competition', 'EPL 2026/27')
          .in('status', ['upcoming', 'live'])
          .order('kickoff', { ascending: true })
          .limit(8);
        setUpcomingMatches(matches || []);
        const { count: done } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('competition', 'EPL 2026/27').eq('status', 'completed');
        const { count: upcoming } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('competition', 'EPL 2026/27').in('status', ['upcoming', 'live']);
        setCompletedCount(done || 0);
        setUpcomingCount(upcoming || 0);
      } catch (e) {}
    };
    init();
  }, []);

  const formatKickoff = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const date = new Date(utc);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzMap: { [k: string]: string } = {
      'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST',
      'Africa/Lagos': 'WAT', 'Asia/Jakarta': 'WIB', 'Europe/London': 'BST',
    };
    return date.toLocaleString('en-GB', {
      timeZone: tz, weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }) + (tzMap[tz] ? ' ' + tzMap[tz] : '');
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .match-row:hover{background:rgba(139,92,246,0.08)!important}
        .match-row{transition:background 0.1s}
      `}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(139,92,246,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, letterSpacing: '2px' }}>PREMIER LEAGUE 2026/27 · LIVE NOW</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Premier League<br /><span style={{ color: '#8B5CF6' }}>2026/27</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 24px' }}>
          {userRank && username
            ? <>You are ranked <strong style={{ color: '#F59E0B' }}>#{userRank} globally</strong>. Every EPL prediction builds your permanent Football Reputation.</>
            : <>380 matches. 20 clubs. One permanent record. Predict every EPL match before kickoff — locked forever.</>}
        </p>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {[
            { label: 'Completed', value: completedCount, color: '#2E9E5E' },
            { label: 'Upcoming', value: upcomingCount, color: '#8B5CF6' },
            { label: 'Total', value: 380, color: '#9CA3AF' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(139,92,246,0.35)' }}>
            Predict EPL Now →
          </a>
          <a href="/results" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            Results →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Free forever · No betting · No card required</p>
      </section>

      {/* UPCOMING MATCHES */}
      {upcomingMatches.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px' }}>UPCOMING EPL FIXTURES</p>
              <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>Predict all →</a>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, overflow: 'hidden' }}>
              {upcomingMatches.map((match, i) => (
                <div key={match.id} className="match-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                      {match.home_team} <span style={{ color: '#4B5563', fontWeight: 400 }}>vs</span> {match.away_team}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{match.round?.replace('Regular Season - ', 'MW')} · {formatKickoff(match.kickoff)}</div>
                  </div>
                  <a href="/predict" style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, backgroundColor: 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: 999, flexShrink: 0, textDecoration: 'none' }}>
                    Predict →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ONE RECORD */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>ONE RECORD. EVERY COMPETITION.</p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>Your points never reset.</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20, fontSize: 'clamp(13px,2.5vw,15px)', color: '#9CA3AF' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 700 }}>World Cup 2026</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#8B5CF6', fontWeight: 700 }}>EPL 2026/27</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#A78BFA', fontWeight: 700 }}>UCL 2026/27</span>
            <span style={{ color: '#1A3A1A' }}>+</span>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>ISL · NPFL · Liga 1</span>
          </div>
          <p style={{ color: '#4B5563', fontSize: 13, marginBottom: 24 }}>= Your permanent football reputation. Growing forever.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/ucl', label: '⭐ UCL' },
              { href: '/ghana', label: '🇬🇭 Ghana PL' },
              { href: '/indonesia', label: '🇮🇩 Liga 1' },
              { href: '/nations', label: '🌍 Nations' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontSize: 12, color: '#8895A3' }}>{label}</a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
