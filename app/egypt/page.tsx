'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const MOROCCAN_PLAYERS_IN_EPL = [
  'Achraf Hakimi', 'Hakim Ziyech', 'Sofyan Amrabat', 'Yahia Attiat-Allah',
  'Brahim Diaz', 'Amine Harit', 'Azzedine Ounahi', 'Nayef Aguerd',
  'Jawad El Yamiq', 'Ilias Chair',
];

export default function MoroccoClient() {
  const [mounted, setMounted] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [nationRank, setNationRank] = useState<number | null>(null);
  const [nationPts, setNationPts] = useState(0);

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
        // Morocco nation rank
        const { data: allProfiles } = await supabase.from('profiles').select('country, total_points');
        if (allProfiles) {
          const nationMap: { [key: string]: number } = {};
          allProfiles.forEach((p: any) => {
            if (!p.country) return;
            nationMap[p.country] = (nationMap[p.country] || 0) + (p.total_points || 0);
          });
          const sorted = Object.entries(nationMap).sort((a, b) => b[1] - a[1]);
          const maRank = sorted.findIndex(([code]) => code === 'MA') + 1;
          if (maRank > 0) setNationRank(maRank);
          setNationPts(nationMap['MA'] || 0);
        }
      } catch (e) {}
    };
    init();
  }, []);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#0A1A0A 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(196,30,58,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(196,30,58,0.1)', border: '1px solid rgba(196,30,58,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#C41E3A', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 12, color: '#C41E3A', fontWeight: 700, letterSpacing: '2px' }}>MOROCCO · NATION BATTLE</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🇲🇦</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,60px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Morocco.<br /><span style={{ color: '#C41E3A' }}>Represent your nation.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 24px' }}>
          {userRank && username
            ? `You are ranked #${userRank} globally. Every EPL and UCL prediction builds your permanent Football Reputation and earns points for Morocco.`
            : 'Hakimi. Ziyech. Amrabat. Morocco produces world-class talent. Now prove your football intelligence matches theirs.'}
        </p>
        {nationRank && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, backgroundColor: '#0D2B14', border: '1px solid #C41E3A', borderRadius: 12, padding: '12px 24px', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>Morocco Nation Battle rank</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#C41E3A', fontFamily: 'Georgia, serif' }}>#{nationRank}</span>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{nationPts} pts</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#C41E3A', color: 'white', border: 'none', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(196,30,58,0.35)' }}>
            🇲🇦 Predict for Morocco →
          </a>
          <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🌍 Nation Battle →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Free forever · No betting · No card required</p>
      </section>

      {/* MOROCCAN PLAYERS IN EUROPE */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#C41E3A', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>MOROCCAN PLAYERS IN EUROPEAN FOOTBALL</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
            {MOROCCAN_PLAYERS_IN_EPL.map(player => (
              <div key={player} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                {player}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', marginTop: 16 }}>Predict their matches. Every correct call earns points for Morocco.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#C41E3A', fontWeight: 700, letterSpacing: '3px', marginBottom: 20 }}>HOW NATION BATTLE WORKS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { step: '1', title: 'Predict matches', desc: 'EPL, UCL and more — predict before kickoff. Locked forever.' },
              { step: '2', title: 'Earn points', desc: 'Correct calls earn points for you personally.' },
              { step: '3', title: 'Represent Morocco', desc: 'Your points add to Morocco in the global Nation Battle.' },
              { step: '4', title: 'Climb the rankings', desc: 'Morocco competes against every nation on Flipseer.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 12, padding: '20px' }}>
                <div style={{ width: 28, height: 28, backgroundColor: '#C41E3A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, margin: '0 auto 12px', color: 'white' }}>{step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇲🇦</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Morocco belongs at the top.<br /><span style={{ color: '#C41E3A' }}>Help put it there.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            EPL + UCL — predict every match. Permanent record. Represent Morocco in the global Nation Battle. Free forever.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#C41E3A', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(196,30,58,0.3)', marginBottom: 16 }}>
            🇲🇦 Start Predicting — Represent Morocco →
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
