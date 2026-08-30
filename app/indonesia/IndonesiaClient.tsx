'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const LIGA1_CLUBS = [
  'Arema FC', 'Bali United', 'Persebaya Surabaya', 'Persija Jakarta',
  'PSM Makassar', 'Persib Bandung', 'Bhayangkara FC', 'PSIM Yogyakarta',
  'Persik Kediri', 'Dewa United', 'PSS Sleman', 'Persita Tangerang',
  'Adhyaksa', 'PSBS Biak', 'Madura United', 'Barito Putera',
  'Semen Padang', 'PSIS Semarang',
];

export default function IndonesiaClient() {
  const [mounted, setMounted] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [totalMatches, setTotalMatches] = useState(306);

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
          .eq('competition', 'Liga 1 2026/27')
          .in('status', ['upcoming', 'live'])
          .order('kickoff', { ascending: true })
          .limit(8);
        setUpcomingMatches(matches || []);
        const { count } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('competition', 'Liga 1 2026/27');
        if (count) setTotalMatches(count);
      } catch (e) {}
    };
    init();
  }, []);

  const formatKickoff = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const date = new Date(utc);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return date.toLocaleString('en-GB', { timeZone: tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCountdown = () => {
    const start = new Date('2026-09-04T08:30:00Z');
    const diff = start.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  const countdown = mounted ? getCountdown() : null;

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .match-row:hover{background:rgba(206,17,38,0.08)!important} .match-row{transition:background 0.1s}`}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#1A0005 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(206,17,38,0.07) 0%,transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(206,17,38,0.1)', border: '1px solid rgba(206,17,38,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#CE1126', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
          <span style={{ fontSize: 12, color: '#CE1126', fontWeight: 700, letterSpacing: '2px' }}>LIGA 1 INDONESIA 2026/27</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🇮🇩</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Liga 1 Indonesia<br/><span style={{ color: '#CE1126' }}>2026/27</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 32px' }}>
          {userRank && username
            ? <>Kamu berada di peringkat <strong style={{ color: '#CE1126' }}>#{userRank} global</strong>. Setiap prediksi Liga 1 membangun reputasi sepakbolamu selamanya.</>
            : <>Arema. Bali United. Persebaya. Persib. Prediksi setiap pertandingan Liga 1. Bangun reputasi sepakbolamu yang permanen.</>}
        </p>
        {countdown && (
          <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, backgroundColor: '#0D2B14', border: '1px solid #CE1126', borderRadius: 12, padding: '12px 24px' }}>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>Musim dimulai dalam</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#CE1126', fontFamily: 'Georgia, serif' }}>{countdown}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[{ label: totalMatches + '+', sub: 'Fixtures' }, { label: '18', sub: 'Clubs' }, { label: '34', sub: 'Matchdays' }].map(({ label, sub }) => (
            <div key={sub} style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#CE1126', fontFamily: 'Georgia, serif' }}>{label}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#CE1126', color: 'white', border: 'none', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(206,17,38,0.35)' }}>
            🇮🇩 Prediksi Liga 1 →
          </a>
          <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🌍 Nation Battle →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Gratis selamanya · Bukan judi · Tidak perlu kartu</p>
      </section>

      {/* UPCOMING MATCHES */}
      {upcomingMatches.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, letterSpacing: '3px' }}>PERTANDINGAN MENDATANG</p>
              <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>Prediksi semua →</a>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(206,17,38,0.3)', borderRadius: 14, overflow: 'hidden' }}>
              {upcomingMatches.map((match, i) => (
                <div key={match.id} className="match-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                      {match.home_team} <span style={{ color: '#4B5563', fontWeight: 400 }}>vs</span> {match.away_team}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{match.round?.replace('Regular Season - ', 'MD')} · {formatKickoff(match.kickoff)}</div>
                  </div>
                  <a href="/predict" style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, backgroundColor: 'rgba(206,17,38,0.1)', padding: '4px 10px', borderRadius: 999, flexShrink: 0, textDecoration: 'none' }}>
                    Prediksi →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLUBS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>18 KLUB · MUSIM 2026/27</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 }}>
            {LIGA1_CLUBS.map(club => (
              <div key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                {club}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REPUTATION CTA */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇮🇩</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Wakili Indonesia.<br/><span style={{ color: '#CE1126' }}>Bangun Reputasi Sepakbolamu.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Setiap prediksi Liga 1 menambah reputasi globalmu. EPL + Liga 1 + UCL — satu catatan permanen. Selamanya.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#CE1126', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(206,17,38,0.3)', marginBottom: 16 }}>
            🇮🇩 Mulai Prediksi Liga 1 →
          </a>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ href: '/epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' }, { href: '/ucl', label: '⭐ UCL' }, { href: '/nations', label: '🌍 Nations' }, { href: '/leaderboard', label: '🏆 Leaderboard' }].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontSize: 12, color: '#8895A3' }}>{label}</a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
