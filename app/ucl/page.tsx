'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();
// UCL 2026/27 Group Stage teams (32 clubs)
const UCL_GROUPS = [
  { group: 'A', teams: ['Real Madrid', 'Juventus', 'Benfica', 'Club Brugge'] },
  { group: 'B', teams: ['Manchester City', 'Inter Milan', 'Porto', 'Red Star Belgrade'] },
  { group: 'C', teams: ['Bayern Munich', 'Barcelona', 'Shakhtar Donetsk', 'Viktoria Plzen'] },
  { group: 'D', teams: ['PSG', 'Borussia Dortmund', 'AC Milan', 'Newcastle United'] },
  { group: 'E', teams: ['Chelsea', 'Atletico Madrid', 'Salzburg', 'Dinamo Zagreb'] },
  { group: 'F', teams: ['Tottenham', 'Marseille', 'Ajax', 'Sporting CP'] },
  { group: 'G', teams: ['Arsenal', 'PSV Eindhoven', 'Lens', 'Sevilla'] },
  { group: 'H', teams: ['Liverpool', 'Napoli', 'Rangers', 'Ajax'] },
];
const UCL_FACTS = [
  { icon: '🏆', label: 'Competition', value: 'UEFA Champions League' },
  { icon: '📅', label: 'Group Stage starts', value: 'September 17, 2026' },
  { icon: '⚽', label: 'Fixtures synced', value: '90 matches' },
  { icon: '🌍', label: 'Nations', value: '15+ countries' },
  { icon: '🏟️', label: 'Final', value: 'May 2027' },
  { icon: '🆓', label: 'Cost', value: 'Free forever' },
];
export default function UCLPage() {
  const [mounted, setMounted] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [uclMatches, setUclMatches] = useState<any[]>([]);
  const [totalUCL, setTotalUCL] = useState(90);
  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        // Fetch user rank
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
        // Fetch upcoming UCL matches
        const { data: matches } = await supabase
          .from('matches')
          .select('id, home_team, away_team, kickoff, status, round')
          .eq('competition', 'UCL 2026/27')
          .in('status', ['upcoming', 'live'])
          .order('kickoff', { ascending: true })
          .limit(8);
        setUclMatches(matches || []);
        // Total UCL count
        const { count } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('competition', 'UCL 2026/27');
        if (count) setTotalUCL(count);
      } catch (e) {}
    };
    init();
  }, []);
  const getCountdown = () => {
    const uclStart = new Date('2026-09-17T18:45:00Z');
    const diff = uclStart.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };
  const formatKickoff = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const date = new Date(utc);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzMap: { [k: string]: string } = { 'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST', 'Africa/Lagos': 'WAT', 'Asia/Jakarta': 'WIB', 'Europe/London': 'BST' };
    return date.toLocaleString('en-GB', { timeZone: tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) + (tzMap[tz] ? ' ' + tzMap[tz] : '');
  };
  const countdown = mounted ? getCountdown() : null;
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #0D1F0F 100%)', padding: '48px 20px 40px', borderBottom: '1px solid #1E1B4B', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8B5CF6', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>UEFA CHAMPIONS LEAGUE 2026/27</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>⭐</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,48px)', marginBottom: '10px', lineHeight: 1.1 }}>
          Champions League<br /><span style={{ color: '#8B5CF6' }}>2026/27</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Europe's greatest club competition. Predict every match — from group stage to the final. Your record carries over from EPL.
        </p>
        {/* Countdown */}
        {countdown && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '12px', padding: '12px 24px', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Group Stage starts in</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6', fontFamily: 'Georgia, serif' }}>{countdown}</span>
          </div>
        )}
        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Fixtures', value: totalUCL + '+' },
            { label: 'Clubs', value: '32' },
            { label: 'Starts', value: 'Sep 17' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6', fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px 0' }}>
        {/* YOUR RANK */}
        {mounted && userRank && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', animation: 'slideIn 0.4s ease' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', fontFamily: 'Georgia, serif' }}>#{userRank}</div>
            <div>
              <div style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: 'bold', marginBottom: '2px' }}>YOUR GLOBAL RANK</div>
              <div style={{ fontSize: '14px', color: 'white' }}>@{username} — your EPL reputation carries into UCL</div>
            </div>
            <a href="/predict" style={{ marginLeft: 'auto', backgroundColor: '#8B5CF6', color: 'white', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Predict Now →
            </a>
          </div>
        )}
        {/* UPCOMING UCL MATCHES */}
        {uclMatches.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>UPCOMING UCL FIXTURES</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {uclMatches.map((match) => (
                <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ minWidth: '70px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{match.round?.replace('Regular Season - ', 'MD') || 'UCL'}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{formatKickoff(match.kickoff)}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{match.home_team}</span>
                    <span style={{ fontSize: '11px', color: '#6B7280', margin: '0 8px' }}>vs</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{match.away_team}</span>
                  </div>
                  <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Predict →
                  </a>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <a href="/predict" style={{ color: '#8B5CF6', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>View all UCL fixtures →</a>
            </div>
          </div>
        )}
        {/* COMING SOON — Group Stage */}
        {uclMatches.length === 0 && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '8px' }}>Group Stage starts September 17</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Qualifying rounds are complete. Group stage fixtures open for predictions soon.</p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              Predict EPL While You Wait →
            </a>
          </div>
        )}
        {/* KEY FACTS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>COMPETITION FACTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {UCL_FACTS.map(({ icon, label, value }) => (
              <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* PERMANENT REPUTATION CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1A0B2E 0%, #0D2B14 100%)', border: '2px solid #8B5CF6', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}>
          <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>ONE PERMANENT RECORD</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '12px' }}>
            EPL → UCL → ISL.<br />
            <span style={{ color: '#8B5CF6' }}>Your reputation never resets.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
            Every prediction you make in the EPL carries into UCL. Every correct call in UCL builds on your EPL record. One profile. Every competition. Forever.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
            ⭐ Start Predicting UCL Free →
          </a>
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '10px' }}>Free forever · No betting · No card required</p>
        </div>
        {/* LINK BACK TO EPL */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/epl" style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', color: '#9CA3AF', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27 →
          </a>
          <a href="/nations" style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', color: '#9CA3AF', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
            🌍 Nation Battle →
          </a>
          <a href="/leaderboard" style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', color: '#9CA3AF', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
            🏆 Leaderboard →
          </a>
        </div>
      </div>
    </main>
  );
}
