'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COUNTRY_FLAGS: { [key: string]: string } = {
  'India': '🇮🇳', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷',
  'Germany': '🇩🇪', 'England': '🇬🇧', 'Spain': '🇪🇸', 'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱', 'Italy': '🇮🇹', 'Mexico': '🇲🇽', 'USA': '🇺🇸',
  'Nigeria': '🇳🇬', 'Senegal': '🇸🇳', 'Morocco': '🇲🇦', 'Japan': '🇯🇵',
  'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Other': '🌍',
};

const FALLBACK_TICKER = [
  { country: 'India', username: 'Praveen', pick: 'Mexico Win', confidence: 80 },
  { country: 'Brazil', username: 'Rafael', pick: 'Brazil Win', confidence: 90 },
  { country: 'Nigeria', username: 'Emeka', pick: 'Senegal Win', confidence: 65, upset: true },
  { country: 'Germany', username: 'Klaus', pick: 'Draw', confidence: 55 },
  { country: 'England', username: 'James', pick: 'England Win', confidence: 75 },
  { country: 'Argentina', username: 'Diego', pick: 'Argentina Win', confidence: 88 },
  { country: 'Spain', username: 'Carlos', pick: 'Spain Win', confidence: 85 },
  { country: 'Japan', username: 'Kenji', pick: 'Japan Win', confidence: 60, upset: true },
];

const COMING_SOON = [
  { icon: '🏆', title: 'EPL & Champions League', desc: "Europe's biggest stages. Your biggest calls.", date: 'Aug 2026' },
  { icon: '🇪🇸', title: 'La Liga & Serie A', desc: 'El Clásico. Derby della Madonnina. Predict them all.', date: 'Sep 2026' },
  { icon: '🇩🇪', title: 'Bundesliga & Ligue 1', desc: 'Der Klassiker. PSG. The rivalries never end.', date: 'Oct 2026' },
  { icon: '⭐', title: 'Flipseer Pro', desc: 'Advanced analytics, deeper insights, elite badges.', date: 'Jul 2026' },
  { icon: '🤝', title: 'Brand Partnerships', desc: 'Exclusive rewards from the world\'s top football brands.', date: 'Late 2026' },
];

