'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const NPFL_CLUBS = [
  'Remo Stars', 'Rivers United', 'Enyimba', 'Kano Pillars',
  'Enugu Rangers', 'Akwa United', 'Bendel Insurance', 'Kwara United',
  'Abia Warriors', 'El Kanemi Warriors', 'Katsina United', 'Warri Wolves',
  'Heartland', 'Wikki Tourists', 'Lobi Stars', 'Plateau United',
  'Nasarawa United', 'Gombe United', 'Insurance FC', 'Sunshine Stars',
];

export default function NigeriaClient() {
  const [mounted, setMounted] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [username, setUsername] = useState('');

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
      } catch (e) {}
    };
    init();
  }, []);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .match-row:hover{background:rgba(0,135,81,0.08)!important} .match-row{transition:background 0.1s}`}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#001A0A 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(0,135,81,0.07) 0%,transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,135,81,0.1)', border: '1px solid rgba(0,135,81,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#008751', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
          <span style={{ fontSize: 12, color: '#008751', fontWeight: 700, letterSpacing: '2px' }}>NIGERIA PREMIER FOOTBALL LEAGUE 2026/27</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🇳🇬</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Nigeria Premier League<br/><span style={{ color: '#008751' }}>2026/27</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 32px' }}>
          {userRank && username
            ? <>You're ranked <strong style={{ color: '#008751' }}>#{userRank} globally</strong>. Your EPL and Ghana PL record carries into NPFL — one permanent reputation.</>
            : <>Remo Stars. Rivers United. Enyimba. Kano Pillars. Nigeria's finest clubs. Predict every match. Build your permanent Football Reputation.</>}
        </p>

        {/* Coming Soon banner */}
        <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, backgroundColor: '#0D2B14', border: '1px solid #008751', borderRadius: 12, padding: '14px 28px' }}>
            <span style={{ fontSize: 24 }}>⏳</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 2 }}>NPFL 2026/27 season</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#008751', fontFamily: 'Georgia, serif' }}>Starting January 2027</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[{ label: '20+', sub: 'Clubs' }, { label: '380+', sub: 'Fixtures' }, { label: 'Jan 2027', sub: 'Starts' }].map(({ label, sub }) => (
            <div key={sub} style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#008751', fontFamily: 'Georgia, serif' }}>{label}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#008751', color: 'white', border: 'none', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(0,135,81,0.35)' }}>
            🇳🇬 Predict EPL for Nigeria →
          </a>
          <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🌍 Nation Battle →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Free forever · No betting · No card required</p>
      </section>

      {/* PREDICT EPL NOW */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#008751', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>WHILE YOU WAIT — PREDICT EPL NOW</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: 12 }}>
            Your EPL record counts for Nigeria 🇳🇬
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            Every correct EPL prediction earns points for Nigeria in the Nation Battle. Nigeria is competing right now — help your nation climb the global rankings.
          </p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #008751', borderRadius: 14, padding: '20px 24px', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            <p style={{ fontSize: 11, color: '#008751', fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>HOW IT WORKS</p>
            {[
              { step: '1', text: 'Predict EPL matches before kickoff' },
              { step: '2', text: 'Correct calls earn points for you AND Nigeria' },
              { step: '3', text: 'Nigeria climbs the Nation Battle rankings' },
              { step: '4', text: 'When NPFL starts Jan 2027 — your record continues' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: step !== '4' ? '1px solid #1A3A1A' : 'none' }}>
                <div style={{ width: 24, height: 24, backgroundColor: '#008751', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{step}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>{text}</div>
              </div>
            ))}
          </div>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#008751', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(0,135,81,0.3)' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict EPL — Represent Nigeria →
          </a>
        </div>
      </section>

      {/* CLUBS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#008751', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>NPFL CLUBS · 2026/27 SEASON</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 }}>
            {NPFL_CLUBS.map(club => (
              <div key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                {club}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#4B5563', textAlign: 'center', marginTop: 16 }}>Full fixture list will be available when the season launches in January 2027.</p>
        </div>
      </section>

      {/* REPUTATION CTA */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇳🇬</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Represent Nigeria.<br/><span style={{ color: '#008751' }}>Build your Football Reputation.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            EPL + NPFL + UCL — one permanent record. Every correct prediction earns points for Nigeria. Start building your reputation now.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#008751', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(0,135,81,0.3)', marginBottom: 16 }}>
            🇳🇬 Start Predicting — Represent Nigeria →
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
