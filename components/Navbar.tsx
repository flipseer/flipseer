'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

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
          &#x26BD; FLIPSEER
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="nav-links" style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={linkStyle}>&#x1F3E0; Home</a>
          <a href="/predict" style={linkStyle}>&#x26BD; Predict</a>
          <a href="/world-cup-2026" style={linkStyle}>&#x1F3C6; World Cup 2026</a>
          <a href="/leaderboard" style={linkStyle}>&#x1F30D; Leaderboard</a>
          {user ? (
            <a href="/profile" style={activeStyle}>&#x1F464; My Profile</a>
          ) : (
            <a href="/auth" style={activeStyle}>Sign In</a>
          )}
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? '#2E9E5E' : '#9CA3AF', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? 'transparent' : '#9CA3AF', display: 'block', transition: 'all 0.2s' }} />
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? '#2E9E5E' : '#9CA3AF', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          backgroundColor: '#0A1A0C',
          borderBottom: '1px solid #1A7A4A',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'sticky',
          top: '57px',
          zIndex: 99,
        }}>
          {/* NAV LINKS */}
          <a href="/" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>Home</a>
          <a href="/predict" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>Predict</a>
          <a href="/world-cup-2026" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>World Cup 2026</a>
          <a href="/leaderboard" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>Leaderboard</a>

          {/* PROFILE OR SIGN IN */}
          {user ? (
            <a href="/profile"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
              My Profile
            </a>
          ) : (
            <a href="/auth"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
              Sign In
            </a>
          )}

          {/* SIGNUP CTA BANNER IN MENU */}
          {!user && (
            <div style={{ marginTop: '12px', backgroundColor: '#1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#D1FAE5', marginBottom: '4px', fontWeight: 'bold' }}>
                &#x26BD; FIFA World Cup 2026
              </div>
              <div style={{ fontSize: '12px', color: '#6EE7B7', marginBottom: '12px' }}>
                June 11 -- Build your football reputation
              </div>
              <a href="/auth"
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', backgroundColor: 'white', color: '#1A7A4A', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                Join Free &#x2192; Claim Your Record
              </a>
              <div style={{ fontSize: '11px', color: '#6EE7B7', marginTop: '6px' }}>
                Free. No betting. Pure football.
              </div>
            </div>
          )}
        </div>
      )}
    </>
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
