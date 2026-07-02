'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

type Props = {
  country: { name: string; code: string; flag: string; adjective: string; rivals: string[]; slug: string };
  slug: string;
  profiles: any[];
  nationRank: number;
  nationPoints: number;
  nationPredictions: number;
  avgAccuracy: number;
  forecasterCount: number;
  rivalData: any[];
  recentPredictions: any[];
};

const MEDAL = ['🥇', '🥈', '🥉'];

const RELATED_NATIONS = [
  { slug: 'india', name: 'India', flag: '🇮🇳' },
  { slug: 'indonesia', name: 'Indonesia', flag: '🇮🇩' },
  { slug: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
  { slug: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  { slug: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  { slug: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { slug: 'france', name: 'France', flag: '🇫🇷' },
  { slug: 'germany', name: 'Germany', flag: '🇩🇪' },
  { slug: 'ghana', name: 'Ghana', flag: '🇬🇭' },
  { slug: 'morocco', name: 'Morocco', flag: '🇲🇦' },
];

export default function NationPageClientV2({
  country, slug, profiles, nationRank, nationPoints,
  nationPredictions, avgAccuracy, forecasterCount,
  rivalData, recentPredictions,
}: Props) {
  const [liveActivity, setLiveActivity] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [todayDelta, setTodayDelta] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch today's delta for this nation
    fetch('/api/nation-deltas')
      .then(r => r.json())
      .then(data => {
        const entry = (data.deltas || []).find((d: any) => d.code === country.code);
        if (entry) setTodayDelta(entry.todayDelta);
      })
      .catch(() => {});

    // Fetch live activity for this nation
    const fetchActivity = async () => {
      try {
        const { data } = await supabase
          .from('predictions')
          .select('predicted_outcome, confidence_pct, points_earned, prediction_processed, created_at, profiles(username, country), matches(home_team, away_team)')
          .order('created_at', { ascending: false })
          .limit(20);
        const filtered = (data || [])
          .filter((p: any) => p.profiles?.country === country.code && p.profiles?.username)
          .slice(0, 5);
        setLiveActivity(filtered);
      } catch {}
    };
    fetchActivity();
    const iv = setInterval(fetchActivity, 60000);
    return () => clearInterval(iv);
  }, [country.code]);

  const timeAgo = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const rankTrend = nationRank <= 3 ? '↑' : nationRank <= 6 ? '→' : '↑';
  const trendColor = nationRank <= 3 ? '#2E9E5E' : nationRank <= 6 ? '#F59E0B' : '#9CA3AF';

  return (
    <main style={{
      backgroundColor: '#0D1F0F', minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white', paddingBottom: 80,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .stat-card:hover{border-color:#2E9E5E!important;transform:translateY(-2px)}
        .stat-card{transition:all 0.15s ease}
        .profile-row:hover{background:rgba(46,158,94,0.08)!important;cursor:pointer}
        .profile-row{transition:background 0.1s}
        .nation-link:hover{border-color:#2E9E5E!important;color:white!important}
        .nation-link{transition:all 0.15s}
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(180deg, #071408 0%, #0D1F0F 100%)',
        padding: 'clamp(40px,8vw,72px) 20px clamp(32px,6vw,56px)',
        borderBottom: '1px solid #1A3A1A',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '100%',
          background: 'radial-gradient(ellipse,rgba(46,158,94,0.08) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          backgroundColor: 'rgba(46,158,94,0.1)', border: '1px solid #1A7A4A',
          borderRadius: 999, padding: '5px 16px', marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
          <span style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px' }}>
            NATION BATTLE · WORLD CUP 2026
          </span>
        </div>

        {/* Flag + headline */}
        <div style={{ fontSize: 'clamp(56px,14vw,96px)', marginBottom: 12, lineHeight: 1 }}>
          {country.flag}
        </div>
        <h1 style={{
          fontSize: 'clamp(28px,7vw,56px)',
          fontWeight: 900, letterSpacing: '-1.5px',
          lineHeight: 1.05, marginBottom: 12,
        }}>
          Represent <span style={{ color: '#2E9E5E' }}>{country.name}</span><br/>
          in the Global Football<br/>Reputation Network
        </h1>
        <p style={{
          fontSize: 'clamp(14px,2.5vw,17px)',
          color: '#9CA3AF', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 28px',
        }}>
          Every correct prediction earns points for {country.name} in the Nation Battle.
          Your football reputation grows across every competition — permanently.
        </p>

        {/* Rank display */}
        {nationRank > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            backgroundColor: '#0D2B14', border: '1px solid #1A7A4A',
            borderRadius: 14, padding: '16px 28px', marginBottom: 28,
            animation: 'fadeUp 0.4s ease both',
          }}>
            <div>
              <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', fontWeight: 700, marginBottom: 2 }}>
                GLOBAL RANK
              </div>
              <div style={{
                fontSize: 'clamp(40px,10vw,72px)', fontWeight: 900,
                color: '#F59E0B', lineHeight: 0.9, letterSpacing: '-2px',
              }}>
                #{nationRank}
              </div>
            </div>
            <div style={{ width: 1, height: 48, backgroundColor: '#1A3A1A' }}/>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: trendColor, fontWeight: 700 }}>
                {rankTrend} {nationRank <= 3 ? 'Top 3' : nationRank <= 6 ? 'Top 6' : 'Rising'}
              </div>
              <div style={{ fontSize: 12, color: '#8895A3' }}>{nationPoints.toLocaleString()} pts total</div>
              {todayDelta !== null && todayDelta > 0 && (
                <div style={{
                  fontSize: 12, color: '#2E9E5E', fontWeight: 700, marginTop: 4,
                  backgroundColor: 'rgba(46,158,94,0.1)',
                  padding: '2px 8px', borderRadius: 999, display: 'inline-block',
                }}>
                  +{todayDelta} today ↑
                </div>
              )}
              {todayDelta === 0 && (
                <div style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>No new points today</div>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/auth?nation=${country.code}&utm_source=${slug}&utm_medium=nation_page`}
            style={{
              backgroundColor: '#2E9E5E', color: 'white',
              padding: 'clamp(13px,3vw,16px) clamp(24px,5vw,40px)',
              borderRadius: 10, textDecoration: 'none',
              fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700,
              boxShadow: '0 0 32px rgba(46,158,94,0.35)',
            }}>
            Predict for {country.name} →
          </a>
          <a href="/nations"
            style={{
              backgroundColor: 'transparent', color: '#9CA3AF',
              padding: 'clamp(13px,3vw,16px) clamp(20px,4vw,28px)',
              borderRadius: 10, textDecoration: 'none',
              fontSize: 'clamp(14px,2.5vw,16px)',
              border: '1px solid #1A3A1A',
            }}>
            All Nations →
          </a>
        </div>
      </div>

      {/* ── NATION STATISTICS ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 20 }}>
            {country.name.toUpperCase()} STATISTICS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
            {[
              { label: 'Global Rank', value: nationRank > 0 ? `#${nationRank}` : '—', color: '#F59E0B', icon: '🏆' },
              { label: 'Forecasters', value: forecasterCount.toString(), color: '#2E9E5E', icon: '👥' },
              { label: 'Total Predictions', value: nationPredictions.toLocaleString(), color: '#9CA3AF', icon: '🎯' },
              { label: 'Avg Accuracy', value: avgAccuracy > 0 ? `${avgAccuracy}%` : '—', color: '#2E9E5E', icon: '📊' },
              { label: 'Total Points', value: nationPoints.toLocaleString(), color: '#F59E0B', icon: '⚡' },
              { label: 'Today', value: todayDelta !== null ? (todayDelta > 0 ? '+' + todayDelta + ' pts' : todayDelta === 0 ? '—' : todayDelta + ' pts') : '—', color: todayDelta && todayDelta > 0 ? '#2E9E5E' : '#6B7280', icon: '📈' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="stat-card" style={{
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 12, padding: '18px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, color, letterSpacing: '-0.5px', marginBottom: 4 }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '0.5px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE ACTIVITY ── */}
      {(liveActivity.length > 0 || recentPredictions.length > 0) && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
              <span style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '2px' }}>
                RECENT ACTIVITY
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(liveActivity.length > 0 ? liveActivity : recentPredictions).map((p: any, i: number) => {
                const username = p.profiles?.username || 'Unknown';
                const pick = p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw';
                const home = p.matches?.home_team || '';
                const away = p.matches?.away_team || '';
                const matchStr = home && away ? `${home} vs ${away}` : 'a match';
                const ago = timeAgo(p.created_at);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                    borderRadius: 10, padding: '10px 14px',
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{country.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13, color: '#2E9E5E', fontWeight: 700 }}>@{username}</span>
                      <span style={{ fontSize: 13, color: '#9CA3AF' }}>
                        {' '}predicted{' '}
                        <span style={{ color: 'white', fontWeight: 600 }}>{pick}</span>
                        {matchStr && <> in <span style={{ color: '#6B7280' }}>{matchStr}</span></>}
                        {' '}at <span style={{ color: '#F59E0B', fontWeight: 700 }}>{p.confidence_pct}%</span> confidence
                      </span>
                      {p.prediction_processed && p.points_earned > 0 && (
                        <span style={{ fontSize: 12, color: '#2E9E5E', fontWeight: 700 }}> · +{p.points_earned} pts</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#8895A3', flexShrink: 0 }}>{ago}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── TOP FORECASTERS ── */}
      {profiles.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px' }}>
                TOP {country.name.toUpperCase()} FORECASTERS
              </p>
              <a href="/leaderboard" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
                Full leaderboard →
              </a>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{
                backgroundColor: '#050E05', padding: '10px 20px',
                display: 'flex', justifyContent: 'space-between',
                fontSize: 10, color: '#6B7280', fontWeight: 700, letterSpacing: '1px',
                borderBottom: '1px solid #1A3A1A',
              }}>
                <span>RANK · FORECASTER</span>
                <span>PREDICTIONS · ACCURACY · POINTS</span>
              </div>
              {profiles.map((p: any, i: number) => (
                <a key={p.id} href={`/u/${p.username}`} className="profile-row" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 20px',
                  borderTop: i === 0 ? 'none' : '1px solid #1A3A1A',
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                }}>
                  <span style={{ fontSize: i < 3 ? 22 : 13, minWidth: 28, textAlign: 'center', color: '#6B7280', fontWeight: 700 }}>
                    {i < 3 ? MEDAL[i] : `#${i + 1}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                      @{p.username}
                    </div>
                    <div style={{ fontSize: 11, color: '#8895A3' }}>
                      {p.prediction_count} predictions · {p.accuracy_pct}% accuracy
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#2E9E5E', letterSpacing: '-0.5px' }}>
                      {p.total_points}
                    </div>
                    <div style={{ fontSize: 10, color: '#8895A3', letterSpacing: '1px' }}>PTS</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY REPRESENT THIS NATION ── */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            WHY REPRESENT {country.name.toUpperCase()}?
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 20, lineHeight: 1.2 }}>
            Your predictions build {country.name}'s legacy.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '⚽', text: `Every correct prediction earns points for ${country.name} in the Nation Battle — not just for you.` },
              { icon: '🌍', text: `${country.name} competes against ${rivalData.map(r => r?.name).filter(Boolean).join(', ')} and every other nation in the world.` },
              { icon: '📜', text: `Your ${country.adjective} football record is permanent. World Cup → EPL → Champions League — it never resets.` },
              { icon: '🏆', text: `Top ${country.adjective} forecasters are displayed publicly. Build a reputation your friends can see.` },
              { icon: '🆓', text: `Free forever. No betting. No gambling. Pure football intelligence.` },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIVAL NATIONS ── */}
      {rivalData.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
              {country.name.toUpperCase()} RIVALS
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
              {rivalData.filter(Boolean).map((rival: any) => (
                <a key={rival.slug} href={`/${rival.slug}`} style={{
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                  borderRadius: 12, padding: '16px 20px',
                  textDecoration: 'none', display: 'block',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2E9E5E'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1A3A1A'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{rival.flag}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{rival.name}</div>
                      {rival.rank > 0 && (
                        <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>Ranked #{rival.rank}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#8895A3' }}>
                    {rival.points.toLocaleString()} pts · View →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INTERNAL LINKS ── */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>
            EXPLORE MORE
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {[
              { href: '/predict', label: '⚽ Predict Matches' },
              { href: '/nations', label: '🌍 Nation Battle' },
              { href: '/leaderboard', label: '🏆 Global Leaderboard' },
              { href: '/groups', label: '👥 Private Groups' },
              { href: '/world-cup-2026', label: '🏆 World Cup 2026' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="nation-link" style={{
                display: 'inline-block',
                backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
                borderRadius: 8, padding: '9px 16px',
                textDecoration: 'none', fontSize: 13,
                color: '#9CA3AF', fontWeight: 600,
              }}>
                {label}
              </a>
            ))}
          </div>

          {/* Other nation pages */}
          <p style={{ fontSize: 11, color: '#8895A3', letterSpacing: '2px', marginBottom: 12 }}>OTHER NATIONS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {RELATED_NATIONS.filter(n => n.slug !== slug).map(n => (
              <a key={n.slug} href={`/${n.slug}`} className="nation-link" style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                backgroundColor: '#050E05', border: '1px solid #0D1F0F',
                borderRadius: 999, padding: '5px 12px',
                textDecoration: 'none', fontSize: 12, color: '#8895A3',
              }}>
                {n.flag} {n.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
