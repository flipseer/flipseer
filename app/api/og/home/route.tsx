import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1200px',
        height: '630px',
        backgroundColor: '#0D1F0F',
        color: 'white',
      }}>
        <div style={{ display: 'flex', fontSize: '100px' }}>⚽</div>
        <div style={{ display: 'flex', fontSize: '80px', fontWeight: 'bold', color: '#2E9E5E' }}>FLIPSEER</div>
        <div style={{ display: 'flex', fontSize: '36px', marginTop: '20px' }}>Predict · Earn Reputation · Build Legacy</div>
        <div style={{ display: 'flex', fontSize: '28px', marginTop: '16px', color: '#9CA3AF' }}>World Cup 2026 · flipseer.com</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
