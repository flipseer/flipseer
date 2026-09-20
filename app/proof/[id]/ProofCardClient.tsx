'use client';
import { useState } from 'react';

const FLAG: { [key: string]: string } = {
  'IN': '🇮🇳', 'ID': '🇮🇩', 'NG': '🇳🇬', 'GH': '🇬🇭',
  'GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'BR': '🇧🇷', 'AR': '🇦🇷', 'US': '🇺🇸',
  'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸', 'JP': '🇯🇵',
};

const RESULT_CONFIG = {
  exact:   { label: 'EXACT SCORE', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: '#F59E0B', icon: '🎯' },
  correct: { label: 'CORRECT',     color: '#2E9E5E', bg: 'rgba(46,158,94,0.1)',   border: '#2E9E5E', icon: '✓'  },
  wrong:   { label: 'WRONG',       color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: '#EF4444', icon: '✗'  },
  pending: { label: 'LOCKED IN',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: '#8B5CF6', icon: '🔒' },
};

export default function ProofCardClient({ prediction, result }: { prediction: any; result: string }) {
  const [copied, setCopied] = useState(false);
  const profile = prediction.profiles as any;
  const match = prediction.matches as any;
  const cfg = RESULT_CONFIG[result as keyof typeof RESULT_CONFIG] || RESULT_CONFIG.pending;
  const pageUrl = `https://flipseer.com/proof/${prediction.id}`;
  const flag = FLAG[profile?.country] || '';

  const formatDate = (d: string) => new Date(d.endsWith('Z') ? d : d.replace(' ', 'T') + 'Z')
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const getShareText = () => {
    const score = `${prediction.predicted_home_score}-${prediction.predicted_away_score}`;
    const matchName = `${match?.home_team} vs ${match?.away_team}`;
    if (result === 'exact') return `🎯 Called it EXACTLY.\n\n${matchName}\nMy prediction: ${score} ✓ EXACT\nConfidence: ${prediction.confidence}%\nLocked on Flipseer before kickoff.\n\nSee my record → ${pageUrl}`;
    if (result === 'correct') return `✓ Called it.\n\n${matchName}\nPredicted: ${score}\nConfidence: ${prediction.confidence}%\nLocked on Flipseer before kickoff.\n\nSee my record → ${pageUrl}`;
    if (result === 'wrong') return `✗ Got this one wrong.\n\n${matchName}\nI predicted: ${score}\nActual: ${match?.actual_home_score}-${match?.actual_away_score}\n\nOn my permanent Flipseer record. No excuses.\n→ ${pageUrl}`;
    return `🔒 My prediction is locked for ${matchName}.\n${score} · ${prediction.confidence}% confidence\n\nFree predictions → flipseer.com/predict`;
  };

  const shareWhatsApp = () => window.open('https://wa.me/?text=' + encodeURIComponent(getShareText()), '_blank');
  const shareX = () => {
    const text = result === 'exact'
      ? `🎯 Called it EXACTLY. ${match?.home_team} ${prediction.predicted_home_score}-${prediction.predicted_away_score} ${match?.away_team} · ${prediction.confidence}% confidence · Locked before kickoff on @FlipseerHQ`
      : result === 'correct'
      ? `✓ Called it. ${match?.home_team} vs ${match?.away_team} · ${prediction.predicted_home_score}-${prediction.predicted_away_score} · ${prediction.confidence}% confidence · Permanent record on @FlipseerHQ`
      : `✗ Got this wrong. ${match?.home_team} vs ${match?.away_team} · Predicted ${prediction.predicted_home_score}-${prediction.predicted_away_score} · On my permanent @FlipseerHQ record. No excuses.`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(pageUrl), '_blank');
  };
  const shareFacebook = () => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl), '_blank');
  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <main style={{ background: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '0 0 80px' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg,#0A0014 0%,#0D1F0F 100%)', padding: '20px', borderBottom: '1px solid #1A2A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Flipseer</a>
        <a href="/predict" style={{ fontSize: '12px', color: '#8B5CF6', textDecoration: 'none', border: '1px solid rgba(139,92,246,.4)', padding: '5px 12px', borderRadius: '999px' }}>
          ⚽ Make your prediction →
        </a>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        {/* RESULT BADGE */}
        <div style={{ textAlign: 'center', marginBottom: '20px', animation: 'fadeIn .4s ease' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{cfg.icon}</div>
          <div style={{ display: 'inline-block', background: cfg.bg, border: '1px solid ' + cfg.border, color: cfg.color, padding: '6px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px' }}>
            {cfg.label}
          </div>
        </div>

        {/* PROOF CARD */}
        <div style={{ background: '#0D2B14', border: '2px solid ' + cfg.border, borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', animation: 'fadeIn .5s ease', boxShadow: '0 0 40px ' + cfg.color + '20' }}>

          {/* Match header */}
          <div style={{ padding: '20px', borderBottom: '1px solid #1A2A1A', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>
              {match?.competition?.replace(' 2026/27', '')} · {formatDate(match?.kickoff)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'right', flex: 1 }}>{match?.home_team}</span>
              <div style={{ background: '#050E05', border: '1px solid ' + cfg.border, borderRadius: '8px', padding: '8px 16px', textAlign: 'center', minWidth: '70px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: cfg.color }}>
                  {prediction.predicted_home_score}–{prediction.predicted_away_score}
                </div>
                <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '1px', marginTop: '2px' }}>PREDICTED</div>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'left', flex: 1 }}>{match?.away_team}</span>
            </div>
            {result !== 'pending' && match?.actual_home_score !== null && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#6B7280' }}>
                Actual result: <span style={{ color: 'white', fontWeight: 'bold' }}>{match?.actual_home_score}–{match?.actual_away_score}</span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #1A2A1A' }}>
            {[
              { label: 'Confidence', value: prediction.confidence + '%', color: '#8B5CF6' },
              { label: 'REP Score', value: profile?.total_points || 0, color: '#F59E0B' },
              { label: 'Accuracy', value: (profile?.accuracy_pct || 0) + '%', color: '#2E9E5E' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid #1A2A1A' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color }}>{value}</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Predictor row */}
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#4C1D95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#C4B5FD', flexShrink: 0 }}>
              {profile?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>@{profile?.username}</span>
                {flag && <span style={{ fontSize: '14px' }}>{flag}</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Locked {formatDate(prediction.created_at)} · Permanent record
              </div>
            </div>
            <a href={`/u/${profile?.username}`} style={{ fontSize: '11px', color: '#8B5CF6', textDecoration: 'none', border: '1px solid rgba(139,92,246,.3)', padding: '4px 10px', borderRadius: '999px' }}>
              View profile →
            </a>
          </div>

          {/* Flipseer branding */}
          <div style={{ padding: '10px 20px', background: '#050E05', borderTop: '1px solid #1A2A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#4B5563' }}>🔒 Locked before kickoff · No edits ever</span>
            <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold' }}>Flipseer</span>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px', textAlign: 'center' }}>SHARE YOUR PROOF</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <button onClick={shareWhatsApp}
              style={{ padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              📲 WhatsApp
            </button>
            <button onClick={shareX}
              style={{ padding: '12px', background: '#000000', color: 'white', border: '1px solid #333', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              𝕏 Post on X
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={shareFacebook}
              style={{ padding: '12px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              Facebook
            </button>
            <button onClick={copyLink}
              style={{ padding: '12px', background: copied ? '#2E9E5E' : 'transparent', color: copied ? 'white' : '#9CA3AF', border: '1px solid ' + (copied ? '#2E9E5E' : '#2A3A2A'), borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 12px', lineHeight: 1.6 }}>
            Build your own permanent Football Reputation. Every prediction locked before kickoff. Free forever.
          </p>
          <a href="/predict" style={{ display: 'inline-block', background: '#8B5CF6', color: 'white', padding: '11px 28px', borderRadius: '9px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            ⚽ Make Your Prediction →
          </a>
        </div>
      </div>
    </main>
  );
}