export default function Home() {
  const [tickerItems, setTickerItems] = useState(FALLBACK_TICKER);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date('2026-06-11T00:00:00Z');
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
        .select('predicted_outcome, confidence_pct, match_id, profiles(username, country)')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data && data.length > 5) {
        const items = data
          .filter((p: any) => p.profiles?.username)
          .map((p: any) => ({
            country: p.profiles?.country || 'Other',
            username: p.profiles?.username || 'Forecaster',
            pick: p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw',
            confidence: p.confidence_pct || 50,
            upset: false,
          }));
        if (items.length > 0) setTickerItems(items);
      }
    };
    fetchTicker();
  }, []);

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0, overflowX: 'hidden' }}>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes countup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* LIVE TICKER */}
      <div style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A7A4A', overflow: 'hidden', padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'ticker 40s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ fontSize: '13px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>{COUNTRY_FLAGS[item.country] || '🌍'}</span>
              <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{item.username}</span>
              <span>called</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{item.pick}</span>
              <span style={{ color: '#2E9E5E' }}>· {item.confidence}% sure</span>
              {item.upset && <span style={{ color: '#F59E0B' }}>🔥 Bold call!</span>}
              <span style={{ color: '#1A3A20', marginLeft: '16px' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO — EMOTIONAL */}
      <section style={{
        textAlign: 'center',
        padding: '90px 20px 60px',
        maxWidth: '960px',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Countdown — tension builder */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '8px 20px', marginBottom: '40px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '1px' }}>
            WORLD CUP 2026 · {days}d {hours}h {minutes}m {seconds}s
          </span>
        </div>

        {/* THE HEADLINE — raw emotion */}
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '56px', lineHeight: '1.15', marginBottom: '28px', fontWeight: 'bold', animation: 'flicker 8s infinite' }}>
          History is about<br />to be made.<br />
          <span style={{ color: '#2E9E5E' }}>Will you be on record?</span>
        </h1>

        <p style={{ fontSize: '20px', color: '#9CA3AF', marginBottom: '12px', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto 12px' }}>
          64 matches. 32 nations. One World Cup.<br />
          <strong style={{ color: '#D1FAE5' }}>Your predictions. Permanent. Public. Forever.</strong>
        </p>

        <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '48px', fontStyle: 'italic' }}>
          Not a bet. Not a tip. A record of who you are as a football mind.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '18px 44px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 0 40px rgba(46,158,94,0.35)', letterSpacing: '0.5px' }}>
            Claim Your Record Now →
          </a>
          <a href="/how-to-play" style={{ backgroundColor: 'transparent', color: '#2E9E5E', padding: '18px 44px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', border: '1px solid #2E9E5E' }}>
            How It Works
          </a>
        </div>

        {/* Emotional stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap' }}>
          {[
            { value: '64', label: 'Matches to Predict' },
            { value: '32', label: 'Nations at War' },
            { value: '0', label: 'Bets. Ever.' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `countup 0.6s ease ${i * 0.2}s both` }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TENSION SECTION — THE FEELING */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '28px' }}>YOU KNOW THIS FEELING</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { moment: '"I said Brazil wins this. Nobody believed me."', emotion: 'Vindication' },
              { moment: '"I called the exact score. 2–1. Before anyone."', emotion: 'Glory' },
              { moment: '"My country vs yours. I\'ll put my reputation on it."', emotion: 'National Pride' },
              { moment: '"This upset is coming. I feel it in my bones."', emotion: 'Instinct' },
            ].map(({ moment, emotion }) => (
              <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px 24px', textAlign: 'left' }}>
                <div style={{ fontSize: '32px', minWidth: '44px', textAlign: 'center' }}>⚡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', color: 'white', fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{moment}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '2px', fontWeight: 'bold' }}>{emotion.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', backgroundColor: '#0D1F0F', padding: '6px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  Prove it →
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '28px', fontStyle: 'italic' }}>
            Flipseer turns that feeling into permanent proof.
          </p>
        </div>
      </section>

      {/* RIVALRY SECTION */}
      <section style={{ padding: '72px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>NATIONAL PRIDE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', marginBottom: '12px' }}>
          Represent your nation.<br />
          <span style={{ color: '#2E9E5E' }}>Outforecast the world.</span>
        </h2>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '40px' }}>
          Every prediction you make counts toward your country's leaderboard score.<br />
          India vs Brazil. England vs Argentina. The rivalry is real.
        </p>

        {/* Mock leaderboard */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden', maxWidth: '560px', margin: '0 auto 16px' }}>
          <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
            <span>RANK · NATION</span>
            <span>FORECASTERS · POINTS</span>
          </div>
          {[
            { rank: 1, flag: '🇧🇷', country: 'Brazil', forecasters: '12,584', points: '2,458,930', you: false },
            { rank: 2, flag: '🇬🇧', country: 'England', forecasters: '9,876', points: '2,125,440', you: false },
            { rank: 3, flag: '🇦🇷', country: 'Argentina', forecasters: '8,765', points: '1,998,320', you: false },
            { rank: 4, flag: '🇫🇷', country: 'France', forecasters: '7,654', points: '1,765,210', you: false },
            { rank: 5, flag: '🇩🇪', country: 'Germany', forecasters: '6,789', points: '1,543,890', you: false },
            { rank: 6, flag: '🇮🇳', country: 'India', forecasters: '5,432', points: '1,245,670', you: true },
          ].map(({ rank, flag, country, forecasters, points, you }) => (
            <div key={rank} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #1A3A1A', backgroundColor: you ? 'rgba(46,158,94,0.08)' : 'transparent' }}>
              <span style={{ fontSize: '14px', color: you ? '#2E9E5E' : '#6B7280', fontWeight: 'bold', minWidth: '28px' }}>#{rank}</span>
              <span style={{ fontSize: '20px', marginRight: '10px' }}>{flag}</span>
              <span style={{ flex: 1, fontSize: '15px', color: you ? '#2E9E5E' : 'white', fontWeight: you ? 'bold' : 'normal' }}>{country} {you && '← YOU'}</span>
              <span style={{ fontSize: '12px', color: '#6B7280', marginRight: '16px' }}>{forecasters}</span>
              <span style={{ fontSize: '13px', color: you ? '#2E9E5E' : '#9CA3AF', fontWeight: 'bold' }}>{points} pts</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>Every prediction you make moves India up the table.</p>
      </section>

      {/* GLORY MOMENTS */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>From prediction to legend.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', icon: '🎯', title: 'Call the match', desc: 'Pick the winner. Predict the exact score. Set your confidence before kick-off.' },
              { step: '02', icon: '🔒', title: 'It locks in forever', desc: 'Once the whistle blows, your call is sealed. No edits. No excuses. Just your word.' },
              { step: '03', icon: '⚡', title: 'Earn your reputation', desc: 'Correct calls earn points. Upsets earn glory. Exact scores earn legend status.' },
              { step: '04', icon: '👑', title: 'Build your legacy', desc: 'Tournament after tournament. Your profile grows. Your reputation is permanent.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '28px 24px' }}>
                <div style={{ fontSize: '11px', color: '#1A7A4A', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>STEP {step}</div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ fontSize: '17px', color: '#2E9E5E', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NO BETTING — TRUST BUILDER */}
      <section style={{ padding: '72px 20px', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>THE PROMISE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '16px' }}>
          Pure football.<br />
          <span style={{ color: '#2E9E5E' }}>Nothing else.</span>
        </h2>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '40px', lineHeight: '1.7' }}>
          No money. No odds. No gambling. Just football intelligence.<br />
          The beautiful game. The right way.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { icon: '🚫', text: 'No Betting. Ever.' },
            { icon: '🤖', text: 'No AI Tips.' },
            { icon: '📖', text: 'Permanent Record.' },
            { icon: '🌍', text: 'Global Rankings.' },
            { icon: '🆓', text: 'Always Free.' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{icon}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 'bold' }}>{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S COMING */}
      <section style={{ backgroundColor: '#050E05', borderTop: '1px solid #1A3A1A', borderBottom: '1px solid #1A3A1A', padding: '72px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>ROADMAP</p>
          <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '34px', marginBottom: '8px' }}>🚀 The World Cup is just the start.</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>
            EPL. Champions League. El Clásico. Der Klassiker.<br />Your reputation builds forever.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {COMING_SOON.map(({ icon, title, desc, date }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '26px', minWidth: '40px', textAlign: 'center' }}>{icon}</div>
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

      {/* FINAL CTA — EMOTIONAL */}
      <section style={{ textAlign: 'center', padding: '80px 20px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(46,158,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🏆</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', marginBottom: '16px', lineHeight: '1.2' }}>
          June 11. The whistle blows.<br />
          <span style={{ color: '#2E9E5E' }}>Will your record be ready?</span>
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '36px', fontSize: '17px', lineHeight: '1.7' }}>
          The forecasters who start now will have a 24-match head start.<br />
          Your legacy clock is ticking.
        </p>
        <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '20px 56px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 0 50px rgba(46,158,94,0.4)', letterSpacing: '0.5px' }}>
          Start Your Legacy Now →
        </a>
        <p style={{ color: '#4B5563', fontSize: '13px', marginTop: '16px' }}>Free. No betting. No risk. Just football.</p>
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A3A1A' }}>
        <p style={{ color: '#4B5563', fontSize: '12px' }}>© 2026 Flipseer · Pure football reputation. No betting. Ever.</p>
      </footer>

    </main>
  );
}
