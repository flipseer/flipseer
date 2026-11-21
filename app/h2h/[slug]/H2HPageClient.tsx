'use client';
import { useState } from 'react';

type H2HMatch = {
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  kickoff: string | null;
  competition: string | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
  slug: string | null;
};

type Props = {
  teamA: string;
  teamB: string;
  teamALogo: string | null;
  teamBLogo: string | null;
  h2hMatches: H2HMatch[];
  upcomingMatch: { slug: string; home_team: string; away_team: string; kickoff: string | null; competition: string | null; home_team_logo: string | null; away_team_logo: string | null } | null;
  slug: string;
};

function TeamLogo({ logo, name, size = 48 }: { logo: string | null; name: string; size?: number }) {
  if (!logo) return <span style={{ fontSize: size > 30 ? '32px' : '18px' }}>⚽</span>;
  return (
    <img
      src={logo}
      alt={name}
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

export default function H2HPageClient({ teamA, teamB, teamALogo, teamBLogo, h2hMatches, upcomingMatch, slug }: Props) {
  const [copied, setCopied] = useState(false);

  // Compute W/D/L from teamA's perspective
  let aWins = 0, draws = 0, bWins = 0;
  let aGoals = 0, bGoals = 0;

  h2hMatches.forEach(m => {
    if (m.home_score === null || m.away_score === null) return;
    const aIsHome = m.home_team.toLowerCase() === teamA.toLowerCase();
    const aG = aIsHome ? m.home_score : m.away_score;
    const bG = aIsHome ? m.away_score : m.home_score;
    aGoals += aG;
    bGoals += bG;
    if (aG > bG) aWins++;
    else if (aG < bG) bWins++;
    else draws++;
  });

  const total = aWins + draws + bWins;
  const aWinPct = total > 0 ? Math.round((aWins / total) * 100) : 0;
  const drawPct = total > 0 ? Math.round((draws / total) * 100) : 0;
  const bWinPct = total > 0 ? Math.round((bWins / total) * 100) : 0;

  const formatDate = (kickoff: string | null) => {
    if (!kickoff) return '';
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    return new Date(utc).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const formatKickoff = (kickoff: string | null) => {
    if (!kickoff) return '';
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    return new Date(utc).toLocaleString('en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const shareText = `⚽ ${teamA} vs ${teamB} — Head to Head\n\n${total > 0 ? `Last ${total} meetings: ${teamA} ${aWins}W · ${draws}D · ${bWins}W ${teamB}\n\n` : ''}Full H2H record → flipseer.com/h2h/${slug}\n\n#Flipseer #Football`;

  const pageUrl = `https://flipseer.com/h2h/${slug}`;

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>
          FLIPSEER · HEAD TO HEAD
        </p>

        {/* Teams */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
          {/* Team A */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TeamLogo logo={teamALogo} name={teamA} size={56} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 3.5vw, 28px)', margin: 0, textAlign: 'right' }}>{teamA}</h2>
          </div>

          {/* VS badge */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#1A3A1A', border: '1px solid #2E9E5E', borderRadius: '10px', padding: '10px 16px' }}>
              <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>H2H</div>
              <div style={{ fontSize: '20px', color: '#6B7280', fontWeight: 'bold', marginTop: '2px' }}>vs</div>
            </div>
          </div>

          {/* Team B */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', minWidth: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <TeamLogo logo={teamBLogo} name={teamB} size={56} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 3.5vw, 28px)', margin: 0, textAlign: 'left' }}>{teamB}</h2>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            📱 Share H2H
          </a>
          <button onClick={() => { navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
            {copied ? '✅ Copied' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* UPCOMING MATCH BANNER */}
        {upcomingMatch && (
          <a
            href={`/matches/${upcomingMatch.slug}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '14px',
              padding: '16px 20px', marginBottom: '24px', textDecoration: 'none', gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>NEXT MEETING</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>
                {upcomingMatch.home_team} vs {upcomingMatch.away_team}
              </div>
              <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>
                {upcomingMatch.competition?.replace(' 2026/27', '')} · {formatKickoff(upcomingMatch.kickoff)}
              </div>
            </div>
            <span style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Predict →
            </span>
          </a>
        )}

        {/* W/D/L SUMMARY */}
        {total > 0 ? (
          <>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 20px 0' }}>📊 All-Time Record ({total} matches)</h2>

              {/* Win bar */}
              <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '14px', marginBottom: '12px' }}>
                {aWinPct > 0 && <div style={{ width: aWinPct + '%', backgroundColor: '#2E9E5E', transition: 'width 1s ease' }} />}
                {drawPct > 0 && <div style={{ width: drawPct + '%', backgroundColor: '#6B7280' }} />}
                {bWinPct > 0 && <div style={{ width: bWinPct + '%', backgroundColor: '#3B82F6' }} />}
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{aWins}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{teamA.split(' ')[0]} Wins</div>
                  <div style={{ fontSize: '11px', color: '#4B5563' }}>{aWinPct}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#9CA3AF', fontFamily: 'Georgia, serif' }}>{draws}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Draws</div>
                  <div style={{ fontSize: '11px', color: '#4B5563' }}>{drawPct}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3B82F6', fontFamily: 'Georgia, serif' }}>{bWins}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{teamB.split(' ')[0]} Wins</div>
                  <div style={{ fontSize: '11px', color: '#4B5563' }}>{bWinPct}%</div>
                </div>
              </div>

              {/* Goals row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0D1F0F', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', fontFamily: 'Georgia, serif' }}>{aGoals}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Goals scored</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px' }}>⚽ Goals</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', fontFamily: 'Georgia, serif' }}>{bGoals}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Goals scored</div>
                </div>
              </div>
            </div>

            {/* MATCH HISTORY */}
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 16px 0' }}>🗓 Match History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {h2hMatches.map((m, i) => {
                  const aIsHome = m.home_team.toLowerCase() === teamA.toLowerCase();
                  const aG = aIsHome ? (m.home_score ?? 0) : (m.away_score ?? 0);
                  const bG = aIsHome ? (m.away_score ?? 0) : (m.home_score ?? 0);
                  const result = aG > bG ? 'W' : aG < bG ? 'L' : 'D';
                  const resultColor = result === 'W' ? '#2E9E5E' : result === 'L' ? '#EF4444' : '#9CA3AF';
                  const comp = m.competition?.replace(' 2026/27', '') || '';

                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0',
                      borderBottom: i < h2hMatches.length - 1 ? '1px solid #1A3A1A' : 'none',
                      fontSize: '13px',
                    }}>
                      {/* Result badge */}
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: result === 'W' ? 'rgba(46,158,94,0.2)' : result === 'L' ? 'rgba(239,68,68,0.2)' : 'rgba(156,163,175,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 'bold', color: resultColor,
                      }}>
                        {result}
                      </div>

                      {/* Home logo + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
                        {m.home_team_logo && (
                          <img src={m.home_team_logo} alt={m.home_team} width={16} height={16} style={{ objectFit: 'contain', flexShrink: 0 }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                        <span style={{ color: '#D1D5DB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.home_team}</span>
                      </div>

                      {/* Score */}
                      <span style={{ fontWeight: 'bold', fontFamily: 'Georgia, serif', fontSize: '14px', flexShrink: 0, color: 'white' }}>
                        {m.home_score} - {m.away_score}
                      </span>

                      {/* Away logo + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
                        <span style={{ color: '#D1D5DB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{m.away_team}</span>
                        {m.away_team_logo && (
                          <img src={m.away_team_logo} alt={m.away_team} width={16} height={16} style={{ objectFit: 'contain', flexShrink: 0 }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                      </div>

                      {/* Date + comp */}
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '56px' }}>
                        <div style={{ fontSize: '11px', color: '#4B5563' }}>{formatDate(m.kickoff)}</div>
                        {comp && <div style={{ fontSize: '10px', color: '#374151' }}>{comp}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <p style={{ color: '#6B7280', fontSize: '15px', margin: '0 0 8px 0' }}>No completed matches found between these teams.</p>
            <p style={{ color: '#4B5563', fontSize: '13px', margin: 0 }}>This H2H record will update as matches are completed.</p>
          </div>
        )}

        {/* SEO CONTENT */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', margin: '0 0 12px 0', color: '#2E9E5E' }}>
            {teamA} vs {teamB} — Head to Head
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', margin: '0 0 10px 0' }}>
            {total > 0
              ? `In ${total} all-time meetings, ${teamA} have won ${aWins} times, ${teamB} have won ${bWins} times, with ${draws} draws. ${teamA} have scored ${aGoals} goals, ${teamB} have scored ${bGoals} goals.`
              : `${teamA} vs ${teamB} head to head record. Track all results, scores and predictions on Flipseer.`
            }
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
            Flipseer is a free football prediction platform. Predict match outcomes before kickoff, lock your call permanently, and build your football reputation. No betting. No gambling.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚽</div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px 0' }}>
            Predict the next {teamA} vs {teamB}
          </h3>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 16px 0' }}>
            Lock your call before kickoff. Build your permanent football record.
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
