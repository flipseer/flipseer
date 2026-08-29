'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const LEAGUES = [
  { href: '/epl',       label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL 2026/27',        badge: 'LIVE',  badgeColor: '#8B5CF6' },
  { href: '/ucl',       label: '⭐ UCL 2026/27',           badge: 'SEP 17', badgeColor: '#A78BFA' },
  { href: '/ghana',     label: '🇬🇭 Ghana PL 2026/27',      badge: 'LIVE',  badgeColor: '#F59E0B' },
  { href: '/indonesia', label: '🇮🇩 Liga 1 2026/27',        badge: 'LIVE',  badgeColor: '#CE1126' },
  { href: '/india',     label: '🇮🇳 ISL 2026/27',           badge: 'OCT',   badgeColor: '#FF6B35' },
  { href: '/nigeria',   label: '🇳🇬 NPFL 2026/27',          badge: 'JAN',   badgeColor: '#008751' },
  { href: '/world-cup-2026', label: '🏆 World Cup 2026',   badge: 'DONE',  badgeColor: '#6B7280' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaguesOpen, setLeaguesOpen] = useState(false);
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

  useEffect(() => { setMenuOpen(false); setLeaguesOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href;
  const isLeaguePage = LEAGUES.some(l => pathname === l.href);

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
        .leagues-dropdown { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #0A1A0C; border: 1px solid #1A7A4A; border-radius: 12px; padding: 8px; min-width: 240px; z-index: 200; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .league-item:hover { background-color: rgba(139,92,246,0.1) !important; }
      `}</style>

      <nav style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A7A4A', backgroundColor: '#0A1A0C', position: 'sticky', top: 0, zIndex: 100, fontFamily: 'Arial, sans-serif' }}>

        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <Image src="/icons/flipseer-navbar-logo.png" alt="Flipseer" width={1272} height={200} priority style={{ height: '32px', width: 'auto' }} />
        </Link>

        {/* DESKTOP NAV */}
        <div className="nav-links" style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'nowrap' }}>

          <Link href="/" className="nav-link" style={{ color: isActive('/') ? '#2E9E5E' : '#9CA3AF', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive('/') ? '#1A7A4A' : 'transparent'), fontWeight: isActive('/') ? 'bold' : 'normal', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}>
            Home
          </Link>

          <Link href="/predict" className="predict-btn" style={{ position: 'relative', color: 'white', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #2E9E5E', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            ⚽ Predict
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#F59E0B', borderRadius: '50%', display: 'inline-block', animation: 'navDot 1.5s ease-in-out infinite' }} />
          </Link>

          <Link href="/results" className="nav-link" style={{ color: isActive('/results') ? '#2E9E5E' : '#9CA3AF', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive('/results') ? '#1A7A4A' : 'transparent'), fontWeight: isActive('/results') ? 'bold' : 'normal', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}>
            Results
          </Link>

          <Link href="/leaderboard" className="nav-link" style={{ color: isActive('/leaderboard') ? '#2E9E5E' : '#9CA3AF', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive('/leaderboard') ? '#1A7A4A' : 'transparent'), fontWeight: isActive('/leaderboard') ? 'bold' : 'normal', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}>
            Rankings
          </Link>

          <Link href="/nations" className="nav-link" style={{ color: '#F59E0B', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive('/nations') ? '#F59E0B' : '#F59E0B40'), fontWeight: isActive('/nations') ? 'bold' : 'normal', whiteSpace: 'nowrap', backgroundColor: isActive('/nations') ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
            🌍 Nations
          </Link>

          <Link href="/groups" className="nav-link" style={{ color: isActive('/groups') ? '#2E9E5E' : '#9CA3AF', textDecoration: 'none', fontSize: '12px', padding: '5px 7px', borderRadius: '6px', border: '1px solid ' + (isActive('/groups') ? '#1A7A4A' : 'transparent'), fontWeight: isActive('/groups') ? 'bold' : 'normal', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}>
            Groups
          </Link>

          {/* LEAGUES DROPDOWN */}
          <div style={{ position: 'relative' }} onMouseEnter={() => setLeaguesOpen(true)} onMouseLeave={() => setLeaguesOpen(false)}>
            <button style={{ color: isLeaguePage ? '#8B5CF6' : '#C4B5FD', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid ' + (isLeaguePage ? '#8B5CF6' : 'rgba(139,92,246,0.4)'), fontWeight: isLeaguePage ? 'bold' : 'normal', whiteSpace: 'nowrap', backgroundColor: isLeaguePage ? 'rgba(139,92,246,0.1)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🏆 Leagues <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
            </button>
            {leaguesOpen && (
              <div className="leagues-dropdown">
                {LEAGUES.map(({ href, label, badge, badgeColor }) => (
                  <Link key={href} href={href} className="league-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: isActive(href) ? '#8B5CF6' : '#9CA3AF', backgroundColor: isActive(href) ? 'rgba(139,92,246,0.1)' : 'transparent', fontSize: '13px', fontWeight: isActive(href) ? 'bold' : 'normal', transition: 'all 0.1s' }}>
                    <span>{label}</span>
                    <span style={{ fontSize: '9px', backgroundColor: badgeColor + '30', color: badgeColor, padding: '2px 6px', borderRadius: '999px', fontWeight: 'bold', marginLeft: '8px', flexShrink: 0 }}>{badge}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Profile / Sign In */}
          {user ? (
            <Link href="/profile" style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1A7A4A', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: isActive('/profile') ? 'rgba(46,158,94,0.15)' : 'transparent' }}>
              My Profile
            </Link>
          ) : (
            <Link href="/auth" style={{ color: '#2E9E5E', textDecoration: 'none', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1A7A4A', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* HAMBURGER */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ display: 'none', flexDirection: 'column', gap: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? '#2E9E5E' : '#9CA3AF', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? 'transparent' : '#9CA3AF', display: 'block', transition: 'all 0.2s' }} />
          <span style={{ width: '24px', height: '2px', backgroundColor: menuOpen ? '#2E9E5E' : '#9CA3AF', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu" style={{ backgroundColor: '#0A1A0C', borderBottom: '1px solid #1A7A4A', padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: '2px', position: 'sticky', top: '57px', zIndex: 99 }}>

          <a href="/" style={mobileLink(isActive('/'))}>Home</a>

          <a href="/predict" style={{ ...mobileLink(isActive('/predict')), backgroundColor: '#1A7A4A', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'navPulse 1.5s ease-in-out infinite' }}>
            <span>⚽ Predict Matches</span>
            <span style={{ fontSize: '10px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>LIVE</span>
          </a>

          <a href="/results" style={mobileLink(isActive('/results'))}>📊 Results</a>
          <a href="/leaderboard" style={mobileLink(isActive('/leaderboard'))}>🏅 Rankings</a>
          <a href="/nations" style={{ ...mobileLink(isActive('/nations')), color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🌍 Nation Battle</span>
            <span style={{ fontSize: '10px', backgroundColor: '#F59E0B', color: 'black', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>LIVE</span>
          </a>
          <a href="/groups" style={mobileLink(isActive('/groups'))}>👥 Groups</a>

          {/* LEAGUES SECTION */}
          <div style={{ borderTop: '1px solid #1A3A1A', marginTop: '6px', paddingTop: '8px' }}>
            <div style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px', padding: '4px 12px 8px' }}>🏆 LEAGUES</div>
            {LEAGUES.map(({ href, label, badge, badgeColor }) => (
              <a key={href} href={href} style={{ ...mobileLink(isActive(href)), display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isActive(href) ? '#8B5CF6' : '#9CA3AF' }}>
                <span>{label}</span>
                <span style={{ fontSize: '9px', backgroundColor: badgeColor + '30', color: badgeColor, padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>{badge}</span>
              </a>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1A3A1A', marginTop: '8px', paddingTop: '8px' }}>
            {user ? (
              <a href="/profile" style={{ ...mobileLink(isActive('/profile')), color: '#2E9E5E', fontWeight: 'bold' }}>👤 My Profile</a>
            ) : (
              <a href="/auth" style={{ ...mobileLink(false), color: '#2E9E5E', fontWeight: 'bold' }}>Sign In</a>
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
