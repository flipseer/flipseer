import { createClient } from '@supabase/supabase-js';
import JournalClient from './JournalClient';
import { Metadata } from 'next';

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `@${params.username} Forecast Journal | Flipseer`,
    description: `${params.username}'s permanent football prediction record on Flipseer. World Cup 2026 predictions, accuracy stats and reputation.`,
    alternates: { canonical: `https://flipseer.com/u/${params.username}` },
    openGraph: {
      title: `@${params.username}'s Football Forecast Journal | Flipseer`,
      description: `Permanent football prediction record. Every call locked before kickoff. No edits. No deletions. Forever.`,
      url: `https://flipseer.com/u/${params.username}`,
    },
  };
}

export default async function JournalPage({ params }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Forecaster not found</h1>
          <a href="/leaderboard" style={{ color: '#2E9E5E' }}>View all forecasters →</a>
        </div>
      </main>
    );
  }

  // Fetch predictions
  const { data: rawPreds } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(200);

  // Fetch match data
  const matchIds = Array.from(new Set((rawPreds || []).map((p: any) => p.match_id).filter(Boolean)));
  let matchMap: Record<string, any> = {};
  if (matchIds.length > 0) {
    const { data: matchData } = await supabase
      .from('matches')
      .select('id, home_team, away_team, kickoff, status, home_score, away_score, competition')
      .in('id', matchIds);
    (matchData || []).forEach((m: any) => { matchMap[m.id] = m; });
  }

  const predictions = (rawPreds || []).map((p: any) => ({
    ...p,
    matches: matchMap[p.match_id] || null,
  }));

  return (
    <JournalClient
      username={params.username}
      profile={profile}
      predictions={predictions}
    />
  );
}
