'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/predict', label: '⚽ Predict', highlight: true },
    { href: '/world-cup-2026', label: 'WC2026' },
    { href: '/results', label: 'Results' },
    { href: '/leaderboard', label: 'Rankings' },
    { href: '/nations', label: '🌍 Nations', accent: true },
    { href: '/groups', label: 'Groups' },
  ];

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
        .predict-btn { animation: navPulse 1.5s ease-in-out infinite; }
        .nav-link:hover { color: #ffffff !important; background-color: rgba(46,158,94,0.1) !important; }
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
        <Link href="/" style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', textDecoration: 'none', letterSpacing: '1px', flexShrink: 0 }}>
          &#x26BD; FLIPSEER
        </Link>

        {/* DESKTOP NAV */}
        <div className="nav-links" style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'nowrap' }}>
          {navLinks.map(({ href, label, highlight, accent }) => {
            if (highlight) {
              return (
                <Link key={href} href={href}
                  className="predict-btn"
                  style={{ position: 'relative', color: 'white', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #2E9E5E', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {label}
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#F59E0B', borderRadius: '50%', display: 'inline-block', animation: 'navDot 1.5s ease-in-out infinite' }} />
                </Link>
              );
            }
            if (accent) {
              return (
                <Link key={href} href={href}
                  className="nav-link"
                  style={{ color: isActive(href) ? '#F59E0B' : '#F59E0B', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive(href) ? '#F59E0B' : '#F59E0B40'), fontWeight: isActive(href) ? 'bold' : 'normal', whiteSpace: 'nowrap', backgroundColor: isActive(href) ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
                  {label}
                </Link>
              );
            }
            return (
              <Link key={href} href={href}
                className="nav-link"
                style={{ color: isActive(href) ? '#2E9E5E' : '#9CA3AF', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive(href) ? '#1A7A4A' : 'transparent'), fontWeight: isActive(href) ? 'bold' : 'normal', whiteSpace: 'nowrap', backgroundColor: isActive(href) ? 'rgba(46,158,94,0.08)' : 'transparent', transition: 'all 0.15s ease' }}>
                {label}
              </Link>
            );
          })}

          {/* Profile / Sign In */}
          {user ? (
            <Link href="/profile"
              style={{ color: isActive('/profile') ? '#2E9E5E' : '#2E9E5E', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1A7A4A', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: isActive('/profile') ? 'rgba(46,158,94,0.15)' : 'transparent' }}>
              My Profile
            </Link>
          ) : (
            <Link href="/auth"
              style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1A7A4A', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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
          padding: '12px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          position: 'sticky',
          top: '57px',
          zIndex: 99,
        }}>
          <a href="/" style={mobileLink(isActive('/'))}>Home</a>

          <a href="/predict" style={{ ...mobileLink(isActive('/predict')), backgroundColor: '#1A7A4A', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'navPulse 1.5s ease-in-out infinite' }}>
            <span>&#x26BD; Predict Matches</span>
            <span style={{ fontSize: '10px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>LIVE</span>
          </a>

          <a href="/world-cup-2026" style={mobileLink(isActive('/world-cup-2026'))}>&#x1F3C6; World Cup 2026</a>
          <a href="/results" style={mobileLink(isActive('/results'))}>&#x1F4CA; Results</a>
          <a href="/leaderboard" style={mobileLink(isActive('/leaderboard'))}>&#x1F3C5; Rankings</a>

          <a href="/nations" style={{ ...mobileLink(isActive('/nations')), color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>&#x1F30D; Nation Battle</span>
            <span style={{ fontSize: '10px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>LIVE</span>
          </a>

          <a href="/groups" style={mobileLink(isActive('/groups'))}>&#x1F465; Groups</a>

          <div style={{ borderTop: '1px solid #1A3A1A', marginTop: '8px', paddingTop: '8px' }}>
            {user ? (
              <a href="/profile" style={{ ...mobileLink(isActive('/profile')), color: '#2E9E5E', fontWeight: 'bold' }}>
                &#x1F464; My Profile
              </a>
            ) : (
              <>
                <a href="/auth" style={{ ...mobileLink(false), color: '#2E9E5E', fontWeight: 'bold' }}>
                  Sign In
                </a>
                <div style={{ marginTop: '10px', backgroundColor: '#1A7A4A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#D1FAE5', marginBottom: '4px', fontWeight: 'bold' }}>&#x26BD; FIFA World Cup 2026 · LIVE</div>
                  <div style={{ fontSize: '12px', color: '#6EE7B7', marginBottom: '12px' }}>Build your permanent football reputation</div>
                  <a href="/auth" style={{ display: 'block', backgroundColor: 'white', color: '#1A7A4A', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                    Join Free &#x2192; Claim Your Record
                  </a>
                  <div style={{ fontSize: '11px', color: '#6EE7B7', marginTop: '6px' }}>Free. No betting. Pure football.</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function mobileLink(active: boolean): React.CSSProperties {
  return {
    color: active ? '#2E9E5E' : '#9CA3AF',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '10px 12px',
    borderRadius: '8px',
    display: 'block',
    backgroundColor: active ? 'rgba(46,158,94,0.08)' : 'transparent',
    fontWeight: active ? 'bold' : 'normal',
    borderBottom: '1px solid #1A3A1A',
  };
}
