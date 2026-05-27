'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav style={{
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #1A7A4A',
      backgroundColor: '#0A1A0C',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: 'Arial, sans-serif',
    }}>

      {/* LOGO */}
      <a href="/" style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', textDecoration: 'none', letterSpacing: '1px', flexShrink: 0 }}>
        ⚽ FLIPSEER
      </a>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/predict" style={linkStyle}>Predict</a>
        <a href="/world-cup-2026" style={linkStyle}>World Cup 2026</a>
        <a href="/leaderboard" style={linkStyle}>🥇 Leaderboard</a>
        <a href="/groups" style={linkStyle}>👥 Groups</a>
        {user ? (
          <a href="/profile" style={activeStyle}>My Profile</a>
        ) : (
          <a href="/auth" style={activeStyle}>Sign In</a>
        )}
      </div>

    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  color: '#9CA3AF',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '7px 12px',
  borderRadius: '8px',
  border: '1px solid transparent',
  whiteSpace: 'nowrap',
};

const activeStyle: React.CSSProperties = {
  color: '#2E9E5E',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '7px 12px',
  borderRadius: '8px',
  border: '1px solid #1A7A4A',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};
