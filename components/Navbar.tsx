'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @keyframes navPulse {
          0%, 100% { box-shadow: 0 0 0px rgba(46,158,94,0); background-color: #1A7A4A; }
          50% { box-shadow: 0 0 12px rgba(46,158,94,0.9); background-color: #2E9E5E; }
        }
        @keyframes navDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .predict-blink {
          animation: navPulse 1.5s ease-in-out infinite !important;
        }
      `}</style>

      <nav style={{
        padding: '12px 16px',
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
        <div className="nav-links" style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'nowrap' }}>
          <Link href="/" style={linkStyle}>Home</Link>
          <Link href="/predict" style={{ ...linkStyle, position: 'relative', backgroundColor: '#1A7A4A', color: 'white', border: '1px solid #2E9E5E', fontWeight: 'bold' }} className="predict-blink">
            &#x26BD; Predict
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#F59E0B', borderRadius: '50%', display: 'inline-block', animation: 'navDot 1.5s ease-in-out infinite' }} />
          </Link>
          <Link href="/world-cup-2026" style={linkStyle}>WC2026</Link>
          <Link href="/results" style={linkStyle}>Results</Link>
          <Link href="/epl" style={linkStyle}>EPL</Link>
          <Link href="/leaderboard" style={linkStyle}>Rankings</Link>
          <Link href="/groups" style={linkStyle}>Groups</Link>
          <Link href="/nations" style={{ ...linkStyle, color: '#F59E0B', border: '1px solid #F59E0B40' }}>&#x1F30D; Nations</Link>
          {user ? (
            <Link href="/profile" style={activeStyle}>Profile</Link>
          ) : (
            <Link href="/auth" style={activeStyle}>Sign In</Link>
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
          <a href="/predict" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A7A4A', fontWeight: 'bold', animation: 'navPulse 1.5s ease-in-out infinite' }}>
            <span>&#x26BD; Predict Matches</span>
            <span style={{ fontSize: '11px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>NEW</span>
          </a>
          <a href="/world-cup-2026" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>World Cup 2026</a>
          <a href="/results" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>&#x1F4CA; Results</a>
          <a href="/epl" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>EPL</a>
          <a href="/leaderboard" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>Rankings</a>
          <a href="/groups" onClick={() => setMenuOpen(false)} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'block' }}>Groups</a>
          <a href="/nations" onClick={() => setMenuOpen(false)} style={{ color: '#F59E0B', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', borderBottom: '1px solid #1A3A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>&#x1F30D; Nation Battle</span>
            <span style={{ fontSize: '11px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>LIVE</span>
          </a>

          {/* PROFILE OR SIGN IN */}
          {user ? (
            <a href="/profile" onClick={() => setMenuOpen(false)}
              style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', fontWeight: 'bold', display: 'block' }}>
              My Profile
            </a>
          ) : (
            <a href="/auth" onClick={() => setMenuOpen(false)}
              style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', fontWeight: 'bold', display: 'block' }}>
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
  fontSize: '12px',
  padding: '5px 7px',
  borderRadius: '6px',
  border: '1px solid transparent',
  whiteSpace: 'nowrap',
};

const activeStyle: React.CSSProperties = {
  color: '#2E9E5E',
  textDecoration: 'none',
  fontSize: '12px',
  padding: '5px 8px',
  borderRadius: '6px',
  border: '1px solid #1A7A4A',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};
