'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

// ── TIMEZONE → NATION MAP ──
const TZ_COUNTRY: Record<string, string> = {
  'Asia/Calcutta':'India','Asia/Kolkata':'India',
  'Asia/Jakarta':'Indonesia','Asia/Makassar':'Indonesia','Asia/Jayapura':'Indonesia',
  'Africa/Lagos':'Nigeria','Africa/Abuja':'Nigeria',
  'America/Sao_Paulo':'Brazil','America/Fortaleza':'Brazil',
  'America/Buenos_Aires':'Argentina','America/Argentina/Buenos_Aires':'Argentina',
  'America/Mexico_City':'Mexico','America/New_York':'USA',
  'America/Chicago':'USA','America/Los_Angeles':'USA',
  'Europe/London':'England','Europe/Paris':'France',
  'Europe/Berlin':'Germany','Europe/Madrid':'Spain',
  'Europe/Lisbon':'Portugal','Africa/Accra':'Ghana',
  'Africa/Johannesburg':'South Africa','Africa/Casablanca':'Morocco',
  'Africa/Cairo':'Egypt','Africa/Dakar':'Senegal',
  'Asia/Tokyo':'Japan','Asia/Seoul':'South Korea',
  'Asia/Karachi':'Pakistan','Asia/Dhaka':'Bangladesh',
  'Australia/Sydney':'Australia','Australia/Melbourne':'Australia',
  'America/Toronto':'Canada','America/Bogota':'Colombia',
  'Asia/Riyadh':'Saudi Arabia','Europe/Istanbul':'Turkey',
  'Europe/Oslo':'Norway','Europe/Stockholm':'Sweden',
};
const TZ_CODE: Record<string, string> = {
  'Asia/Calcutta':'IN','Asia/Kolkata':'IN',
  'Asia/Jakarta':'ID','Asia/Makassar':'ID','Asia/Jayapura':'ID',
  'Africa/Lagos':'NG','Africa/Abuja':'NG',
  'America/Sao_Paulo':'BR','America/Buenos_Aires':'AR',
  'America/Argentina/Buenos_Aires':'AR','America/Mexico_City':'MX',
  'America/New_York':'US','America/Chicago':'US','America/Los_Angeles':'US',
  'Europe/London':'GB','Europe/Paris':'FR','Europe/Berlin':'DE',
  'Europe/Madrid':'ES','Europe/Lisbon':'PT',
  'Africa/Accra':'GH','Africa/Johannesburg':'ZA','Africa/Casablanca':'MA',
  'Asia/Tokyo':'JP','Asia/Seoul':'KR',
  'Asia/Karachi':'PK','Asia/Dhaka':'BD',
  'Australia/Sydney':'AU','Australia/Melbourne':'AU',
  'America/Toronto':'CA','America/Bogota':'CO',
  'Asia/Riyadh':'SA','Europe/Istanbul':'TR',
};
const FLAG: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','SN':'🇸🇳','ZA':'🇿🇦','NO':'🇳🇴',
  'SE':'🇸🇪','HR':'🇭🇷','CO':'🇨🇴','CA':'🇨🇦',
};
const COUNTRY_NAME: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'S.Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','SN':'Senegal',
  'ZA':'South Africa','NO':'Norway','SE':'Sweden','HR':'Croatia','CO':'Colombia','CA':'Canada',
};

function useCountdown(kickoff: string) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ','T')+'Z';
    const target = new Date(utc).getTime();
    const tick = () => setDiff(Math.max(0, target - Date.now()));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [kickoff]);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, done: diff === 0 };
}

