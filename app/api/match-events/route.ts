import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Simple in-memory cache — events don't change frequently during a match
const cache: { [key: string]: { data: any; ts: number } } = {};
const CACHE_TTL = 60000; // 60 seconds

export async function GET(req: NextRequest) {
  const fixture = req.nextUrl.searchParams.get('fixture');
  if (!fixture) {
    return NextResponse.json({ error: 'fixture param required' }, { status: 400 });
  }

  // Check cache
  const cached = cache[fixture];
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${fixture}`,
      {
        headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ events: [] });
    }

    const data = await res.json();
    const rawEvents = data?.response || [];

    // Filter to last 3 significant events (goals, cards, subs)
    const significant = rawEvents
      .filter((e: any) => ['Goal', 'Card', 'subst'].includes(e.type))
      .slice(-3)
      .reverse(); // Most recent first

    const result = { events: significant };

    // Cache the result
    cache[fixture] = { data: result, ts: Date.now() };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (err) {
    return NextResponse.json({ events: [] });
  }
}
