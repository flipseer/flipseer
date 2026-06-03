'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function ResultPage() {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [newBadges, setNewBadges] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth'; return; }

      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match_id');
      if (!matchId) { window.location.href = '/predict'; return; }

      const [predRes, matchRes, profileRes, badgeRes] = await Promise.all([
        supabase.from('predictions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('match_id', matchId)
          .single(),
        supabase.from('matches')
          .select('*')
          .eq('id', matchId)
          .single(),
        supabase.from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single(),
        supabase.from('user_badges')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('match_id', matchId),
      ]);

      setPrediction(predRes.data);
      setMatch(matchRes.data);
      setProfile(profileRes.data);
      setNewBadges(badgeRes.data || []);
      setLoading(false);

      // Auto flip after 1 second
      setTimeout(() => setFlipped(true), 800);
      setTimeout(() => setRevealed(true), 1600);
    };
    load();
  }, []);

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26BD;</div>
        <p style={{ color: '#2E9E5E', fontSize: '18px' }}>Loading your result...</p>
      </div>
    </main>
  );

  if (!prediction || !match) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>No prediction found for this match.</p>
        <a href="/predict" style={{ color: '#2E9E5E', textDecoration: 'none', fontWeight: 'bold' }}>Go to Predict</a>
      </div>
    </main>
  );

  const won = prediction.points_earned > 0;
  const points = prediction.points_earned || 0;
  const matchName = match.home_team + ' vs ' + match.away_team;
  const actualScore = match.home_score + '-' + match.away_score;
  const outcomeLabel = prediction.predicted_outcome === 'home' ? match.home_team
    : prediction.predicted_outcome === 'away' ? match.away_team : 'Draw';

  const breakdown = [];
  if (prediction.base_points > 0) breakdown.push({ label: 'Correct outcome', pts: '+' + prediction.base_points, color: '#2E9E5E' });
  if (prediction.exact_bonus > 0) breakdown.push({ label: 'Exact score', pts: '+' + prediction.exact_bonus, color: '#F59E0B' });
  if (prediction.goal_diff_bonus > 0) breakdown.push({ label: 'Goal difference', pts: '+' + prediction.goal_diff_bonus, color: '#3B82F6' });
  if (prediction.upset_bonus > 0) breakdown.push({ label: 'Upset bonus', pts: '+' + prediction.upset_bonus, color: '#8B5CF6' });
  if (prediction.confidence_multiplier > 1) breakdown.push({ label: 'Confidence x' + prediction.confidence_multiplier, pts: 'x' + prediction.confidence_multiplier, color: '#FB923C' });

  const shareText = won
    ? 'I predicted ' + outcomeLabel + ' in ' + matchName + ' and earned +' + points + ' pts on Flipseer! Build your football reputation at flipseer.com #WorldCup2026 #Flipseer'
    : 'I missed ' + matchName + ' on Flipseer but my record lives on! flipseer.com #WorldCup2026 #Flipseer';

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '40px 20px' }}>
      <style>{`
        @keyframes flipIn {
          0% { transform: rotateY(90deg); opacity: 0; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(46,158,94,0.3); }
          50% { box-shadow: 0 0 60px rgba(46,158,94,0.8); }
        }
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Match header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', animation: 'slideUp 0.5s ease forwards' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '2px', marginBottom: '6px' }}>FULL TIME</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '6px' }}>{matchName}</h2>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{actualScore}</div>
          {match.is_upset && (
            <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', backgroundColor: 'rgba(245,158,11,0.1)', padding: '3px 12px', borderRadius: '999px', border: '1px solid #F59E0B' }}>
              UPSET RESULT
            </span>
          )}
        </div>

        {/* FLIP CARD */}
        <div
          onClick={() => { if (!flipped) { setFlipped(true); setTimeout(() => setRevealed(true), 800); } }}
          style={{
            backgroundColor: '#0D2B14',
            border: '2px solid ' + (won ? '#2E9E5E' : '#7F1D1D'),
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '20px',
            cursor: flipped ? 'default' : 'pointer',
            animation: flipped ? 'flipIn 0.6s ease forwards, ' + (won ? 'glow 2s ease infinite' : 'none') : 'pulse 1.5s ease infinite',
            transition: 'all 0.3s ease',
          }}>

          {!flipped ? (
            /* PRE-FLIP */
            <div>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>&#x1F3C6;</div>
              <p style={{ color: '#2E9E5E', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Tap to reveal your result</p>
              <p style={{ color: '#4B5563', fontSize: '12px', marginTop: '6px' }}>Your prediction has been processed</p>
            </div>
          ) : (
            /* POST-FLIP */
            <div style={{ animation: 'flipIn 0.5s ease forwards' }}>
              <div style={{ fontSize: '56px', marginBottom: '8px' }}>{won ? '&#x2705;' : '&#x274C;'}</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: won ? '#2E9E5E' : '#EF4444', marginBottom: '4px' }}>
                {won ? 'You called it!' : 'Missed this one'}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px' }}>
                You picked: <strong style={{ color: 'white' }}>{outcomeLabel}</strong> at <strong style={{ color: 'white' }}>{prediction.confidence_pct}%</strong> confidence
              </p>

              {/* Points display */}
              <div style={{ backgroundColor: won ? 'rgba(46,158,94,0.15)' : 'rgba(127,29,29,0.15)', border: '1px solid ' + (won ? '#2E9E5E' : '#7F1D1D'), borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '52px', fontWeight: 'bold', color: won ? '#2E9E5E' : '#EF4444', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                  {won ? '+' + points : '0'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>points earned</div>

                {/* Breakdown */}
                {breakdown.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                    {breakdown.map((b, i) => (
                      <span key={i} style={{ fontSize: '11px', color: b.color, backgroundColor: 'rgba(0,0,0,0.3)', padding: '3px 10px', borderRadius: '999px', border: '1px solid ' + b.color + '40' }}>
                        {b.label}: {b.pts}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Updated stats */}
              {revealed && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', animation: 'slideUp 0.4s ease forwards' }}>
                  {[
                    { label: 'TOTAL PTS', value: profile?.total_points || 0 },
                    { label: 'ACCURACY', value: (profile?.accuracy_pct || 0) + '%' },
                    { label: 'STREAK', value: (profile?.streak || 0) + (won ? ' &#x1F525;' : '') },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ backgroundColor: '#0D1F0F', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '1px', marginBottom: '3px' }}>{label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E9E5E' }} dangerouslySetInnerHTML={{ __html: String(value) }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* NEW BADGES */}
        {revealed && newBadges.length > 0 && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #F59E0B', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center', animation: 'slideUp 0.5s ease 0.3s forwards', opacity: 0 }}>
            <p style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 12px' }}>NEW BADGE{newBadges.length > 1 ? 'S' : ''} UNLOCKED!</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {newBadges.map((b) => (
                <div key={b.id} style={{ animation: 'badgePop 0.5s ease forwards', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '4px' }}>{b.badge_icon}</div>
                  <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>{b.badge_label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {revealed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'slideUp 0.4s ease 0.5s forwards', opacity: 0 }}>
            <a href="/predict" style={{ display: 'block', backgroundColor: '#1A7A4A', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' }}>
              Predict Next Match &#x2192;
            </a>
            <a href="/leaderboard" style={{ display: 'block', backgroundColor: 'transparent', color: '#2E9E5E', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', border: '1px solid #2E9E5E' }}>
              View Leaderboard &#x2192;
            </a>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, display: 'block', backgroundColor: '#25D366', color: 'white', padding: '11px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                Share on WhatsApp
              </a>
              <a href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText)}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, display: 'block', backgroundColor: '#000000', color: 'white', padding: '11px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                Share on X
              </a>
            </div>
            <a href="/profile" style={{ display: 'block', color: '#4B5563', padding: '10px', textDecoration: 'none', fontSize: '12px', textAlign: 'center' }}>
              View full profile &#x2192;
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
