'use client';
import { useState, useEffect, useRef } from 'react';

type CardData = {
  username: string;
  country: string | null;
  flag: string | null;
  nationName: string | null;
  globalRank: number;
  nationRank: number | null;
  totalPoints: number;
  accuracyPct: number;
  predictionCount: number;
  correctCount: number;
  bestStreak: number;
  exactScores: number;
  rank: string;
  rankIcon: string;
};

type Props = {
  username: string;
  onClose: () => void;
};

export default function ReputationCard({ username, onClose }: Props) {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const [copying, setCopying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/reputation-card?username=${encodeURIComponent(username)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [username]);

  const shareText = data ? (
    `${data.flag || '⚽'} ${data.nationName ? data.nationName.toUpperCase() : 'GLOBAL'}\n` +
    `@${data.username} · ${data.rankIcon} ${data.rank}\n\n` +
    `🌍 Global Rank: #${data.globalRank}\n` +
    `⚡ ${data.totalPoints} points\n` +
    `🎯 ${data.accuracyPct}% accuracy\n` +
    `📊 ${data.predictionCount} predictions\n` +
    (data.exactScores > 0 ? `✨ ${data.exactScores} exact scores\n` : '') +
    (data.bestStreak > 1 ? `🔥 Best streak: ${data.bestStreak}\n` : '') +
    `\nPermanent Football Reputation\n` +
    `flipseer.com/u/${data.username}\n` +
    `#WorldCup2026 #FootballReputation #Flipseer`
  ) : '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `@${username}'s Football Reputation`,
        text: shareText,
        url: `https://flipseer.com/u/${username}`,
      });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank');
    }
    setShared(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .rep-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:600;display:flex;align-items:flex-end;justify-content:center}
        @media(min-width:640px){.rep-backdrop{align-items:center}}
      `}</style>
      <div className="rep-backdrop" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: 480,
          backgroundColor: '#0D1F0F',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          animation: 'slideUp 0.35s ease',
          position: 'relative',
        }}>
          {/* Close */}
          <button onClick={onClose} aria-label="Close" style={{
            position: 'absolute', top: 14, right: 16,
            background: 'transparent', border: 'none',
            color: '#6B7280', fontSize: 24, cursor: 'pointer', lineHeight: 1,
          }}>×</button>

          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px', marginBottom: 12, textAlign: 'center' }}>
            YOUR FOOTBALL REPUTATION CARD
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#2E9E5E' }}>Loading...</div>
          ) : data ? (
            <>
              {/* THE CARD — designed for screenshots */}
              <div ref={cardRef} style={{
                background: 'linear-gradient(135deg, #071408 0%, #0D2B14 50%, #071408 100%)',
                border: '1px solid #2E9E5E',
                borderRadius: 16,
                padding: '24px 20px',
                marginBottom: 16,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Glow effect */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(46,158,94,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}/>

                {/* Top row — flag + nation + rank badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {data.flag && <span style={{ fontSize: 32 }}>{data.flag}</span>}
                    <div>
                      {data.nationName && (
                        <div style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px' }}>
                          {data.nationName.toUpperCase()}
                        </div>
                      )}
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
                        @{data.username}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(46,158,94,0.1)',
                    border: '1px solid #1A7A4A',
                    borderRadius: 8, padding: '4px 10px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 16 }}>{data.rankIcon}</div>
                    <div style={{ fontSize: 9, color: '#2E9E5E', fontWeight: 700, letterSpacing: '0.5px' }}>{data.rank.toUpperCase()}</div>
                  </div>
                </div>

                {/* Global rank — hero stat */}
                <div style={{
                  textAlign: 'center', marginBottom: 16,
                  padding: '14px 0',
                  borderTop: '1px solid #1A3A1A',
                  borderBottom: '1px solid #1A3A1A',
                }}>
                  <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', marginBottom: 4 }}>GLOBAL RANK</div>
                  <div style={{
                    fontSize: 'clamp(48px,12vw,72px)', fontWeight: 900,
                    color: '#F59E0B', lineHeight: 0.9, letterSpacing: '-3px',
                  }}>
                    #{data.globalRank}
                  </div>
                  {data.nationRank && data.nationName && (
                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>
                      #{data.nationRank} in {data.nationName}
                    </div>
                  )}
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                  {[
                    { v: `${data.accuracyPct}%`, l: 'Accuracy', c: '#2E9E5E' },
                    { v: data.predictionCount.toString(), l: 'Predictions', c: '#9CA3AF' },
                    { v: data.totalPoints.toLocaleString(), l: 'Points', c: '#F59E0B' },
                  ].map(({ v, l, c }) => (
                    <div key={l} style={{
                      backgroundColor: '#050E05', border: '1px solid #1A3A1A',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: c, letterSpacing: '-0.5px' }}>{v}</div>
                      <div style={{ fontSize: 9, color: '#6B7280', marginTop: 2, letterSpacing: '0.5px' }}>{l.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                {/* Secondary stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: 16 }}>
                  {[
                    { v: data.exactScores.toString(), l: 'Exact Scores', c: '#8B5CF6', icon: '🎯' },
                    { v: data.bestStreak.toString(), l: 'Best Streak', c: '#F59E0B', icon: '🔥' },
                  ].map(({ v, l, c, icon }) => (
                    <div key={l} style={{
                      backgroundColor: '#050E05', border: '1px solid #1A3A1A',
                      borderRadius: 10, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: c, letterSpacing: '-0.5px' }}>{v}</div>
                        <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: '0.5px' }}>{l.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer branding */}
                <div style={{
                  borderTop: '1px solid #1A3A1A', paddingTop: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#2E9E5E', fontWeight: 700, letterSpacing: '1px' }}>PERMANENT FOOTBALL REPUTATION</div>
                    <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2 }}>flipseer.com · World Cup 2026</div>
                  </div>
                  <div style={{ fontSize: 20 }}>⚽</div>
                </div>
              </div>

              {/* Share buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleShare} style={{
                  flex: 1, padding: '13px',
                  backgroundColor: shared ? '#1A7A4A' : '#2E9E5E',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.2s',
                }}>
                  {shared ? '✓ Shared!' : '↗ Share Card'}
                </button>
                <button onClick={handleCopy} style={{
                  flex: 1, padding: '13px',
                  backgroundColor: copying ? '#1A3A1A' : 'transparent',
                  color: copying ? '#2E9E5E' : '#6B7280',
                  border: '1px solid #1A3A1A', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {copying ? '✓ Copied!' : '📋 Copy Text'}
                </button>
              </div>

              <a href={`/u/${username}`} style={{
                display: 'block', textAlign: 'center', marginTop: 10,
                fontSize: 12, color: '#4B5563', textDecoration: 'none',
              }}>
                View full journal →
              </a>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              Failed to load reputation data.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
