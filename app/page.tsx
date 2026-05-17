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
  'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Colombia': '🇨🇴',
  'Ecuador': '🇪🇨', 'Uruguay': '🇺🇾', 'Croatia': '🇭🇷', 'Serbia': '🇷🇸',
  'Poland': '🇵🇱', 'Switzerland': '🇨🇭', 'Belgium': '🇧🇪', 'Denmark': '🇩🇰',
  'Ghana': '🇬🇭', 'Cameroon': '🇨🇲', 'Tunisia': '🇹🇳', 'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦', 'Iran': '🇮🇷', 'South Africa': '🇿🇦', 'Other': '🌍',
};

const FALLBACK_TICKER = [
  { country: 'India', username: 'Praveen', match: 'Mexico vs South Africa', pick: 'Mexico Win', confidence: 80 },
  { country: 'Brazil', username: 'Rafael', match: 'Brazil vs Croatia', pick: 'Brazil Win', confidence: 90 },
  { country: 'Nigeria', username: 'Emeka', match: 'France vs Senegal', pick: 'Senegal Win', confidence: 65, upset: true },
  { country: 'Germany', username: 'Klaus', match: 'Germany vs Japan', pick: 'Draw', confidence: 55 },
  { country: 'England', username: 'James', match: 'England vs Croatia', pick: 'England Win', confidence: 75 },
  { country: 'Spain', username: 'Carlos', match: 'Spain vs Morocco', pick: 'Spain Win', confidence: 85 },
  { country: 'USA', username: 'Tyler', match: 'USA vs Canada', pick: 'USA Win', confidence: 70 },
  { country: 'Japan', username: 'Kenji', match: 'Germany vs Japan', pick: 'Japan Win', confidence: 60, upset: true },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [tickerItems, setTickerItems] = useState(FALLBACK_TICKER);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Countdown timer
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

  // Fetch real ticker data from Supabase
  useEffect(() => {
    const fetchTicker = async () => {
      const { data } = await supabase
        .from('predictions')
        .select(`
          predicted_outcome,
          confidence_pct,
          match_id,
          profiles(username, country)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && data.length > 5) {
        const items = data
          .filter((p: any) => p.profiles?.username)
          .map((p: any) => ({
            country: p.profiles?.country || 'Other',
            username: p.profiles?.username || 'Forecaster',
            match: `Match ${p.match_id}`,
            pick: p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw',
            confidence: p.confidence_pct || 50,
            upset: false,
          }));
        if (items.length > 0) setTickerItems(items);
      }
    };
    fetchTicker();
  }, []);

  const handleSubmit = async () => {
    if (!email) return;
    await supabase.from('waitlist').insert([{ email }]);
    setSubmitted(true);
  };

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', margin: 0 }}>

      {/* LIVE TICKER */}
      <div style={{
        backgroundColor: '#0A1A0A',
        borderBottom: '1px solid #1A7A4A',
        overflow: 'hidden',
        padding: '10px 0',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          gap: '48px',
          animation: 'ticker 40s linear infinite',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ fontSize: '13px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>{COUNTRY_FLAGS[item.country] || '🌍'}</span>
              <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{item.username}</span>
              <span>predicted</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{item.pick}</span>
              <span>·</span>
              <span style={{ color: '#2E9E5E' }}>{item.confidence}% confidence</span>
              {item.upset && <span style={{ color: '#F59E0B' }}>🔥 Upset call!</span>}
              <span style={{ color: '#374151', marginLeft: '16px' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 40px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Badge */}
        <div style={{ display: 'inline-block', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '20px', padding: '6px 16px', marginBottom: '32px' }}>
          <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold' }}>⚽ WORLD CUP 2026 · {days}d {hours}h {minutes}m {seconds}s</span>
        </div>

        {/* Vision Statement */}
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', lineHeight: '1.2', marginBottom: '24px', fontWeight: 'bold' }}>
          The permanent public record of your<br />
          <span style={{ color: '#2E9E5E' }}>football intelligence.</span>
        </h1>

        <p style={{ fontSize: '20px', color: '#9CA3AF', marginBottom: '16px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 16px' }}>
          Built over years, tournaments, and decades.
        </p>

        <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '48px', fontStyle: 'italic' }}>
          Your reputation. Your legacy. On record forever.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <a href="/predict" style={{
            backgroundColor: '#1A7A4A', color: 'white', padding: '16px 40px',
            borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(46,158,94,0.3)',
          }}>
            Start Predicting Now →
          </a>
          <a href="/how-to-play" style={{
            backgroundColor: 'transparent', color: '#2E9E5E', padding: '16px 40px',
            borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold',
            border: '1px solid #2E9E5E',
          }}>
            How to Play
          </a>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', marginBottom: '80px' }}>
          {[
            { value: '64', label: 'WC Matches' },
            { value: '∞', label: 'Reputation Points' },
            { value: '0', label: 'Betting. Ever.' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VISION SECTION */}
      <section style={{ backgroundColor: '#0D2B14', borderTop: '1px solid #1A7A4A', borderBottom: '1px solid #1A7A4A', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '24px' }}>OUR VISION</p>
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: '28px', lineHeight: '1.5', color: 'white', margin: 0, fontStyle: 'italic' }}>
            "Flipseer is the permanent public record of your football intelligence — built over years, tournaments, and decades. Your reputation. Your legacy. On record forever."
          </blockquote>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', textAlign: 'center', marginBottom: '48px' }}>How Flipseer Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🎯', title: 'Predict', desc: 'Pick match outcomes + exact scores before kick-off. Set your confidence level.' },
            { icon: '⚡', title: 'Earn Points', desc: 'Correct calls earn reputation points. Upsets, exact scores, and streaks earn bonuses.' },
            { icon: '🏆', title: 'Build Legacy', desc: 'Climb global and national leaderboards. Your record is permanent — forever.' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '22px', color: '#2E9E5E', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6', fontSize: '15px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NO BETTING BANNER */}
      <section style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A7A4A', margin: '0 20px 80px', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: '🚫', text: 'No Betting. Ever.' },
            { icon: '🤖', text: 'No AI Tips.' },
            { icon: '📖', text: 'Permanent Record.' },
            { icon: '🌍', text: 'Global & National Ranks.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 'bold' }}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* READY CTA */}
      <section style={{ textAlign: 'center', padding: '40px 20px 80px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', marginBottom: '16px' }}>Ready to build your legacy?</h2>
        <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '16px' }}>Join forecasters building their reputation before the World Cup.</p>
        <a href="/predict" style={{
          backgroundColor: '#1A7A4A', color: 'white', padding: '18px 48px',
          borderRadius: '10px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold',
          boxShadow: '0 0 40px rgba(46,158,94,0.4)',
        }}>
          Start Predicting Now →
        </a>
      </section>

    </main>
  );
}
