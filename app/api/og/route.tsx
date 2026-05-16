import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'forecaster';
  const home = searchParams.get('home') || 'Team A';
  const away = searchParams.get('away') || 'Team B';
  const pick = searchParams.get('pick') || 'Home Win';
  const confidence = searchParams.get('confidence') || '50';

  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #0D1F0F 0%, #0D2B14 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        border: '4px solid #2E9E5E',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginRight: '12px' }}>⚽</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E9E5E', letterSpacing: '3px' }}>FLIPSEER</div>
        </div>

        {/* Match */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{home}</div>
          <div style={{ fontSize: '28px', color: '#6B7280' }}>vs</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{away}</div>
        </div>

        {/* Pick */}
        <div style={{ backgroundColor: '#1A7A4A', padding: '16px 40px', borderRadius: '999px', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>🎯 {pick}</div>
        </div>

        {/* Confidence */}
        <div style={{ fontSize: '24px', color: '#2E9E5E', marginBottom: '24px' }}>
          {confidence}% Confidence
        </div>

        {/* Username */}
        <div style={{ fontSize: '20px', color: '#9CA3AF' }}>
          @{username} · World Cup 2026
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '24px', fontSize: '16px', color: '#4B5563' }}>
          flipseer.com · Build your forecasting reputation
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