// ── LIVE MATCH STRIP ──
function LiveStrip() {
  const [matches, setMatches] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/live-scores');
        const d = await res.json();
        if (d.live?.length) setMatches(d.live.slice(0,3));
      } catch {}
    };
    fetch_();
    const iv = setInterval(fetch_, 60000);
    return () => clearInterval(iv);
  }, []);

  if (!mounted || !matches.length) return null;

  return (
    <div style={{
      backgroundColor:'#0A0A0A',
      borderBottom:'1px solid #1A3A1A',
      padding:'0',
      overflowX:'auto',
    }}>
      <div style={{
        display:'flex',
        minWidth:'max-content',
        padding:'0 20px',
      }}>
        {matches.map((m, i) => (
          <div key={m.id} style={{
            display:'flex',
            alignItems:'center',
            gap:'12px',
            padding:'10px 20px',
            borderRight: i < matches.length-1 ? '1px solid #1A3A1A' : 'none',
            minWidth:'220px',
          }}>
            <span style={{
              fontSize:'9px',fontWeight:700,color:'#EF4444',
              letterSpacing:'1.5px',
              background:'rgba(239,68,68,0.1)',
              padding:'2px 7px',borderRadius:'3px',
              animation:'pulse 1.5s infinite',
            }}>LIVE {m.elapsed ? m.elapsed+"'" : ''}</span>
            <span style={{fontSize:'13px',fontWeight:600,color:'white'}}>{m.home}</span>
            <span style={{
              fontSize:'16px',fontWeight:800,
              fontFamily:"'Courier New',monospace",
              color:'#2E9E5E',
              letterSpacing:'1px',
            }}>{m.home_score}–{m.away_score}</span>
            <span style={{fontSize:'13px',fontWeight:600,color:'white'}}>{m.away}</span>
          </div>
        ))}
        <div style={{padding:'10px 20px',display:'flex',alignItems:'center'}}>
          <a href="/predict" style={{fontSize:'11px',color:'#4B5563',textDecoration:'none',fontWeight:600,letterSpacing:'0.5px'}}>
            + {matches.length} LIVE →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── NEXT MATCH COUNTDOWN ──
function NextMatchBar({ kickoff, home, away }: { kickoff:string; home:string; away:string }) {
  const { h, m, s, done } = useCountdown(kickoff);
  if (done) return null;
  return (
    <div style={{
      backgroundColor:'#050E05',
      borderBottom:'1px solid #1A3A1A',
      padding:'10px 20px',
    }}>
      <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
        <span style={{fontSize:'11px',color:'#4B5563',letterSpacing:'1px',fontWeight:600}}>NEXT MATCH LOCKS IN</span>
        <span style={{
          fontFamily:"'Courier New',monospace",
          fontSize:'20px',fontWeight:800,color:'#F59E0B',letterSpacing:'2px',
        }}>
          {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </span>
        <span style={{fontSize:'13px',color:'#6B7280'}}>
          {home} <span style={{color:'#1A3A1A',margin:'0 4px'}}>·</span> {away}
        </span>
        <a href="/predict" style={{
          backgroundColor:'#1A7A4A',color:'white',
          padding:'5px 16px',borderRadius:'4px',
          textDecoration:'none',fontSize:'12px',fontWeight:700,
          letterSpacing:'0.5px',
        }}>PREDICT →</a>
      </div>
    </div>
  );
}

// ── ACTIVITY TICKER ──
function ActivityTicker() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const fetch_ = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('predicted_outcome,confidence_pct,created_at,profiles(username,country)')
        .order('created_at',{ascending:false})
        .limit(8);
      if (!data) return;
      const s = data
        .filter((p:any) => p.profiles?.username)
        .map((p:any) => {
          const flag = FLAG[p.profiles.country] || '🌍';
          const pick = p.predicted_outcome === 'home' ? 'Home Win' : p.predicted_outcome === 'away' ? 'Away Win' : 'Draw';
          return `${flag} @${p.profiles.username} predicted ${pick} at ${p.confidence_pct}% confidence`;
        });
      setItems(s);
    };
    fetch_();
  }, []);

  if (!items.length) return null;

  const doubled = [...items, ...items];
  return (
    <div style={{backgroundColor:'#030803',borderBottom:'1px solid #111',padding:'7px 0',overflow:'hidden'}}>
      <div style={{
        display:'flex',gap:'48px',
        animation:'ticker 50s linear infinite',
        whiteSpace:'nowrap',width:'max-content',
      }}>
        {doubled.map((item,i) => (
          <span key={i} style={{
            fontSize:'11px',color:'#2E4A2E',
            display:'inline-flex',alignItems:'center',gap:'6px',
            fontFamily:"'Courier New',monospace",
          }}>
            <span style={{color:'#1A4A2A',fontSize:'8px'}}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── NATION LEADERBOARD MINI ──
function NationRanking({ nations, visitorCode }: { nations:any[]; visitorCode:string }) {
  return (
    <div style={{
      display:'flex',flexDirection:'column',gap:'2px',
    }}>
      {nations.slice(0,6).map((n,i) => {
        const isMe = n.code === visitorCode;
        const barW = Math.max(4, Math.round((n.points / (nations[0]?.points||1)) * 100));
        return (
          <div key={n.code} style={{
            display:'flex',alignItems:'center',gap:'12px',
            padding:'10px 16px',
            backgroundColor: isMe ? 'rgba(46,158,94,0.06)' : 'transparent',
            borderLeft: isMe ? '2px solid #2E9E5E' : '2px solid transparent',
          }}>
            <span style={{
              fontSize:'12px',color: i===0?'#F59E0B':'#2E4A2E',
              fontFamily:"'Courier New',monospace",
              fontWeight:700,minWidth:'28px',
            }}>#{i+1}</span>
            <span style={{fontSize:'18px',flexShrink:0}}>{FLAG[n.code]||'🌍'}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                <span style={{
                  fontSize:'13px',fontWeight: isMe?700:500,
                  color: isMe?'#2E9E5E':'#9CA3AF',
                }}>
                  {n.name} {isMe && <span style={{fontSize:'9px',color:'#2E9E5E',marginLeft:'4px',letterSpacing:'1px'}}>YOU</span>}
                </span>
                <span style={{
                  fontSize:'13px',fontWeight:700,
                  color: i===0?'#F59E0B':'#4B5563',
                  fontFamily:"'Courier New',monospace",
                }}>{n.points.toLocaleString()}</span>
              </div>
              <div style={{height:'2px',backgroundColor:'#0D1F0F',borderRadius:'1px',overflow:'hidden'}}>
                <div style={{
                  width:barW+'%',height:'100%',
                  backgroundColor: i===0?'#F59E0B': isMe?'#2E9E5E':'#1A3A1A',
                  transition:'width 1s ease',
                }}/>
              </div>
            </div>
            <span style={{fontSize:'10px',color:'#2E4A2E',flexShrink:0}}>{n.forecasters}f</span>
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN ──
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [nation, setNation] = useState('');
  const [nationCode, setNationCode] = useState('');
  const [nationRank, setNationRank] = useState(0);
  const [nations, setNations] = useState<any[]>([]);
  const [stats, setStats] = useState({ users:0, active:0, preds24h:0 });
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [days, setDays] = useState(17);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const wcStart = new Date('2026-06-11T19:00:00Z');
    setDays(Math.floor((Date.now()-wcStart.getTime())/(86400000)));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const init = async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const detectedNation = TZ_COUNTRY[tz] || '';
        const detectedCode = TZ_CODE[tz] || '';
        setNation(detectedNation);
        setNationCode(detectedCode);

        const since = new Date(Date.now()-86400000).toISOString();
        const [
          {count:userCount},
          {count:activeCount},
          {count:predCount},
        ] = await Promise.all([
          supabase.from('profiles').select('*',{count:'exact',head:true}),
          supabase.from('profiles').select('*',{count:'exact',head:true}).gt('prediction_count',0),
          supabase.from('predictions').select('*',{count:'exact',head:true}).gte('created_at',since),
        ]);
        setStats({users:userCount||0,active:activeCount||0,preds24h:predCount||0});

        // Next upcoming match
        const {data:nm} = await supabase
          .from('matches').select('home_team,away_team,kickoff')
          .eq('status','upcoming')
          .order('kickoff',{ascending:true}).limit(1).single();
        if (nm) setNextMatch(nm);

        // Live count
        const res = await fetch('/api/live-scores');
        const ld = await res.json();
        setLiveCount(ld.live?.length||0);

        // Nation leaderboard
        const res2 = await fetch('/api/leaderboard');
        const lb = await res2.json();
        if (lb && Array.isArray(lb)) {
          const map: Record<string,{points:number;forecasters:number}> = {};
          lb.forEach((u:any) => {
            const c = u.country||'OTHER';
            if (!map[c]) map[c]={points:0,forecasters:0};
            map[c].points += u.total_points||0;
            map[c].forecasters += 1;
          });
          const ranked = Object.entries(map)
            .map(([code,s])=>({code,name:COUNTRY_NAME[code]||code,...s}))
            .sort((a,b)=>b.points-a.points||b.forecasters-a.forecasters);
          setNations(ranked);
          const idx = ranked.findIndex(n=>n.code===detectedCode);
          if (idx>=0) setNationRank(idx+1);
        }
      } catch(e) { console.error(e); }
    };
    init();
  }, [mounted]);

  const heroVariant = nation && nationRank > 0 ? 'ranked'
    : nation ? 'nation'
    : 'generic';

  return (
    <main style={{
      backgroundColor:'#080F08',
      minHeight:'100vh',
      fontFamily:"-apple-system,'Helvetica Neue',Arial,sans-serif",
      color:'white',
      overflowX:'hidden',
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rankIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        * { box-sizing: border-box; }
        ::selection{background:#2E9E5E;color:white}
        a{color:inherit}
        .hover-dim{transition:opacity 0.15s}
        .hover-dim:hover{opacity:0.7}
        .match-card:hover{border-color:#2E9E5E!important;transform:translateX(2px)}
        .match-card{transition:all 0.15s ease}
      `}</style>

      {/* ── LIVE STRIP (only when matches are live) ── */}
      {liveCount > 0 && <LiveStrip />}

      {/* ── COUNTDOWN BAR ── */}
      {nextMatch && !liveCount && (
        <NextMatchBar
          kickoff={nextMatch.kickoff}
          home={nextMatch.home_team}
          away={nextMatch.away_team}
        />
      )}

      {/* ── ACTIVITY TICKER ── */}
      <ActivityTicker />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        padding:'72px 24px 64px',
        maxWidth:'900px',
        margin:'0 auto',
        position:'relative',
      }}>

        {/* Ambient glow */}
        <div style={{
          position:'absolute',top:'-60px',left:'50%',transform:'translateX(-50%)',
          width:'600px',height:'400px',
          background:'radial-gradient(ellipse,rgba(46,158,94,0.07) 0%,transparent 65%)',
          pointerEvents:'none',
        }}/>

        {/* Eyebrow */}
        <div style={{
          display:'inline-flex',alignItems:'center',gap:'8px',
          marginBottom:'32px',
          animation:'fadeUp 0.4s ease both',
        }}>
          <span style={{
            width:'6px',height:'6px',borderRadius:'50%',
            backgroundColor:'#2E9E5E',
            display:'inline-block',
            animation:'pulse 2s infinite',
          }}/>
          <span style={{
            fontSize:'11px',color:'#2E9E5E',
            fontWeight:700,letterSpacing:'3px',
            fontFamily:"'Courier New',monospace",
          }}>
            {mounted ? `WC 2026 · DAY ${days+1} · ${stats.active} FORECASTERS` : 'WC 2026 · LIVE'}
          </span>
        </div>

        {/* ── HERO HEADLINE ── */}
        {heroVariant === 'ranked' && (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <div style={{
              fontSize:'clamp(15px,3vw,20px)',
              color:'#4B5563',
              letterSpacing:'4px',
              fontWeight:600,
              marginBottom:'4px',
              textTransform:'uppercase',
            }}>
              {nation} is ranked
            </div>
            <div style={{
              fontSize:'clamp(96px,22vw,180px)',
              fontWeight:900,
              color:'#F59E0B',
              lineHeight:0.85,
              letterSpacing:'-6px',
              marginBottom:'16px',
              animation:'rankIn 0.5s 0.1s ease both',
            }}>
              #{nationRank}
            </div>
            <div style={{
              fontSize:'clamp(22px,5vw,44px)',
              fontWeight:700,
              color:'white',
              lineHeight:1.1,
              letterSpacing:'-1px',
              marginBottom:'24px',
            }}>
              Can you help them<br/>
              <span style={{color:'#2E9E5E'}}>reach #1?</span>
            </div>
          </div>
        )}

        {heroVariant === 'nation' && (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <div style={{
              fontSize:'clamp(32px,8vw,72px)',
              fontWeight:900,
              lineHeight:1.0,
              letterSpacing:'-2px',
              marginBottom:'20px',
            }}>
              Who is<br/>
              <span style={{color:'#2E9E5E'}}>{nation}'s</span><br/>
              #1 football mind?
            </div>
          </div>
        )}

        {heroVariant === 'generic' && (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <div style={{
              fontSize:'clamp(36px,8vw,76px)',
              fontWeight:900,
              lineHeight:1.0,
              letterSpacing:'-2px',
              marginBottom:'20px',
            }}>
              Prove your<br/>
              <span style={{color:'#2E9E5E'}}>football</span><br/>
              intelligence.
            </div>
          </div>
        )}

        {/* Subline */}
        <p style={{
          fontSize:'clamp(14px,2vw,17px)',
          color:'#4B5563',
          lineHeight:1.6,
          marginBottom:'32px',
          maxWidth:'480px',
          animation:'fadeUp 0.4s 0.12s ease both',
        }}>
          Predict World Cup 2026 matches before kickoff.
          Your calls lock permanently. Every correct prediction
          earns points for your nation.
        </p>

        {/* CTAs */}
        <div style={{
          display:'flex',gap:'12px',flexWrap:'wrap',
          marginBottom:'20px',
          animation:'fadeUp 0.4s 0.16s ease both',
        }}>
          <a href="/auth?utm_source=hero&utm_medium=homepage&utm_campaign=wc2026"
            style={{
              backgroundColor:'#2E9E5E',color:'white',
              padding:'15px 36px',
              borderRadius:'6px',
              textDecoration:'none',
              fontSize:'15px',fontWeight:700,
              letterSpacing:'0.3px',
              boxShadow:'0 0 32px rgba(46,158,94,0.35)',
              transition:'all 0.15s',
            }}>
            Predict free →
          </a>
          <a href="/groups?utm_source=hero&utm_medium=homepage&utm_campaign=groups"
            style={{
              backgroundColor:'rgba(245,158,11,0.08)',
              color:'#F59E0B',
              padding:'15px 28px',
              borderRadius:'6px',
              textDecoration:'none',
              fontSize:'15px',fontWeight:600,
              border:'1px solid rgba(245,158,11,0.25)',
              transition:'all 0.15s',
            }}>
            🏆 Challenge friends
          </a>
        </div>

        {/* Micro trust */}
        <p style={{
          fontSize:'12px',color:'#2E4A2E',
          letterSpacing:'0.5px',
          animation:'fadeUp 0.4s 0.2s ease both',
        }}>
          Free forever · No betting · No card required
          {' · '}
          <a href="/groups" style={{color:'#4B5563',textDecoration:'underline'}}>
            Create a private league
          </a>
        </p>

        {/* Stats strip */}
        {mounted && stats.users > 0 && (
          <div style={{
            display:'flex',gap:'32px',
            marginTop:'48px',
            paddingTop:'32px',
            borderTop:'1px solid #0D1F0F',
            flexWrap:'wrap',
            animation:'fadeUp 0.4s 0.24s ease both',
          }}>
            {[
              {v: stats.preds24h, l:'predictions today'},
              {v: stats.active, l:'active forecasters'},
              {v: nations.length || '23+', l:'nations competing'},
            ].map(({v,l}) => (
              <div key={l}>
                <div style={{
                  fontSize:'clamp(24px,4vw,36px)',
                  fontWeight:800,
                  color:'white',
                  letterSpacing:'-1px',
                  fontFamily:"'Courier New',monospace",
                  lineHeight:1,
                }}>{v}</div>
                <div style={{fontSize:'11px',color:'#2E4A2E',marginTop:'4px',letterSpacing:'0.5px'}}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          UPCOMING MATCHES
      ══════════════════════════════════════ */}
      <UpcomingSection />

      {/* ══════════════════════════════════════
          NATION BATTLE
      ══════════════════════════════════════ */}
      <section style={{
        padding:'64px 0',
        borderTop:'1px solid #0D1F0F',
        borderBottom:'1px solid #0D1F0F',
      }}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px'}}>

          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'32px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <div style={{fontSize:'10px',color:'#2E4A2E',letterSpacing:'3px',fontWeight:700,marginBottom:'8px',fontFamily:"'Courier New',monospace"}}>
                NATION BATTLE · LIVE
              </div>
              <h2 style={{
                fontSize:'clamp(24px,5vw,42px)',
                fontWeight:800,letterSpacing:'-1px',
                lineHeight:1.1,
              }}>
                {nation
                  ? <>Can <span style={{color:'#2E9E5E'}}>{nation}</span> top the world?</>
                  : 'Which nation leads?'
                }
              </h2>
            </div>
            <a href="/nations" style={{
              fontSize:'12px',color:'#4B5563',
              textDecoration:'none',fontWeight:600,
              letterSpacing:'0.5px',
              borderBottom:'1px solid #1A3A1A',
              paddingBottom:'2px',
              whiteSpace:'nowrap',
            }}>
              Full standings →
            </a>
          </div>

          {nations.length > 0 ? (
            <div style={{
              backgroundColor:'#050E05',
              border:'1px solid #0D1F0F',
              borderRadius:'8px',
              overflow:'hidden',
              marginBottom:'24px',
            }}>
              <div style={{
                padding:'10px 16px',
                borderBottom:'1px solid #0D1F0F',
                display:'flex',justifyContent:'space-between',
              }}>
                <span style={{fontSize:'9px',color:'#2E4A2E',letterSpacing:'2px',fontWeight:700,fontFamily:"'Courier New',monospace"}}>RANK · NATION</span>
                <span style={{fontSize:'9px',color:'#2E4A2E',letterSpacing:'2px',fontWeight:700,fontFamily:"'Courier New',monospace"}}>POINTS</span>
              </div>
              <NationRanking nations={nations} visitorCode={nationCode} />
            </div>
          ) : (
            <div style={{
              backgroundColor:'#050E05',border:'1px solid #0D1F0F',
              borderRadius:'8px',padding:'32px 24px',textAlign:'center',marginBottom:'24px',
            }}>
              <p style={{color:'#2E4A2E',fontSize:'14px'}}>Your predictions will appear here. Be first to predict.</p>
            </div>
          )}

          <p style={{fontSize:'13px',color:'#2E4A2E',lineHeight:1.7}}>
            Every correct prediction earns points for your country.
            {nation && nationRank > 0 && ` ${nation} is currently ranked #${nationRank} globally.`}
            {' '}<a href="/predict" style={{color:'#2E9E5E',fontWeight:600}}>Start predicting to move up.</a>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — minimal, editorial
      ══════════════════════════════════════ */}
      <section style={{padding:'64px 24px',maxWidth:'900px',margin:'0 auto'}}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
          gap:'1px',
          backgroundColor:'#0D1F0F',
          border:'1px solid #0D1F0F',
          borderRadius:'8px',
          overflow:'hidden',
          marginBottom:'48px',
        }}>
          {[
            {n:'01',head:'Call it',body:'Pick the winner and exact score. Set your confidence before kickoff.'},
            {n:'02',head:'It locks',body:'The moment the whistle blows, your call is sealed. No edits. No excuses.'},
            {n:'03',head:'Earn',body:'Correct calls earn points for you and your nation. Upsets earn more.'},
            {n:'04',head:'Legacy',body:'World Cup → EPL → Champions League. One permanent record, forever.'},
          ].map(({n,head,body}) => (
            <div key={n} style={{
              backgroundColor:'#080F08',
              padding:'28px 24px',
            }}>
              <div style={{
                fontSize:'10px',color:'#1A3A1A',
                fontFamily:"'Courier New',monospace",
                fontWeight:700,letterSpacing:'2px',
                marginBottom:'16px',
              }}>{n}</div>
              <div style={{
                fontSize:'18px',fontWeight:700,
                color:'white',marginBottom:'8px',
                letterSpacing:'-0.3px',
              }}>{head}</div>
              <p style={{fontSize:'13px',color:'#4B5563',lineHeight:1.6,margin:0}}>{body}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{textAlign:'center',padding:'48px 24px',backgroundColor:'#050E05',border:'1px solid #0D1F0F',borderRadius:'8px'}}>
          <div style={{
            fontSize:'clamp(28px,6vw,52px)',
            fontWeight:900,
            letterSpacing:'-2px',
            lineHeight:1.05,
            marginBottom:'16px',
          }}>
            {nation
              ? <>{nation}&apos;s #1<br/><span style={{color:'#2E9E5E'}}>could be you.</span></>
              : <>Your record<br/><span style={{color:'#2E9E5E'}}>starts now.</span></>
            }
          </div>
          <p style={{color:'#4B5563',fontSize:'14px',marginBottom:'28px',lineHeight:1.6}}>
            World Cup 2026 is live. Every match is a chance to prove your football intelligence.
          </p>
          <a href="/auth?utm_source=final&utm_medium=homepage&utm_campaign=wc2026"
            style={{
              display:'inline-block',
              backgroundColor:'#2E9E5E',color:'white',
              padding:'16px 48px',borderRadius:'6px',
              textDecoration:'none',fontSize:'16px',fontWeight:700,
              letterSpacing:'0.3px',
              boxShadow:'0 0 40px rgba(46,158,94,0.3)',
            }}>
            Predict your first match →
          </a>
          <p style={{fontSize:'11px',color:'#1A3A1A',marginTop:'12px',letterSpacing:'0.5px'}}>
            FREE · NO BETTING · NO CARD
          </p>
        </div>
      </section>

    </main>
  );
}

// ── UPCOMING MATCHES SECTION ──
function UpcomingSection() {
  const [matches, setMatches] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetch_ = async () => {
      const {data} = await supabase
        .from('matches')
        .select('id,home_team,away_team,kickoff,status,league')
        .in('status',['upcoming','locked'])
        .order('kickoff',{ascending:true})
        .limit(5);
      setMatches(data||[]);
    };
    fetch_();
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!matches.length) return null;

  const formatTime = (kickoff:string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ','T')+'Z';
    const d = new Date(utc);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return d.toLocaleString('en-GB',{
      timeZone:tz,day:'numeric',month:'short',
      hour:'2-digit',minute:'2-digit',hour12:true,
    });
  };

  const getCountdown = (kickoff:string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ','T')+'Z';
    const diff = new Date(utc).getTime() - now.getTime();
    if (diff<=0||diff>24*3600000) return null;
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    if (h>0) return `${h}h ${m}m`;
    if (m>0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <section style={{
      borderTop:'1px solid #0D1F0F',
      borderBottom:'1px solid #0D1F0F',
    }}>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'48px 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <span style={{fontSize:'10px',color:'#2E4A2E',letterSpacing:'3px',fontWeight:700,fontFamily:"'Courier New',monospace"}}>
            UPCOMING · WORLD CUP 2026
          </span>
          <a href="/predict" style={{fontSize:'11px',color:'#4B5563',textDecoration:'none',fontWeight:600,letterSpacing:'0.5px'}}>
            All matches →
          </a>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
          {matches.map((m) => {
            const countdown = getCountdown(m.kickoff);
            const slug = `${m.home_team.toLowerCase().replace(/\s+/g,'-')}-vs-${m.away_team.toLowerCase().replace(/\s+/g,'-')}`;
            return (
              <div key={m.id} className="match-card" style={{
                display:'flex',alignItems:'center',gap:'16px',
                padding:'14px 16px',
                backgroundColor:'#050E05',
                border:'1px solid #0D1F0F',
                borderRadius:'4px',
                cursor:'pointer',
              }} onClick={()=>window.location.href='/predict'}>
                <div style={{minWidth:'80px',flexShrink:0}}>
                  {countdown ? (
                    <span style={{
                      fontSize:'11px',fontWeight:700,color:'#F59E0B',
                      fontFamily:"'Courier New',monospace",
                    }}>{countdown}</span>
                  ) : (
                    <span style={{fontSize:'11px',color:'#2E4A2E'}}>{formatTime(m.kickoff)}</span>
                  )}
                </div>
                <div style={{flex:1,display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
                  <span style={{
                    fontSize:'14px',fontWeight:600,color:'white',
                    flex:1,textAlign:'right',
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                  }}>{m.home_team}</span>
                  <span style={{
                    fontSize:'10px',color:'#2E4A2E',fontWeight:700,
                    flexShrink:0,letterSpacing:'1px',
                    fontFamily:"'Courier New',monospace",
                  }}>VS</span>
                  <span style={{
                    fontSize:'14px',fontWeight:600,color:'white',
                    flex:1,
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                  }}>{m.away_team}</span>
                </div>
                <a href={`/matches/${slug}`}
                  onClick={e=>e.stopPropagation()}
                  style={{
                    fontSize:'11px',color:'#2E9E5E',fontWeight:700,
                    textDecoration:'none',flexShrink:0,
                    letterSpacing:'0.5px',
                  }}>
                  PREDICT →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
