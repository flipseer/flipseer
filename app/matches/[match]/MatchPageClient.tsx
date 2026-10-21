'use client';
import { useState, useEffect } from 'react';

const COUNTRY_FLAGS: { [key: string]: string } = {
  'IN': '🇮🇳', 'BR': '🇧🇷', 'AR': '🇦🇷', 'FR': '🇫🇷', 'DE': '🇩🇪',
  'GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'ES': '🇪🇸', 'PT': '🇵🇹', 'NG': '🇳🇬', 'ID': '🇮🇩',
  'US': '🇺🇸', 'MX': '🇲🇽', 'JP': '🇯🇵', 'MA': '🇲🇦', 'GH': '🇬🇭', 'TR': '🇹🇷',
};

type Props = {
  home: string;
  away: string;
  slug: string;
  match: any;
  predictions: any[];
  communityStats: { home: number; draw: number; away: number; total: number };
};

export default function MatchPageClient({ home, away, slug, match, predictions, communityStats }: Props) {
  const [copied, setCopied] = useState(false);
  const [liveScore, setLiveScore] = useState<{ home: number; away: number } | null>(
    match?.status === 'live' || match?.status === 'locked' || match?.status === 'completed'
      ? { home: match.home_score ?? 0, away: match.away_score ?? 0 }
      : null
  );
  const [liveStatus, setLiveStatus] = useState<string>(match?.status || 'upcoming');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (match?.status !== 'live' && match?.status !== 'locked') return;

    const poll = async () => {
      try {
        const res = await fetch('/api/live-scores', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const live: any[] = data?.live || [];
        const found = live.find((f: any) => {
          if (match?.api_id && f.api_id === match.api_id) return true;
          return (
            f.home?.toLowerCase().includes(home.toLowerCase()) ||
            f.away?.toLowerCase().includes(away.toLowerCase())
          );
        });
        if (found) {
          setLiveScore({ home: found.home_score ?? 0, away: found.away_score ?? 0 });
          setLiveStatus(found.status === 'completed' ? 'completed' : 'live');
          setLastUpdated(
            new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        }
      } catch (_) {}
    };

    const fetchEvents = async () => {
      if (!match?.api_id) return;
      try {
        const res = await fetch(`/api/match-events?fixture=${match.api_id}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setEvents(data?.events || []);
      } catch (_) {}
    };

    poll();
    fetchEvents();
    const interval = setInterval(() => { poll(); fetchEvents(); }, 30_000);
    return () => clearInterval(interval);
  }, [match?.status, match?.api_id, home, away]);

  const getPct = (n: number) =>
    communityStats.total === 0 ? 0 : Math.round((n / communityStats.total) * 100);
  const homePct = getPct(communityStats.home);
  const drawPct = getPct(communityStats.draw);
  const awayPct = getPct(communityStats.away);

  const isCompleted = liveStatus === 'completed';
  const isLive = liveStatus === 'live' || liveStatus === 'locked';
  const isUpcoming = liveStatus === 'upcoming';

  const displayHomeScore = liveScore?.home ?? match?.home_score ?? 0;
  const displayAwayScore = liveScore?.away ?? match?.away_score ?? 0;

  const competition = match?.competition?.replace(' 2026/27', '') || 'Football';

  const shareText = `⚽ ${home} vs ${away} — ${competition}\n\n${communityStats.total > 0 ? `${homePct}% predict ${home} win · ${drawPct}% Draw · ${awayPct}% ${away} win\n\n` : ''}What's your prediction? → flipseer.com/matches/${slug}\n\nFree. No betting. Pure football. #Flipseer`;

  const formatKickoff = (kickoff: string) => {
    if (!kickoff) return '';
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    return new Date(utc).toLocaleString('en-GB', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const getEventIcon = (e: any) => {
    if (e.type === 'Goal') {
      if (e.detail === 'Own Goal') return '⚽🔴';
      if (e.detail === 'Penalty') return '⚽(P)';
      return '⚽';
    }
    if (e.type === 'Card') {
      if (e.detail === 'Red Card') return '🟥';
      if (e.detail === 'Yellow Red Card') return '🟨🟥';
      return '🟨';
    }
    if (e.type === 'subst') return '🔄';
    return '•';
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>
          FLIPSEER · FOOTBALL REPUTATION {match?.competition ? '· ' + competition : ''}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 40px)', margin: 0, textAlign: 'right', flex: 1, minWidth: '120px' }}>{home}</h2>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            {isCompleted ? (
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '10px', padding: '8px 20px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>
                  {displayHomeScore} - {displayAwayScore}
                </span>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px' }}>FULL TIME</div>
              </div>
            ) : isLive ? (
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #EF4444', borderRadius: '10px', padding: '8px 20px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444', fontFamily: 'Georgia, serif' }}>
                  {displayHomeScore} - {displayAwayScore}
                </span>
                <div style={{ fontSize: '10px', color: '#EF4444', marginTop: '4px' }}>● LIVE</div>
                {lastUpdated && (
                  <div style={{ fontSize: '9px', color: '#4B5563', marginTop: '2px' }}>Updated {lastUpdated}</div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '28px', color: '#4B5563', fontWeight: 'bold' }}>vs</div>
            )}
            {match?.kickoff && !isCompleted && !isLive && (
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>{formatKickoff(match.kickoff)}</div>
            )}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 40px)', margin: 0, textAlign: 'left', flex: 1, minWidth: '120px' }}>{away}</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          {isCompleted && <span style={{ backgroundColor: '#1A3A1A', color: '#6B7280', padding: '4px 14px', borderRadius: '999px', fontSize: '12px' }}>Match Completed</span>}
          {isLive && <span style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', border: '1px solid #EF4444' }}>🔴 Live Now</span>}
          {isUpcoming && <span style={{ backgroundColor: 'rgba(46,158,94,0.15)', color: '#2E9E5E', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', border: '1px solid #2E9E5E' }}>🟢 Upcoming</span>}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isUpcoming && (
            <a href="/predict" style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
              ⚽ Predict This Match →
            </a>
          )}
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366', color: 'white', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            📱 Share
          </a>
          <button onClick={() => { navigator.clipboard.writeText('flipseer.com/matches/' + slug); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 20px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
            {copied ? '✅ Copied' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* LIVE EVENTS FEED */}
        {(isLive || isCompleted) && events.length > 0 && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', marginBottom: '16px', margin: '0 0 16px 0' }}>
              ⚡ Match Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {events.map((e: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <span style={{ color: '#6B7280', minWidth: '32px', textAlign: 'right', fontSize: '12px' }}>
                    {e.time?.elapsed}&apos;
                  </span>
                  <span style={{ fontSize: '16px' }}>{getEventIcon(e)}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{e.player?.name}</span>
                    {e.assist?.name && (
                      <span style={{ color: '#6B7280' }}> (assist: {e.assist.name})</span>
                    )}
                    <span style={{ color: '#4B5563', marginLeft: '6px', fontSize: '11px' }}>{e.team?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY PREDICTION */}
        {communityStats.total > 0 ? (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 4px 0' }}>🌍 Community Prediction</h2>
            <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 20px 0' }}>{communityStats.total} Flipseer forecasters have predicted this match</p>
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '12px', marginBottom: '12px' }}>
              {homePct > 0 && <div style={{ width: homePct + '%', backgroundColor: '#2E9E5E', transition: 'width 1s ease' }} />}
              {drawPct > 0 && <div style={{ width: drawPct + '%', backgroundColor: '#6B7280' }} />}
              {awayPct > 0 && <div style={{ width: awayPct + '%', backgroundColor: '#3B82F6' }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '20px' }}>{homePct}%</div>
                <div style={{ color: '#6B7280' }}>{home} Win</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#9CA3AF', fontWeight: 'bold', fontSize: '20px' }}>{drawPct}%</div>
                <div style={{ color: '#6B7280' }}>Draw</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '20px' }}>{awayPct}%</div>
                <div style={{ color: '#6B7280' }}>{away} Win</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <p style={{ color: '#6B7280', fontSize: '15px', margin: '0 0 16px 0' }}>No predictions yet — be the first to call it!</p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              Make Your Prediction →
            </a>
          </div>
        )}

        {/* FORECASTERS */}
        {predictions.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 4px 0' }}>🎯 Forecasters Who Called It</h2>
            <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 16px 0' }}>Predictions locked before kickoff — permanent record</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {predictions.slice(0, 5).map((p: any, i: number) => {
                const outcome = p.predicted_outcome === 'home' ? home + ' Win'
                  : p.predicted_outcome === 'away' ? away + ' Win' : 'Draw';
                const flag = COUNTRY_FLAGS[p.profiles?.country] || '🌍';
                const hasScore = p.predicted_home_score !== null && p.predicted_away_score !== null;
                return (
                  <div key={i} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{flag}</span>
                    <div style={{ flex: 1 }}>
                      <a href={`/u/${p.profiles?.username}?ref=match_page`} style={{ fontSize: '13px', fontWeight: 'bold', color: '#2E9E5E', textDecoration: 'none' }}>
                        @{p.profiles?.username}
                      </a>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        {outcome}{hasScore ? ` · ${p.predicted_home_score}-${p.predicted_away_score}` : ''} · {p.confidence_pct}% confidence
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#4B5563', backgroundColor: '#1A3A1A', padding: '2px 8px', borderRadius: '999px' }}>🔒 Locked</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEO CONTENT */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 12px 0', color: '#2E9E5E' }}>
            {home} vs {away} — {competition}
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', margin: '0 0 10px 0' }}>
            Football fans worldwide are predicting {home} vs {away} on Flipseer before kickoff. Predictions lock permanently — no editing after the whistle.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
            Flipseer is a free football prediction platform. No betting. No gambling. Predict exact scores, set your confidence, and build your permanent football reputation across EPL, Champions League, Liga 1, Ghana Premier League and more.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚽</div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px 0' }}>
            What&apos;s your call for {home} vs {away}?
          </h3>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 16px 0' }}>
            Predict. Lock before kickoff. Build your permanent football record.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            Predict Free →
          </a>
          <p style={{ color: '#4B5563', fontSize: '11px', marginTop: '10px' }}>Free forever · No card · No betting</p>
        </div>

      </div>
    </main>
  );
}
