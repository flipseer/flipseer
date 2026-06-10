'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const COUNTRY_FLAGS: { [key: string]: string } = {
  'IN': '&#x1F1EE;&#x1F1F3;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'FR': '&#x1F1EB;&#x1F1F7;',
  'DE': '&#x1F1E9;&#x1F1EA;', 'GB': '&#x1F3F4;',
  'ES': '&#x1F1EA;&#x1F1F8;', 'PT': '&#x1F1F5;&#x1F1F9;',
  'NL': '&#x1F1F3;&#x1F1F1;', 'IT': '&#x1F1EE;&#x1F1F9;',
  'MX': '&#x1F1F2;&#x1F1FD;', 'US': '&#x1F1FA;&#x1F1F8;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'SN': '&#x1F1F8;&#x1F1F3;',
  'MA': '&#x1F1F2;&#x1F1E6;', 'JP': '&#x1F1EF;&#x1F1F5;',
  'ID': '&#x1F1EE;&#x1F1E9;', 'ZA': '&#x1F1FF;&#x1F1E6;',
  'TR': '&#x1F1F9;&#x1F1F7;', 'SA': '&#x1F1F8;&#x1F1E6;',
  'KR': '&#x1F1F0;&#x1F1F7;', 'CO': '&#x1F1E8;&#x1F1F4;',
  'OTHER': '&#x1F30D;',
};

const COUNTRY_NAMES: { [key: string]: string } = {
  'IN': 'India', 'BR': 'Brazil', 'AR': 'Argentina',
  'FR': 'France', 'DE': 'Germany', 'GB': 'England',
  'ES': 'Spain', 'PT': 'Portugal', 'NL': 'Netherlands',
  'IT': 'Italy', 'MX': 'Mexico', 'US': 'USA',
  'NG': 'Nigeria', 'SN': 'Senegal', 'MA': 'Morocco',
  'JP': 'Japan', 'ID': 'Indonesia', 'ZA': 'South Africa',
  'TR': 'Turkey', 'SA': 'Saudi Arabia', 'KR': 'South Korea',
  'CO': 'Colombia', 'OTHER': 'Other',
};

const MEDALS = ['&#x1F947;', '&#x1F948;', '&#x1F949;'];

