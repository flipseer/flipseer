'use client';
import { useState, useEffect } from 'react';

type NationData = {
  code: string;
  name: string;
  flag: string;
  rank: number;
  points: number;
  forecasters: number;
  rival: {
    code: string;
    name: string;
    flag: string;
    points: number;
    pointsNeeded: number;
  } | null;
};

type Props = {
  country: string;
  pointsJustEarned: number;
  matchName: string;
  onClose: () => void;
};

export default function NationShareCard({ country, pointsJustEarned, matchName, onClose }: Props) {
  const [nation, setNation] = useState<NationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!country) { setLoading(false); return; }
    fetch(`/api/nation-share?code=${country}`)
      .then(r => r.json())
      .then(d => { setNation(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [country]);

  const shareText = nation
    ? `${nation.flag} ${nation.name} earned +${pointsJustEarned} points in the World Cup 2026 Nation Battle!\n\n` +
      `${nation.name} is ranked #${nation.rank} globally with ${nation.points} points.\n` +
      (nation.rival && nation.rival.pointsNeeded > 0
        ? `Only ${nation.rival.pointsNeeded} points behind ${nation.rival.flag} ${nation.rival.name}.\n\n`
        : `${nation.name} leads the global Nation Battle!\n\n`) +
      `Represent your nation → flipseer.com/${nation.name.toLowerCase().replace(/\s+/g, '-')}\n#WorldCup2026 #${nation.name.replace(/\s+/g, '')} #Flipseer`
    : '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${nation?.name} Nation Battle`, text: shareText, url: `https://flipseer.com/${nation?.name.toLowerCase().replace(/\s+/g, '-')}` });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank');
    }
    setShared(true);
  };

  if (!country || (!loading && !nation)) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .nation-share-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:flex-end;justify-content:center;padding:0}
        @media(min-width:640px){.nation-share-backdrop{align-items:center;padding:20px}}
      `}</style>
      <div className="nation-share-backdrop" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{
          backgroundColor: '#0D2B14',
          border: '1px solid #2E9E5E',
          borderRadius: '20px 20px 0 0',
          padding: '28px 24px 40px',
          width: '100%',
          maxWidth: 480,
          animation: 'slideUp 0.35s ease',
          position: 'relative',
        }}>
          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: 'none',
            color: '#6B7280', fontSize: 22, cursor: 'pointer', lineHeight: 1,
          }}>×</button>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#2E9E5E', fontSize: 14 }}>
              Loading nation data...
            </div>
          ) : nation ? (
            <>
              {/* Points earned pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                backgroundColor: 'rgba(46,158,94,0.15)', border: '1px solid #2E9E5E',
                borderRadius: 999, padding: '5px 16px', marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
                <span style={{ fontSize: 12, color: '#2E9E5E', fontWeight: 700, letterSpacing: '1px' }}>
                  PREDICTION LOCKED · WORLD CUP 2026
                </span>
              </div>

              {/* Flag + nation name */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 'clamp(48px,12vw,72px)', lineHeight: 1, marginBottom: 8 }}>
                  {nation.flag}
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px,5vw,32px)', fontWeight: 900,
                  letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 6,
                }}>
                  {nation.name} earned{' '}
                  <span style={{ color: '#2E9E5E' }}>+{pointsJustEarned} points</span>
                </h2>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5 }}>
                  Your prediction on {matchName} just added to {nation.name}'s permanent football record.
                </p>
              </div>

              {/* Nation stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                gap: 8, marginBottom: 20,
              }}>
                {[
                  { v: `#${nation.rank}`, l: 'Global Rank', c: '#F59E0B' },
                  { v: nation.points.toLocaleString(), l: 'Nation Points', c: '#2E9E5E' },
                  { v: nation.forecasters.toString(), l: 'Forecasters', c: '#9CA3AF' },
                ].map(({ v, l, c }) => (
                  <div key={l} style={{
                    backgroundColor: '#050E05', border: '1px solid #1A3A1A',
                    borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: c, letterSpacing: '-0.5px' }}>{v}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3, letterSpacing: '0.3px' }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Rival message */}
              {nation.rival && nation.rival.pointsNeeded > 0 ? (
                <div style={{
                  backgroundColor: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                  fontSize: 13, color: '#F59E0B', lineHeight: 1.6,
                }}>
                  {nation.flag} {nation.name} needs{' '}
                  <strong>{nation.rival.pointsNeeded} more points</strong>{' '}
                  to overtake {nation.rival.flag} {nation.rival.name}.{' '}
                  Keep predicting to climb.
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'rgba(46,158,94,0.08)',
                  border: '1px solid rgba(46,158,94,0.25)',
                  borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                  fontSize: 13, color: '#2E9E5E', lineHeight: 1.6,
                }}>
                  🏆 {nation.name} leads the global Nation Battle. Help defend the top spot.
                </div>
              )}

              {/* Share button */}
              <button onClick={handleShare} style={{
                width: '100%', padding: '15px',
                backgroundColor: shared ? '#1A7A4A' : '#2E9E5E',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                letterSpacing: '0.3px', marginBottom: 10,
                transition: 'background 0.2s',
              }}>
                {shared ? '✓ Shared!' : `Share & Represent ${nation.name} →`}
              </button>

              <button onClick={onClose} style={{
                width: '100%', padding: '10px',
                backgroundColor: 'transparent', color: '#6B7280',
                border: 'none', borderRadius: 10, fontSize: 13,
                cursor: 'pointer',
              }}>
                Continue predicting
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#6B7280', marginBottom: 16 }}>Set your nation in your profile to see nation stats.</p>
              <a href="/profile" style={{ color: '#2E9E5E', fontWeight: 700, textDecoration: 'none' }}>Set nation →</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
