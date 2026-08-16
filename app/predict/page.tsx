'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import NationShareCard from '@/components/NationShareCard';

const supabase = createClient();

type Match = {
  id: number;
  api_id: number;
  home_team: string;
  away_team: string;
  kickoff: string;
  status: string;
  league: string;
  competition: string;
};
type CommunityStats = {
  home: number;
  draw: number;
  away: number;
  total: number;
};
const LEAGUES = [
  { key: 'EPL 2026/27', label: 'EPL', icon: '&#x1F3F4;', color: '#8B5CF6', active: true },
  { key: 'World Cup 2026', label: 'World Cup', icon: '&#x1F3C6;', color: '#F59E0B', active: false },
  { key: 'UCL 2026/27', label: 'UCL', icon: '&#x2B50;', color: '#A78BFA', active: false },

  { key: 'ISL 2026/27', label: 'ISL', icon: '&#x1F1EE;&#x1F1F3;', color: '#FF6B35', active: false },
  { key: 'NPFL 2026/27', label: 'NPFL', icon: '&#x1F1F3;&#x1F1EC;', color: '#008751', active: false },
  { key: 'Liga 1 2026/27', label: 'Liga 1', icon: '&#x1F1EE;&#x1F1E9;', color: '#CE1126', active: false },
];

function formatKickoffLocal(kickoffUtc: string): string {
  const utcString = kickoffUtc.endsWith('Z') ? kickoffUtc : kickoffUtc.replace(' ', 'T') + 'Z';
  const date = new Date(utcString);
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzMap: { [key: string]: string } = {
    'Asia/Calcutta': 'IST', 'Asia/Kolkata': 'IST',
    'Africa/Lagos': 'WAT', 'Africa/Abuja': 'WAT',
    'Asia/Jakarta': 'WIB', 'Asia/Makassar': 'WITA',
    'America/Mexico_City': 'CST', 'America/New_York': 'EDT',
    'America/Chicago': 'CDT', 'America/Los_Angeles': 'PDT',
    'Europe/London': 'BST', 'Europe/Paris': 'CEST',
    'Asia/Dubai': 'GST', 'Asia/Singapore': 'SGT',
    'Asia/Tokyo': 'JST', 'Asia/Seoul': 'KST',
    'Australia/Sydney': 'AEST', 'America/Sao_Paulo': 'BRT',
    'Asia/Karachi': 'PKT', 'Asia/Dhaka': 'BST',
    'Africa/Johannesburg': 'SAST',
  };
  const tzLabel = tzMap[browserTz] || '';
  const formatted = date.toLocaleString('en-GB', {
    timeZone: browserTz, day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  return formatted + (tzLabel ? ' ' + tzLabel : '');
}

function useCountdown(kickoff: string) {
  const compute = useCallback(() => {
    const utcString = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const diff = new Date(utcString).getTime() - Date.now();
    if (diff <= 0) return { locked: true, label: '' };
    const totalSecs = Math.floor(diff / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const label = h > 0 ? h + 'h ' + m + 'm ' + s + 's' : m > 0 ? m + 'm ' + s + 's' : s + 's';
    return { locked: false, label };
  }, [kickoff]);
  const [state, setState] = useState(compute);
  useEffect(() => {
    const tick = () => setState(compute());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [compute]);
  return state;
}

function buildShareUrl({ match, pred, username, country }: {
  match: Match; pred: any; username: string; country: string;
}) {
  const params = new URLSearchParams();
  params.set('home', match.home_team);
  params.set('away', match.away_team);
  params.set('outcome', pred?.outcome || 'draw');
  if (pred?.predicted_home_score !== undefined && pred?.predicted_away_score !== undefined) {
    params.set('hs', String(pred.predicted_home_score));
    params.set('as', String(pred.predicted_away_score));
  }
  params.set('conf', String(pred?.confidence || 50));
  params.set('user', username);
  if (country) params.set('country', country);
  if (match.league) params.set('league', match.league);
  return 'https://flipseer.com/predict/share?' + params.toString();
}

// ── LOGGED OUT MATCH CARD ──
function GuestMatchCard({ match, comm }: { match: Match; comm: CommunityStats | undefined }) {
  const { locked, label: timeLeft } = useCountdown(match.kickoff);
  const kickoffDate = formatKickoffLocal(match.kickoff);
  const getPct = (count: number, total: number) => total === 0 ? 0 : Math.round((count / total) * 100);
  const homePct = comm ? getPct(comm.home, comm.total) : 0;
  const drawPct = comm ? getPct(comm.draw, comm.total) : 0;
  const awayPct = comm ? getPct(comm.away, comm.total) : 0;

  return (
    <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          {match.league} · {kickoffDate}
        </span>
        {!locked && timeLeft && (
          <span style={{ fontSize: '11px', backgroundColor: '#1C3A1A', color: '#F59E0B', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
            ⏱ Locks in {timeLeft}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.home_team}</span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>vs</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.away_team}</span>
      </div>
      {comm && comm.total > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: '#6B7280' }}>
            <span>🌍 {comm.total} prediction{comm.total !== 1 ? 's' : ''}</span>
            <span>Community split</span>
          </div>
          <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '8px', marginBottom: '6px' }}>
            {homePct > 0 && <div style={{ width: homePct + '%', backgroundColor: '#8B5CF6' }} />}
            {drawPct > 0 && <div style={{ width: drawPct + '%', backgroundColor: '#6B7280' }} />}
            {awayPct > 0 && <div style={{ width: awayPct + '%', backgroundColor: '#3B82F6' }} />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{match.home_team} {homePct}%</span>
            <span style={{ color: '#6B7280' }}>Draw {drawPct}%</span>
            <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{match.away_team} {awayPct}%</span>
          </div>
        </div>
      )}
      {/* Locked-out predict buttons — tap to sign up */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: match.home_team + ' Win' },
          { label: 'Draw' },
          { label: match.away_team + ' Win' },
        ].map(({ label }) => (
          <a key={label} href="/auth" style={{
            flex: 1, padding: '10px 4px', borderRadius: '8px',
            border: '1px solid #1A7A4A', backgroundColor: 'transparent',
            color: '#9CA3AF', fontSize: '12px', fontWeight: 'bold',
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>
            {label}
          </a>
        ))}
      </div>
      <a href="/auth" style={{
        display: 'block', width: '100%', padding: '12px',
        backgroundColor: '#8B5CF6', color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '14px', fontWeight: 'bold',
        cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
        boxSizing: 'border-box',
      }}>
        Sign in free to predict →
      </a>
    </div>
  );
}

// ── COMING SOON PLACEHOLDER ──
function ComingSoon({ league }: { league: typeof LEAGUES[0] }) {
  const launch = league.key === 'Champions League 2026/27' ? 'September 2026'
    : league.key === 'Indian Super League 2026/27' ? 'November 2026'
    : league.key === 'NPFL 2026/27' ? 'January 2027'
    : league.key === 'Liga 1 2026/27' ? 'February 2027'
    : league.key === 'World Cup 2026' ? 'Archive'
    : 'Coming soon';

  if (league.key === 'World Cup 2026') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px', color: 'white' }}>FIFA World Cup 2026</h2>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '999px', padding: '6px 20px', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 'bold' }}>🇪🇸 Spain are World Champions 2026</span>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', maxWidth: '400px', margin: '0 auto 32px' }}>
          The tournament is over. Spain beat France 2-0 in the Final.<br />Your World Cup predictions are permanent — locked forever.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/world-cup-2026" style={{ backgroundColor: '#F59E0B', color: 'black', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>View All Results →</a>
          <a href="/leaderboard" style={{ backgroundColor: 'transparent', color: '#2E9E5E', border: '1px solid #2E9E5E', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Final Leaderboard →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: league.icon }} />
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '12px', color: 'white' }}>{league.key}</h2>
      <div style={{ display: 'inline-block', backgroundColor: league.color + '20', border: '1px solid ' + league.color, borderRadius: '999px', padding: '6px 20px', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', color: league.color, fontWeight: 'bold' }}>⏳ Launches {launch}</span>
      </div>
      <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', maxWidth: '400px', margin: '0 auto 32px' }}>
        Coming soon. Your prediction record continues across every competition.
      </p>
      <a href="/epl" style={{ backgroundColor: league.color, color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Learn More →</a>
    </div>
  );
}

// ── LOGGED IN MATCH CARD ──
function MatchCard({
  match, pred, isSaved, isLoading, comm, username, country,
  onPredict, onConfidence, onScore, onSave,
}: {
  match: Match; pred: any; isSaved: boolean; isLoading: boolean;
  comm: CommunityStats | undefined; username: string; country: string;
  onPredict: (id: number, outcome: string) => void;
  onConfidence: (id: number, val: number) => void;
  onScore: (id: number, side: 'predicted_home_score' | 'predicted_away_score', val: number) => void;
  onSave: (id: number) => void;
}) {
  const { locked, label: timeLeft } = useCountdown(match.kickoff);
  const [shared, setShared] = useState(false);
  const kickoffDate = formatKickoffLocal(match.kickoff);
  const getPct = (count: number, total: number) => total === 0 ? 0 : Math.round((count / total) * 100);
  const homePct = comm ? getPct(comm.home, comm.total) : 0;
  const drawPct = comm ? getPct(comm.draw, comm.total) : 0;
  const awayPct = comm ? getPct(comm.away, comm.total) : 0;
  const homeVal = pred?.predicted_home_score ?? 0;
  const awayVal = pred?.predicted_away_score ?? 0;
  const pickLabel = pred?.outcome === 'home' ? match.home_team + ' Win'
    : pred?.outcome === 'away' ? match.away_team + ' Win' : 'Draw';
  const predictionShareUrl = buildShareUrl({ match, pred, username, country });
  const shareText = '⚽ I just predicted ' + match.home_team + ' vs ' + match.away_team
    + '\n🎯 ' + pickLabel + ' - ' + (pred?.confidence || 50) + '% confidence'
    + '\nThink you can call it better? -> ' + predictionShareUrl;
  const handleShare = async () => {
    if (!pred?.outcome) return;
    if (navigator.share) {
      await navigator.share({ title: 'My Flipseer Prediction', text: shareText, url: predictionShareUrl });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank');
    }
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (isSaved ? '#8B5CF6' : '#1A7A4A'), borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '6px' }}>
        <a href={`/matches/${match.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${match.away_team.toLowerCase().replace(/\s+/g, '-')}`}
          style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'none' }}>
          {match.league} · {kickoffDate} ↗
        </a>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {!locked && timeLeft && (
            <span style={{ fontSize: '11px', backgroundColor: '#1C3A1A', color: '#F59E0B', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              ⏱ Locks in {timeLeft}
            </span>
          )}
          {locked && <span style={{ fontSize: '11px', backgroundColor: '#7F1D1D', color: '#FCA5A5', padding: '2px 8px', borderRadius: '4px' }}>🔒 LOCKED</span>}
          {isSaved && !locked && <span style={{ fontSize: '11px', backgroundColor: '#4C1D95', color: '#C4B5FD', padding: '2px 8px', borderRadius: '4px' }}>✅ SAVED</span>}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.home_team}</span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>vs</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{match.away_team}</span>
      </div>
      {comm && comm.total > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: '#6B7280' }}>
            <span>🌍 {comm.total} prediction{comm.total !== 1 ? 's' : ''}</span>
            <span>Community split</span>
          </div>
          <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '8px', marginBottom: '6px' }}>
            {homePct > 0 && <div style={{ width: homePct + '%', backgroundColor: '#8B5CF6' }} />}
            {drawPct > 0 && <div style={{ width: drawPct + '%', backgroundColor: '#6B7280' }} />}
            {awayPct > 0 && <div style={{ width: awayPct + '%', backgroundColor: '#3B82F6' }} />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{match.home_team} {homePct}%</span>
            <span style={{ color: '#6B7280' }}>Draw {drawPct}%</span>
            <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{match.away_team} {awayPct}%</span>
          </div>
        </div>
      )}
      {!locked && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[
              { value: 'home', label: match.home_team + ' Win' },
              { value: 'draw', label: 'Draw' },
              { value: 'away', label: match.away_team + ' Win' },
            ].map(({ value, label }) => (
              <button key={value} onClick={() => onPredict(match.id, value)}
                style={{ flex: 1, padding: '10px 4px', borderRadius: '8px', border: '1px solid ' + (pred?.outcome === value ? '#8B5CF6' : '#1A7A4A'), backgroundColor: pred?.outcome === value ? '#4C1D95' : 'transparent', color: pred?.outcome === value ? 'white' : '#9CA3AF', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                {label}
              </button>
            ))}
          </div>
          {pred?.outcome && (
            <div style={{ marginBottom: '16px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', textAlign: 'center' }}>
                🎯 Exact Score <span style={{ color: '#8B5CF6', fontSize: '11px' }}>(+55 pts if correct!)</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{match.home_team}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => onScore(match.id, 'predicted_home_score', homeVal - 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #8B5CF6', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>-</button>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{homeVal}</span>
                    <button onClick={() => onScore(match.id, 'predicted_home_score', homeVal + 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #8B5CF6', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                  </div>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6B7280', marginTop: '16px' }}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{match.away_team}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => onScore(match.id, 'predicted_away_score', awayVal - 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #8B5CF6', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>-</button>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{awayVal}</span>
                    <button onClick={() => onScore(match.id, 'predicted_away_score', awayVal + 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #8B5CF6', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {pred?.outcome && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B5CF6' }}>{pred.confidence}%</span>
              </div>
              <input type="range" min="1" max="100" value={pred.confidence}
                onChange={(e) => onConfidence(match.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#8B5CF6' }} />
            </div>
          )}
          {pred?.outcome && comm && comm.total > 0 && (
            <div style={{ marginBottom: '12px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                👥 You agree with{' '}
                <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>
                  {pred.outcome === 'home' ? homePct : pred.outcome === 'draw' ? drawPct : awayPct}%
                </span>
                {' '}of forecasters
                {(pred.outcome === 'home' ? homePct : pred.outcome === 'draw' ? drawPct : awayPct) < 30 && (
                  <span style={{ color: '#F59E0B' }}> · 🦁 Brave call!</span>
                )}
              </span>
            </div>
          )}
          {pred?.outcome && (
            <button onClick={() => onSave(match.id)} disabled={isLoading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Saving...' : isSaved ? 'Update Prediction' : 'Lock In Prediction'}
            </button>
          )}
        </>
      )}
      {locked && (
        <div style={{ backgroundColor: '#1A1A2E', padding: '12px', borderRadius: '8px', border: '1px solid #2D1B69' }}>
          {pred?.outcome ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#C4B5FD' }}>
                  Your pick: <strong>{pred.outcome === 'home' ? match.home_team : pred.outcome === 'away' ? match.away_team : 'Draw'}</strong>
                  {pred.predicted_home_score !== undefined && <span> · Score: <strong>{pred.predicted_home_score}-{pred.predicted_away_score}</strong></span>}
                  {' '}· {pred.confidence}% confidence
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleShare} style={{ flex: 1, padding: '8px', backgroundColor: '#4C1D95', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {shared ? 'Shared!' : 'Share'}
                </button>
                <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '8px', backgroundColor: '#25D366', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: '#6B7280', display: 'block', textAlign: 'center' }}>🔒 Predictions closed</span>
          )}
        </div>
      )}
      {isSaved && !locked && pred?.outcome && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button onClick={handleShare} style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', color: '#8B5CF6', border: '1px solid #8B5CF6', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            {shared ? 'Shared!' : 'Share Prediction'}
          </button>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, padding: '8px', backgroundColor: '#25D366', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ──
export default function Predict() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('forecaster');
  const [country, setCountry] = useState('');
  const [activeLeague, setActiveLeague] = useState('EPL 2026/27');
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [predictions, setPredictions] = useState<{ [key: number]: any }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [community, setCommunity] = useState<{ [key: number]: CommunityStats }>({});
  const [dailyUsed, setDailyUsed] = useState(0);
  const [lifetimePredictionCount, setLifetimePredictionCount] = useState<number | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [nationShare, setNationShare] = useState<{ matchName: string; points: number } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const DAILY_LIMIT = 16;

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthChecked(true);

      // Load EPL matches for everyone — logged in or not
      setMatchesLoading(true);
      const [matchRes, commRes] = await Promise.all([
        supabase.from('matches')
          .select('id, api_id, home_team, away_team, kickoff, status, league, competition')
          .in('status', ['upcoming'])
          .eq('competition', 'EPL 2026/27')
          .order('kickoff', { ascending: true }),
        supabase.from('predictions').select('match_id, predicted_outcome'),
      ]);
      setMatches(matchRes.data || []);
      setMatchesLoading(false);

      // Community stats for everyone
      const commData = commRes.data;
      if (commData) {
        const stats: { [key: number]: CommunityStats } = {};
        commData.forEach((p: any) => {
          if (!stats[p.match_id]) stats[p.match_id] = { home: 0, draw: 0, away: 0, total: 0 };
          stats[p.match_id][p.predicted_outcome as 'home' | 'draw' | 'away']++;
          stats[p.match_id].total++;
        });
        setCommunity(stats);
      }

      // Additional data for logged-in users only
      if (session) {
        setUser(session.user);
        const [profileRes, predRes] = await Promise.all([
          supabase.from('profiles').select('username, country, prediction_count').eq('id', session.user.id).single(),
          supabase.from('predictions').select('*').eq('user_id', session.user.id),
        ]);
        if (profileRes.data?.username) setUsername(profileRes.data.username);
        if (profileRes.data?.country) setCountry(profileRes.data.country);
        setLifetimePredictionCount(profileRes.data?.prediction_count ?? 0);
        const predData = predRes.data;
        if (predData) {
          const existing: any = {};
          const savedMap: any = {};
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          let todayCount = 0;
          predData.forEach((p: any) => {
            existing[p.match_id] = {
              outcome: p.predicted_outcome,
              confidence: p.confidence_pct,
              predicted_home_score: p.predicted_home_score ?? undefined,
              predicted_away_score: p.predicted_away_score ?? undefined,
            };
            savedMap[p.match_id] = true;
            if (new Date(p.created_at) >= todayStart) todayCount++;
          });
          setPredictions(existing);
          setSaved(savedMap);
          setDailyUsed(todayCount);
        }
      }
    };
    init();
  }, []);

  const handleLeagueChange = async (leagueKey: string) => {
    setActiveLeague(leagueKey);
    const league = LEAGUES.find(l => l.key === leagueKey);
    if (!league?.active) return;
    setMatchesLoading(true);
    const { data } = await supabase.from('matches')
      .select('id, api_id, home_team, away_team, kickoff, status, league, competition')
      .in('status', ['upcoming'])
      .eq('competition', leagueKey)
      .order('kickoff', { ascending: true });
    setMatches(data || []);
    setMatchesLoading(false);
  };

  const handlePredict = (matchId: number, outcome: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        outcome,
        confidence: prev[matchId]?.confidence || 50,
        predicted_home_score: prev[matchId]?.predicted_home_score,
        predicted_away_score: prev[matchId]?.predicted_away_score,
      },
    }));
  };
  const handleConfidence = (matchId: number, confidence: number) => {
    setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], confidence } }));
  };
  const handleScore = (matchId: number, side: 'predicted_home_score' | 'predicted_away_score', value: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: Math.max(0, Math.min(20, value)) },
    }));
  };
  const handleSave = async (matchId: number) => {
    if (!user || !predictions[matchId]?.outcome) return;
    const isUpdate = saved[matchId];
    if (!isUpdate && dailyUsed >= DAILY_LIMIT) {
      alert('Daily limit reached! You can make ' + DAILY_LIMIT + ' new predictions per day. Come back tomorrow!');
      return;
    }
    setLoading(prev => ({ ...prev, [matchId]: true }));
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token },
      body: JSON.stringify({
        match_id: matchId,
        predicted_outcome: predictions[matchId].outcome,
        confidence_pct: predictions[matchId].confidence,
        predicted_home_score: predictions[matchId].predicted_home_score ?? null,
        predicted_away_score: predictions[matchId].predicted_away_score ?? null,
      }),
    });
    const data = await res.json();
    setLoading(prev => ({ ...prev, [matchId]: false }));
    if (res.status === 429) { alert(data.error); return; }
    if (res.ok) {
      setSaved(prev => ({ ...prev, [matchId]: true }));
      if (!isUpdate) setDailyUsed(prev => prev + 1);
      setCommunity(prev => {
        const old = prev[matchId] || { home: 0, draw: 0, away: 0, total: 0 };
        const outcome = predictions[matchId].outcome as 'home' | 'draw' | 'away';
        return { ...prev, [matchId]: { ...old, [outcome]: old[outcome] + 1, total: old.total + 1 } };
      });
      const match = matches.find(m => m.id === matchId);
      if (match && country && !isUpdate) {
        setTimeout(() => {
          setNationShare({ matchName: match.home_team + ' vs ' + match.away_team, points: 10 });
        }, 800);
      }
    } else {
      alert(data.error || 'Failed to save prediction. Please try again.');
    }
  };

  const remaining = Math.max(0, DAILY_LIMIT - dailyUsed);
  const activeLeagueData = LEAGUES.find(l => l.key === activeLeague) || LEAGUES[0];

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '32px 20px 0' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '6px' }}>
          🏴󠁧󠁢󠁥󠁮󠁧󠁿 Predict Matches
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
          Lock in your call before kickoff. Permanent record. Free forever.
        </p>
      </section>

      {/* LEAGUE TABS */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {LEAGUES.map((league) => (
            <button key={league.key} onClick={() => handleLeagueChange(league.key)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px',
                border: '2px solid ' + (activeLeague === league.key ? league.color : '#1A3A1A'),
                backgroundColor: activeLeague === league.key ? league.color + '20' : '#0D2B14',
                color: activeLeague === league.key ? league.color : '#8895A3',
                cursor: 'pointer', fontSize: '13px',
                fontWeight: activeLeague === league.key ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}>
              <span dangerouslySetInnerHTML={{ __html: league.icon }} />
              {league.label}
              {!league.active && (
                <span style={{ fontSize: '9px', backgroundColor: '#1A3A1A', color: '#6B7280', padding: '2px 7px', borderRadius: '999px', marginLeft: '4px' }}>
                  {league.key === 'World Cup 2026' ? 'DONE' : 'SOON'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* GUEST SIGN UP BANNER */}
      {!user && authChecked && activeLeagueData.active && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px 16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1A0B2E, #2D1B69)', border: '2px solid #8B5CF6', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                🏅 EPL Founding Forecaster badge — this week only
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Sign in free. Predict before August 24. Badge awarded permanently.
              </div>
            </div>
            <a href="/auth" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Sign in free →
            </a>
          </div>
        </div>
      )}

      {/* DAILY LIMIT — logged in only */}
      {user && activeLeagueData.active && (
        <section style={{ textAlign: 'center', padding: '0 20px 16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: remaining === 0 ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)', border: '1px solid ' + (remaining === 0 ? '#EF4444' : '#8B5CF6'), borderRadius: '999px', padding: '6px 16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: remaining === 0 ? '#EF4444' : '#8B5CF6', fontWeight: 'bold' }}>
              {remaining === 0 ? 'Daily limit reached - come back tomorrow!' : 'Today: ' + dailyUsed + '/' + DAILY_LIMIT + ' predictions - ' + remaining + ' remaining'}
            </span>
          </div>
          {username !== 'forecaster' && (
            <div><a href={'/u/' + username} style={{ color: '#8B5CF6', fontSize: '13px', textDecoration: 'none' }}>View your journal →</a></div>
          )}
        </section>
      )}

      {/* CONTENT */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px 40px' }}>
        {!activeLeagueData.active ? (
          <ComingSoon league={activeLeagueData} />
        ) : matchesLoading ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
            <p>Loading {activeLeague} matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '60px', backgroundColor: '#0D2B14', borderRadius: '12px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
            <p style={{ marginBottom: '8px' }}>No upcoming {activeLeague} matches right now.</p>
            <p style={{ fontSize: '12px', color: '#8895A3' }}>Check back soon — new matches are added automatically.</p>
          </div>
        ) : !user ? (
          // GUEST VIEW — show matches with sign-in prompt
          <>
            {matches.map((match) => (
              <GuestMatchCard key={match.id} match={match} comm={community[match.id]} />
            ))}
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
                Sign in free to predict →
              </a>
              <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '8px' }}>Free forever · No betting · No card required</p>
            </div>
          </>
        ) : (
          // LOGGED IN VIEW
          (() => {
            const isBrandNewUser = lifetimePredictionCount === 0 && username !== 'forecaster';
            const visibleMatches = (isBrandNewUser && !showAllMatches) ? matches.slice(0, 1) : matches;
            return (
              <>
                {isBrandNewUser && !showAllMatches && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '10px 16px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8 }}>
                    <span style={{ fontSize: 18 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                    <span style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 700 }}>YOUR FIRST EPL CALL — pick a match, your record begins</span>
                  </div>
                )}
                {visibleMatches.map((match) => (
                  <MatchCard
                    key={match.id} match={match}
                    pred={predictions[match.id]}
                    isSaved={saved[match.id] ?? false}
                    isLoading={loading[match.id] ?? false}
                    comm={community[match.id]}
                    username={username} country={country}
                    onPredict={handlePredict}
                    onConfidence={handleConfidence}
                    onScore={handleScore}
                    onSave={handleSave}
                  />
                ))}
                {isBrandNewUser && !showAllMatches && matches.length > 1 && (
                  <button onClick={() => setShowAllMatches(true)} style={{ width: '100%', marginTop: 8, padding: '12px', backgroundColor: 'transparent', border: '1px dashed #2D1B69', borderRadius: 10, color: '#6B7280', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    Show all {matches.length} matches →
                  </button>
                )}
              </>
            );
          })()
        )}
      </section>

      {nationShare && country && (
        <NationShareCard
          country={country}
          pointsJustEarned={nationShare.points}
          matchName={nationShare.matchName}
          onClose={() => setNationShare(null)}
        />
      )}
    </main>
  );
}
