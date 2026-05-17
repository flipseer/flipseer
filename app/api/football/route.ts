import { NextResponse } from 'next/server';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'free-api-live-football-data.p.rapidapi.com';

// FIFA World Cup 2026 League ID = 1 (FIFA World Cup)
// Season = 2026
const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'fixtures';

  try {
    if (type === 'fixtures') {
      // Fetch all WC 2026 fixtures
      const response = await fetch(
        `https://${RAPIDAPI_HOST}/football-get-all-fixtures-by-league-id-and-season?leagueid=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY!,
            'x-rapidapi-host': RAPIDAPI_HOST,
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    if (type === 'livescores') {
      // Fetch live scores
      const response = await fetch(
        `https://${RAPIDAPI_HOST}/football-get-livescores`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY!,
            'x-rapidapi-host': RAPIDAPI_HOST,
          },
          next: { revalidate: 60 }, // Cache for 1 minute
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    if (type === 'results') {
      // Fetch recent results
      const response = await fetch(
        `https://${RAPIDAPI_HOST}/football-get-all-fixtures-by-league-id-and-season?leagueid=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY!,
            'x-rapidapi-host': RAPIDAPI_HOST,
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Filter only finished matches
      const finished = data?.response?.filter(
        (f: any) => f.fixture?.status?.short === 'FT'
      );
      return NextResponse.json({ success: true, data: finished });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error: any) {
    console.error('Football API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch football data' },
      { status: 500 }
    );
  }
}
