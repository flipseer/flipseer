export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'forecaster';
  const home = searchParams.get('home') || 'Team A';
  const away = searchParams.get('away') || 'Team B';
  const pick = searchParams.get('pick') || 'Home Win';
  const confidence = searchParams.get('confidence') || '50';
  const pts = searchParams.get('pts') || '';

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0D1F0F"/>
          <stop offset="100%" style="stop-color:#0D2B14"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="6" fill="#2E9E5E"/>
      <text x="600" y="120" font-family="Arial" font-size="48" fill="#2E9E5E" text-anchor="middle" font-weight="bold">⚽ FLIPSEER</text>
      <text x="600" y="220" font-family="Arial" font-size="56" fill="white" text-anchor="middle" font-weight="bold">${home} vs ${away}</text>
      <rect x="350" y="260" width="500" height="80" rx="40" fill="#1A7A4A"/>
      <text x="600" y="312" font-family="Arial" font-size="36" fill="white" text-anchor="middle" font-weight="bold">🎯 ${pick}</text>
      <text x="600" y="400" font-family="Arial" font-size="32" fill="#2E9E5E" text-anchor="middle">${confidence}% Confidence${pts ? ` · +${pts} pts` : ''}</text>
      <text x="600" y="460" font-family="Arial" font-size="24" fill="#9CA3AF" text-anchor="middle">@${username} · World Cup 2026</text>
      <text x="600" y="590" font-family="Arial" font-size="18" fill="#4B5563" text-anchor="middle">flipseer.com · Build your forecasting reputation</text>
      <rect y="624" width="1200" height="6" fill="#2E9E5E"/>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
