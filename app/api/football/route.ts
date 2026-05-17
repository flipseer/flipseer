import { NextResponse } from 'next/server';

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_HOST = 'v3.football.api-sports.io';

// FIFA World Cup 2026 League ID = 1
const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'fixtures';

  const headers = {
    'x-rapidapi-key': API_KEY!,
    'x-rapidapi-host': API_HOST,
  };

  try {
    if (type === 'fixtures') {
      const response = await fetch(
        `https://${API_HOST}/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
        { headers, next: { revalidate: 3600 } }
      );
      const data = await response.json();
      return NextResponse.json({ success: true, data: data.response });
    }

    if (type === 'livescores') {
      const response = await fetch(
        `https://${API_HOST}/fixtures?live=all`,
        { headers, next: { revalidate: 60 } }
      );
      const data = await response.json();
      return NextResponse.json({ success: true, data: data.response });
    }

    if (type === 'results') {
      const response = await fetch(
        `https://${API_HOST}/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&status=FT`,
        { headers, next: { revalidate: 300 } }
      );
      const data = await response.json();
      return NextResponse.json({ success: true, data: data.response });
    }

    if (type === 'upcoming') {
      const response = await fetch(
        `https://${API_HOST}/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&status=NS&next=10`,
        { headers, next: { revalidate: 3600 } }
      );
      const data = await response.json();
      return NextResponse.json({ success: true, data: data.response });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch' },
      { status: 500 }
    );
  }
}
