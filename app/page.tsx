'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function ResultsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: completedMatches } = await supabase
        .from('matches')
        .select('id, home_team, away_team, home_score, away_score, kickoff, league, is_upset, winner, status')
        .eq('status', 'completed')
        .order('kickoff', { ascending: false });

      const { count: totalCount } = await supabase
        .from('matches').select('*', { count: 'exact', head: true });
      const { count: completedCount } = await supabase
        .from('matches').select('*', { count: 'exact', head: true }).eq('status', 'completed');
      const { count: upcomingCount } = await supabase
        .from('matches').select('*', { count: 'exact', head: true }).eq('status', 'upcoming');

      setMatches(completedMatches || []);
      setStats({ total: totalCount || 0, completed: completedCount || 0, upcoming: upcomingCount || 0 });
      setLoading(false);
    };
    load();
  }, []);


  const formatDate = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    return new Date(utc).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };


  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26BD;</div>
        <p style={{ color: '#2E9E5E', fontSize: '18px' }}>Loading match history...</p>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '40px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '8px' }}>WORLD CUP 2026</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>&#x1F4CA; Match History</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Results, scores and top predictors</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Matches', value: stats.total, color: '#9CA3AF' },
            { label: 'Completed', value: stats.completed, color: '#2E9E5E' },
            { label: 'Upcoming', value: stats.upcoming, color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color, fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px 0' }}>


                {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#0D2B14', borderRadius: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26BD;</div>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#2E9E5E', marginBottom: '8px' }}>No results yet</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Match results will appear here after kick-off</p>
            <a href="/predict" style={{ backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              Predict Upcoming Matches &#x2192;
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div key={match.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>{match.league} &middot; {formatDate(match.kickoff)}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {match.is_upset && (
                      <span style={{ fontSize: '10px', backgroundColor: 'rgba(139,92,246,0.2)', color: '#8B5CF6', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>UPSET</span>
                    )}
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(46,158,94,0.2)', color: '#2E9E5E', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>FT</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 'bold', color: match.winner === 'home' ? 'white' : '#6B7280', flex: 1 }}>{match.home_team}</span>
                  <div style={{ textAlign: 'center', backgroundColor: '#0D1F0F', border: '1px solid #1A3A1A', borderRadius: '8px', padding: '8px 16px', margin: '0 12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{match.home_score} - {match.away_score}</span>
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: 'bold', color: match.winner === 'away' ? 'white' : '#6B7280', flex: 1, textAlign: 'right' }}>{match.away_team}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href="/predict" style={{ flex: 1, padding: '10px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                    &#x26BD; Predict Next Match &#x2192;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
