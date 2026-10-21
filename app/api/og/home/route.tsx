import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') || '';

  let home = '', away = '', competition = '', status = '', homeScore = null, awayScore = null;

  if (slug) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data } = await supabase
        .from('matches')
        .select('home_team, away_team, competition, status, home_score, away_score')
        .eq('slug', slug)
        .limit(1)
        .single();

      if (data) {
        home = data.home_team || '';
        away = data.away_team || '';
        competition = (data.competition || '').replace(' 2026/27', '');
        status = data.status || '';
        homeScore = data.home_score;
        awayScore = data.away_score;
      }
    } catch (_) {}
  }

  const isCompleted = status === 'completed';
  const isLive = status === 'live' || status === 'locked';
  const hasScore = homeScore !== null && awayScore !== null;

  const statusLabel = isCompleted ? 'FULL TIME' : isLive ? '● LIVE' : 'UPCOMING';
  const statusColor = isLive ? '#EF4444' : isCompleted ? '#6B7280' : '#2E9E5E';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0D1F0F',
          color: 'white',
          fontFamily: 'serif',
          padding: '60px',
        }}
      >
        {/* Top label */}
        <div style={{ display: 'flex', fontSize: '22px', color: '#2E9E5E', letterSpacing: '4px', marginBottom: '40px', fontFamily: 'sans-serif' }}>
          FLIPSEER · FOOTBALL REPUTATION {competition ? `· ${competition.toUpperCase()}` : ''}
        </div>

        {/* Teams + score row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', width: '100%' }}>
          {/* Home team */}
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '64px', fontWeight: 'bold', textAlign: 'right' }}>{home || 'Home'}</span>
          </div>

          {/* Score / vs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            {(isCompleted || isLive) && hasScore ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#0D2B14',
                  border: `2px solid ${statusColor}`,
                  borderRadius: '16px',
                  padding: '16px 32px',
                }}
              >
                <span style={{ display: 'flex', fontSize: '72px', fontWeight: 'bold', color: statusColor, lineHeight: 1 }}>
                  {homeScore} – {awayScore}
                </span>
                <span style={{ display: 'flex', fontSize: '20px', color: statusColor, marginTop: '8px', fontFamily: 'sans-serif', letterSpacing: '2px' }}>
                  {statusLabel}
                </span>
              </div>
            ) : (
              <span style={{ display: 'flex', fontSize: '56px', color: '#4B5563' }}>vs</span>
            )}
          </div>

          {/* Away team */}
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
            <span style={{ fontSize: '64px', fontWeight: 'bold', textAlign: 'left' }}>{away || 'Away'}</span>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ display: 'flex', marginTop: '48px', fontSize: '26px', color: '#6B7280', fontFamily: 'sans-serif' }}>
          Predict · Build Reputation · flipseer.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
