import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'forecaster';
  const home = searchParams.get('home') || 'Team A';
  const away = searchParams.get('away') || 'Team B';
  const pick = searchParams.get('pick') || 'Home Win';
  const confidence = searchParams.get('confidence') || '50';
  const pts = searchParams.get('pts') || '';

  return new ImageResponse(
    (
      <div style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D1F0F 0%, #0D2B14 60%, #1A7A4A 100%)',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #2E9E5E, #1A7A4A)',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <div style={{ fontSize: '48px' }}>⚽</div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#2E9E5E',
            letterSpacing: '4px',
          }}>FLIPSEER</div>
        </div>

        {/* Match */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '52px', fontWeight: 'bold', color: 'white' }}>{home}</div>
          <div style={{
            fontSize: '24px',
            color: '#6B7280',
            padding: '8px 16px',
            border: '1px solid #1A7A4A',
            borderRadius: '8px',
          }}>vs</div>
          <div style={{ fontSize: '52px', fontWeight: 'bold', color: 'white' }}>{away}</div>
        </div>

        {/* Pick badge */}
        <div style={{
          backgroundColor: '#1A7A4A',
          padding: '16px 48px',
          borderRadius: '999px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: '28px' }}>🎯</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{pick}</div>
        </div>

        {/* Confidence + points */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            backgroundColor: 'rgba(46,158,94,0.2)',
            border: '1px solid #2E9E5E',
            borderRadius: '12px',
            padding: '12px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E' }}>{confidence}%</div>
            <div style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '2px' }}>CONFIDENCE</div>
          </div>
          {pts && (
            <div style={{
              backgroundColor: 'rgba(46,158,94,0.2)',
              border: '1px solid #2E9E5E',
              borderRadius: '12px',
              padding: '12px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E' }}>+{pts}</div>
              <div style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '2px' }}>POINTS</div>
            </div>
          )}
        </div>

        {/* Username */}
        <div style={{ fontSize: '22px', color: '#9CA3AF' }}>
          @{username} · World Cup 2026
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          fontSize: '16px',
          color: '#4B5563',
        }}>
          flipseer.com · Build your forecasting reputation
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #1A7A4A, #2E9E5E)',
        }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