export default function NationsPage() {
  const [nations, setNations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [totalPredictions, setTotalPredictions] = useState(0);

  useEffect(() => {
    const load = async () => {
      // Get user country
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('country')
          .eq('id', session.user.id)
          .single();
        if (profile?.country) setUserCountry(profile.country);
      }

      await fetchNations();
    };
    load();
  }, []);

  const fetchNations = async () => {
    setLoading(true);
    try {
      // Get all profiles with country + points
      const { data: profiles } = await supabase
        .from('profiles')
        .select('country, total_points, accuracy_pct, prediction_count')
        .not('country', 'is', null)
        .gt('prediction_count', 0);

      if (!profiles) { setLoading(false); return; }

      // Get total predictions count
      const { count } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });
      setTotalPredictions(count || 0);

      // Group by country
      const countryMap: { [key: string]: { points: number; forecasters: number; predictions: number; accuracy: number } } = {};
      profiles.forEach((p: any) => {
        const c = p.country || 'OTHER';
        if (!countryMap[c]) countryMap[c] = { points: 0, forecasters: 0, predictions: 0, accuracy: 0 };
        countryMap[c].points += p.total_points || 0;
        countryMap[c].forecasters += 1;
        countryMap[c].predictions += p.prediction_count || 0;
        countryMap[c].accuracy += p.accuracy_pct || 0;
      });

      // Sort by points
      const sorted = Object.entries(countryMap)
        .map(([code, stats]) => ({
          code,
          name: COUNTRY_NAMES[code] || code,
          flag: COUNTRY_FLAGS[code] || '&#x1F30D;',
          points: stats.points,
          forecasters: stats.forecasters,
          predictions: stats.predictions,
          accuracy: stats.forecasters > 0 ? Math.round(stats.accuracy / stats.forecasters) : 0,
        }))
        .sort((a, b) => b.points - a.points);

      setNations(sorted);
      setLastUpdated(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const maxPoints = nations[0]?.points || 1;
  const userNation = nations.find(n => n.code === userCountry);
  const userRank = userNation ? nations.indexOf(userNation) + 1 : null;

  const shareText = userNation
    ? '&#x1F30D; ' + userNation.name + ' is ranked #' + userRank + ' on Flipseer World Cup 2026 leaderboard with ' + userNation.points + ' pts! Join the battle -> flipseer.com/nations #WorldCup2026 #Flipseer'
    : '&#x1F30D; The World Cup 2026 Nation Battle is live on Flipseer! Which country leads? flipseer.com/nations #WorldCup2026';

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '40px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: '12px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '8px' }}>WORLD CUP 2026</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>
          &#x1F30D; Nation Battle
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
          Every prediction earns points for your country. Which nation leads?
        </p>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            { label: 'Nations', value: nations.length },
            { label: 'Forecasters', value: nations.reduce((a, n) => a + n.forecasters, 0) },
            { label: 'Predictions', value: totalPredictions },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Live indicator */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A', borderRadius: '999px', padding: '4px 14px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold' }}>LIVE -- Updated {lastUpdated}</span>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px 0' }}>

        {/* YOUR NATION CARD */}
        {userNation && (
          <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '16px', padding: '20px', marginBottom: '24px', animation: 'slideIn 0.5s ease forwards' }}>
            <p style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>YOUR NATION</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }} dangerouslySetInnerHTML={{ __html: userNation.flag }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>{userNation.name}</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  {userNation.forecasters} forecaster{userNation.forecasters !== 1 ? 's' : ''} --  {userNation.predictions} predictions
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Rank</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#F59E0B', fontFamily: 'Georgia, serif' }}>#{userRank}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Points</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{userNation.points}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>
                <span>Points vs leader</span>
                <span>{Math.round((userNation.points / maxPoints) * 100)}%</span>
              </div>
              <div style={{ backgroundColor: '#1A3A1A', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: Math.round((userNation.points / maxPoints) * 100) + '%', backgroundColor: '#2E9E5E', height: '100%', borderRadius: '999px', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* Share + Predict CTAs */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, backgroundColor: '#25D366', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                &#x1F4F1; Share Nation Rank
              </a>
              <a href="/predict"
                style={{ flex: 1, backgroundColor: '#1A7A4A', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                &#x26BD; Predict to Earn More
              </a>
            </div>
          </div>
        )}

        {/* NO COUNTRY SET */}
        {!userNation && !loading && (
          <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '24px' }}>&#x1F30D;</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '14px' }}>Set your country to join the battle!</div>
              <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Earn points for your nation with every prediction</div>
            </div>
            <a href="/profile#country-selector" style={{ backgroundColor: '#F59E0B', color: 'black', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
              Set Country &#x2192;
            </a>
          </div>
        )}

        {/* LEADERBOARD */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ backgroundColor: '#050E05', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
            <span>RANK -- NATION</span>
            <span>FORECASTERS -- PREDICTIONS -- POINTS</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#x1F30D;</div>
              <p>Loading nation battle...</p>
            </div>
          ) : nations.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#x1F30D;</div>
              <p>No nations yet. Be the first!</p>
              <a href="/profile" style={{ color: '#2E9E5E', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>Set your country &#x2192;</a>
            </div>
          ) : (
            nations.map((nation, i) => {
              const isUser = nation.code === userCountry;
              const medal = i < 3 ? MEDALS[i] : null;
              const barWidth = Math.round((nation.points / maxPoints) * 100);

              return (
                <div key={nation.code} style={{ borderTop: i === 0 ? 'none' : '1px solid #1A3A1A', padding: '16px 20px', backgroundColor: isUser ? 'rgba(46,158,94,0.08)' : 'transparent', animation: 'slideIn 0.4s ease ' + (i * 0.05) + 's forwards' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {/* Rank */}
                    <div style={{ minWidth: '32px', textAlign: 'center' }}>
                      {medal ? (
                        <span style={{ fontSize: '20px' }} dangerouslySetInnerHTML={{ __html: medal }} />
                      ) : (
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 'bold' }}>#{i + 1}</span>
                      )}
                    </div>

                    {/* Flag */}
                    <span style={{ fontSize: '24px' }} dangerouslySetInnerHTML={{ __html: nation.flag }} />

                    {/* Name + YOU badge */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {nation.name}
                        {isUser && (
                          <span style={{ fontSize: '10px', color: '#2E9E5E', backgroundColor: 'rgba(46,158,94,0.2)', padding: '1px 8px', borderRadius: '999px', fontWeight: 'bold' }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        {nation.forecasters} forecaster{nation.forecasters !== 1 ? 's' : ''} -- {nation.predictions} predictions -- {nation.accuracy}% avg accuracy
                      </div>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: i === 0 ? '#F59E0B' : '#2E9E5E', fontFamily: 'Georgia, serif' }}>{nation.points}</div>
                      <div style={{ fontSize: '10px', color: '#4B5563' }}>pts</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginLeft: '44px' }}>
                    <div style={{ backgroundColor: '#1A3A1A', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                      <div style={{ width: barWidth + '%', backgroundColor: i === 0 ? '#F59E0B' : isUser ? '#2E9E5E' : '#1A7A4A', height: '100%', borderRadius: '999px' }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM CTA */}
        {!loading && nations.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '24px', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#x26BD;</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', marginBottom: '8px' }}>
              Every prediction moves your nation up
            </h3>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
              Predict matches to earn points for your country
            </p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
              Predict Now &#x2192;
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
