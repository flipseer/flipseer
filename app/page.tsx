'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

// ── TIMEZONE DETECTION ──
const TZ_NATION: Record<string,string> = {
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
const TZ_CODE: Record<string,string> = {
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
const FLAG: Record<string,string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','SN':'🇸🇳','ZA':'🇿🇦','NO':'🇳🇴',
  'SE':'🇸🇪','HR':'🇭🇷','CO':'🇨🇴','CA':'🇨🇦',
};
const CNAME: Record<string,string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'S.Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','SN':'Senegal',
  'ZA':'South Africa','NO':'Norway','SE':'Sweden','CO':'Colombia','CA':'Canada',
};

// ── LIVE SCORE STRIP ──
function LiveStrip() {
  const [matches, setMatches] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const go = async () => {
      try {
        const r = await fetch('/api/live-scores');
        const d = await r.json();
        if (d.live?.length) setMatches(d.live.slice(0,4));
      } catch {}
    };
    go();
    const iv = setInterval(go, 60000);
    return () => clearInterval(iv);
  }, []);
  if (!mounted || !matches.length) return null;
  return (
    <div style={{ backgroundColor:'#0A1A0A', borderBottom:'2px solid #EF4444', padding:'0', overflowX:'auto' }}>
      <div style={{ display:'flex', minWidth:'max-content', alignItems:'stretch' }}>
        <div style={{ display:'flex', alignItems:'center', padding:'0 16px', borderRight:'1px solid #1A3A1A', flexShrink:0 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#EF4444', display:'inline-block', animation:'pulse 1s infinite', marginRight:8 }}/>
          <span style={{ fontSize:'10px', fontWeight:800, color:'#EF4444', letterSpacing:'2px' }}>LIVE</span>
        </div>
        {matches.map((m,i) => (
          <div key={m.id} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'12px 20px',
            borderRight: i < matches.length-1 ? '1px solid #1A3A1A' : 'none',
          }}>
            <span style={{ fontSize:'14px', fontWeight:700, color:'white' }}>{m.home}</span>
            <span style={{
              fontSize:'18px', fontWeight:900, color:'#2E9E5E',
              backgroundColor:'#0D2B14', padding:'2px 10px', borderRadius:6,
              fontFamily:'Georgia,serif', letterSpacing:1,
            }}>{m.home_score}–{m.away_score}</span>
            <span style={{ fontSize:'14px', fontWeight:700, color:'white' }}>{m.away}</span>
            {m.elapsed && <span style={{ fontSize:'11px', color:'#EF4444', fontWeight:700 }}>{m.elapsed}'</span>}
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', padding:'0 20px' }}>
          <a href="/predict" style={{ fontSize:'12px', color:'#2E9E5E', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
            Predict now →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── UPCOMING MATCHES ──
function UpcomingMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const go = async () => {
      const { data } = await supabase
        .from('matches').select('id,home_team,away_team,kickoff,status')
        .in('status',['upcoming','locked'])
        .order('kickoff',{ascending:true}).limit(4);
      setMatches(data||[]);
    };
    go();
    const iv = setInterval(()=>setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!matches.length) return null;

  const countdown = (kickoff:string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ','T')+'Z';
    const diff = new Date(utc).getTime()-now.getTime();
    if (diff<=0) return null;
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    if (h>48) return null;
    if (h>0) return `${h}h ${String(m).padStart(2,'0')}m`;
    if (m>0) return `${m}m ${String(s).padStart(2,'0')}s`;
    return `${s}s`;
  };

  const fmt = (kickoff:string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ','T')+'Z';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Date(utc).toLocaleString('en-GB',{
      timeZone:tz,day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:true,
    });
  };

  return (
    <section style={{ padding:'48px 20px', borderTop:'1px solid #1A3A1A', borderBottom:'1px solid #1A3A1A' }}>
      <div style={{ maxWidth:'720px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <p style={{ fontSize:'11px', color:'#2E9E5E', fontWeight:700, letterSpacing:'3px', marginBottom:4 }}>ROUND OF 32 · WORLD CUP 2026</p>
            <h2 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:800, letterSpacing:'-0.5px', color:'white' }}>Upcoming Matches</h2>
          </div>
          <a href="/predict" style={{ fontSize:'13px', color:'#6B7280', textDecoration:'none', fontWeight:600 }}>All 104 →</a>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {matches.map((m) => {
            const cd = countdown(m.kickoff);
            const slug = `${m.home_team.toLowerCase().replace(/\s+/g,'-')}-vs-${m.away_team.toLowerCase().replace(/\s+/g,'-')}`;
            return (
              <a key={m.id} href={`/matches/${slug}`} style={{
                display:'flex', alignItems:'center', gap:16,
                padding:'16px 20px',
                backgroundColor:'#0D2B14',
                border:'1px solid #1A3A1A',
                borderRadius:12,
                textDecoration:'none',
                transition:'all 0.15s',
              }}
              onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor='#2E9E5E';(e.currentTarget as HTMLElement).style.transform='translateX(3px)'}}
              onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#1A3A1A';(e.currentTarget as HTMLElement).style.transform='translateX(0)'}}>
                <div style={{ minWidth:90, flexShrink:0 }}>
                  {cd ? (
                    <span style={{ fontSize:'12px', fontWeight:800, color:'#F59E0B', fontFamily:'Georgia,serif' }}>{cd}</span>
                  ) : (
                    <span style={{ fontSize:'11px', color:'#6B7280' }}>{fmt(m.kickoff)}</span>
                  )}
                </div>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                  <span style={{ fontSize:'15px', fontWeight:700, color:'white', flex:1, textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.home_team}</span>
                  <span style={{ fontSize:'11px', color:'#4B5563', fontWeight:700, flexShrink:0, padding:'3px 10px', border:'1px solid #1A3A1A', borderRadius:4 }}>VS</span>
                  <span style={{ fontSize:'15px', fontWeight:700, color:'white', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.away_team}</span>
                </div>
                <span style={{ fontSize:'12px', color:'#2E9E5E', fontWeight:700, flexShrink:0 }}>Predict →</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── MAIN HOME ──
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [nation, setNation] = useState('');
  const [nationCode, setNationCode] = useState('');
  const [nationRank, setNationRank] = useState(0);
  const [nationPts, setNationPts] = useState(0);
  const [nations, setNations] = useState<any[]>([]);
  const [stats, setStats] = useState({ users:0, active:0, preds:0 });
  const [days, setDays] = useState(16);
  const [hasLive, setHasLive] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const wcStart = new Date('2026-06-11T19:00:00Z');
    setDays(Math.floor((Date.now()-wcStart.getTime())/86400000));
    const init = async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const n = TZ_NATION[tz]||'';
        const c = TZ_CODE[tz]||'';
        setNation(n); setNationCode(c);

        const since = new Date(Date.now()-86400000).toISOString();
        const [
          {count:uc},{count:ac},{count:pc},
        ] = await Promise.all([
          supabase.from('profiles').select('*',{count:'exact',head:true}),
          supabase.from('profiles').select('*',{count:'exact',head:true}).gt('prediction_count',0),
          supabase.from('predictions').select('*',{count:'exact',head:true}).gte('created_at',since),
        ]);
        setStats({users:uc||0,active:ac||0,preds:pc||0});

        const [liveRes, lbRes] = await Promise.all([
          fetch('/api/live-scores'),
          fetch('/api/leaderboard'),
        ]);
        const ld = await liveRes.json();
        setHasLive(!!(ld.live?.length));

        const lb = await lbRes.json();
        if (lb && Array.isArray(lb)) {
          const map:Record<string,{points:number;forecasters:number}> = {};
          lb.forEach((u:any) => {
            const code = u.country||'OTHER';
            if (!map[code]) map[code]={points:0,forecasters:0};
            map[code].points+=u.total_points||0;
            map[code].forecasters+=1;
          });
          const ranked = Object.entries(map)
            .map(([code,s])=>({code,name:CNAME[code]||code,...s}))
            .sort((a,b)=>b.points-a.points||b.forecasters-a.forecasters);
          setNations(ranked);
          const idx = ranked.findIndex(n=>n.code===c);
          if (idx>=0) {
            setNationRank(idx+1);
            setNationPts(ranked[idx].points);
          }
        }
      } catch(e){console.error(e);}
    };
    init();
  }, [mounted]);

  return (
    <main style={{
      backgroundColor:'#0D1F0F',
      minHeight:'100vh',
      fontFamily:"-apple-system,'Segoe UI',Arial,sans-serif",
      color:'white',
      overflowX:'hidden',
    }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rankPop{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.6}}
        ::selection{background:#2E9E5E;color:white}
      `}</style>

      {/* Live scores */}
      {hasLive && <LiveStrip />}

      {/* Scrolling ticker */}
      <div style={{ backgroundColor:'#050E05', borderBottom:'1px solid #1A3A1A', padding:'8px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', gap:'48px', animation:'ticker 45s linear infinite', whiteSpace:'nowrap', width:'max-content' }}>
          {[
            '⚽ World Cup 2026 · Round of 32 · LIVE NOW',
            '🇮🇳 India vs 🇮🇩 Indonesia vs 🇳🇬 Nigeria — Nation Battle is on',
            '🎯 Predict exact scores · Earn up to 107 pts per match',
            '🔒 Calls lock before kickoff · Permanent record · No editing',
            '🏆 Create a private league · Challenge your friends',
            '🌍 Free forever · No betting · Pure football intelligence',
            '⚽ World Cup 2026 · Round of 32 · LIVE NOW',
            '🇮🇳 India vs 🇮🇩 Indonesia vs 🇳🇬 Nigeria — Nation Battle is on',
            '🎯 Predict exact scores · Earn up to 107 pts per match',
            '🔒 Calls lock before kickoff · Permanent record · No editing',
            '🏆 Create a private league · Challenge your friends',
            '🌍 Free forever · No betting · Pure football intelligence',
          ].map((t,i) => (
            <span key={i} style={{ fontSize:'12px', color:'#4B5563' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{
        textAlign:'center',
        padding:'clamp(56px,10vw,96px) 24px clamp(48px,8vw,80px)',
        maxWidth:'900px', margin:'0 auto', position:'relative',
      }}>
        {/* Glow */}
        <div style={{
          position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
          width:'80%',height:'60%',
          background:'radial-gradient(ellipse,rgba(46,158,94,0.12) 0%,transparent 70%)',
          pointerEvents:'none',
        }}/>

        {/* Live pill */}
        <div style={{
          display:'inline-flex',alignItems:'center',gap:8,
          backgroundColor:'#0D2B14',border:'1px solid #2E9E5E',
          borderRadius:999,padding:'7px 20px',marginBottom:36,
          animation:'fadeUp 0.4s ease both',
        }}>
          <span style={{width:7,height:7,borderRadius:'50%',backgroundColor:'#2E9E5E',display:'inline-block',animation:'pulse 1.5s infinite'}}/>
          <span style={{fontSize:'12px',color:'#2E9E5E',fontWeight:700,letterSpacing:'2px'}}>
            {mounted ? `WORLD CUP 2026 · DAY ${days+1}` : 'WORLD CUP 2026 · LIVE'}
          </span>
        </div>

        {/* ── RANK DISPLAY (if detected) ── */}
        {mounted && nation && nationRank > 0 ? (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <p style={{
              fontSize:'clamp(14px,3vw,20px)',color:'#6B7280',
              letterSpacing:'3px',fontWeight:600,marginBottom:4,textTransform:'uppercase',
            }}>
              {nation} is ranked
            </p>
            <div style={{
              fontSize:'clamp(100px,24vw,200px)',
              fontWeight:900,color:'#F59E0B',
              lineHeight:0.85,letterSpacing:'-6px',
              marginBottom:16,
              animation:'rankPop 0.6s 0.1s ease both',
              textShadow:'0 0 60px rgba(245,158,11,0.3)',
            }}>
              #{nationRank}
            </div>
            <h1 style={{
              fontSize:'clamp(24px,5vw,44px)',
              fontWeight:800,color:'white',
              lineHeight:1.15,letterSpacing:'-1px',marginBottom:20,
            }}>
              Can you help {nation} reach <span style={{color:'#2E9E5E'}}>#1?</span>
            </h1>
            <p style={{
              fontSize:'clamp(15px,2.5vw,18px)',color:'#9CA3AF',
              lineHeight:1.7,maxWidth:500,margin:'0 auto 32px',
            }}>
              Every correct prediction earns points for your nation.
              {nationPts > 0 && ` ${nation} has ${nationPts} points so far.`}
            </p>
          </div>
        ) : mounted && nation ? (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <h1 style={{
              fontSize:'clamp(36px,9vw,84px)',
              fontWeight:900,lineHeight:1.0,
              letterSpacing:'-2px',marginBottom:20,
            }}>
              Who is<br/>
              <span style={{color:'#2E9E5E'}}>{nation}'s</span><br/>
              #1 football mind?
            </h1>
            <p style={{fontSize:'clamp(15px,2.5vw,18px)',color:'#9CA3AF',lineHeight:1.7,maxWidth:500,margin:'0 auto 32px'}}>
              Predict World Cup matches. Build your permanent record. Earn points for your nation.
            </p>
          </div>
        ) : (
          <div style={{animation:'fadeUp 0.4s 0.06s ease both'}}>
            <h1 style={{
              fontSize:'clamp(36px,9vw,84px)',
              fontWeight:900,lineHeight:1.0,
              letterSpacing:'-2px',marginBottom:20,
            }}>
              Prove your<br/>
              <span style={{color:'#2E9E5E'}}>football</span><br/>
              intelligence.
            </h1>
            <p style={{fontSize:'clamp(15px,2.5vw,18px)',color:'#9CA3AF',lineHeight:1.7,maxWidth:500,margin:'0 auto 32px'}}>
              Predict World Cup 2026 matches before kickoff.
              Your calls lock permanently. Earn points for your nation. Free forever.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div style={{
          display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',
          marginBottom:16,
          animation:'fadeUp 0.4s 0.14s ease both',
        }}>
          <a href="/auth?utm_source=hero&utm_medium=home"
            style={{
              backgroundColor:'#2E9E5E',color:'white',
              padding:'clamp(14px,3vw,18px) clamp(28px,6vw,52px)',
              borderRadius:12,textDecoration:'none',
              fontSize:'clamp(15px,2.5vw,18px)',fontWeight:700,
              boxShadow:'0 0 48px rgba(46,158,94,0.4)',
              letterSpacing:'0.3px',
              transition:'all 0.15s',
            }}>
            Predict Free →
          </a>
          <a href="/groups?utm_source=hero&utm_medium=home"
            style={{
              backgroundColor:'rgba(245,158,11,0.1)',color:'#F59E0B',
              padding:'clamp(14px,3vw,18px) clamp(20px,4vw,32px)',
              borderRadius:12,textDecoration:'none',
              fontSize:'clamp(15px,2.5vw,18px)',fontWeight:600,
              border:'1px solid rgba(245,158,11,0.35)',
              transition:'all 0.15s',
            }}>
            🏆 Challenge Friends
          </a>
        </div>

        {/* Trust line */}
        <p style={{
          fontSize:'13px',color:'#4B5563',marginBottom:8,
          animation:'fadeUp 0.4s 0.18s ease both',
        }}>
          Free forever · No betting · No card required
        </p>
        <p style={{
          fontSize:'13px',color:'#4B5563',
          animation:'fadeUp 0.4s 0.2s ease both',
        }}>
          Already predicting?{' '}
          <a href="/groups" style={{color:'#F59E0B',textDecoration:'none',fontWeight:600}}>
            Create a private league →
          </a>
        </p>

        {/* Stats */}
        {mounted && stats.active > 0 && (
          <div style={{
            display:'flex',gap:'clamp(20px,5vw,48px)',
            justifyContent:'center',flexWrap:'wrap',
            marginTop:48,paddingTop:40,
            borderTop:'1px solid #1A3A1A',
            animation:'fadeUp 0.4s 0.22s ease both',
          }}>
            {[
              {v:`${stats.preds}`,l:'predictions today'},
              {v:`${stats.active}`,l:'active forecasters'},
              {v:`${nations.length||'23'}+`,l:'nations competing'},
            ].map(({v,l}) => (
              <div key={l} style={{textAlign:'center'}}>
                <div style={{
                  fontSize:'clamp(28px,5vw,42px)',
                  fontWeight:800,color:'white',
                  letterSpacing:'-1.5px',lineHeight:1,
                  fontFamily:'Georgia,serif',
                }}>{v}</div>
                <div style={{fontSize:'12px',color:'#6B7280',marginTop:6,letterSpacing:'0.5px'}}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── UPCOMING MATCHES ── */}
      <UpcomingMatches />

      {/* ── NATION BATTLE ── */}
      <section style={{ padding:'64px 20px', backgroundColor:'#050E05', borderTop:'1px solid #1A3A1A', borderBottom:'1px solid #1A3A1A' }}>
        <div style={{ maxWidth:'720px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <p style={{ fontSize:'11px', color:'#2E9E5E', fontWeight:700, letterSpacing:'3px', marginBottom:8 }}>NATION BATTLE · LIVE</p>
            <h2 style={{ fontSize:'clamp(24px,5vw,40px)', fontWeight:800, letterSpacing:'-1px', marginBottom:10 }}>
              {nation ? <>Can <span style={{color:'#2E9E5E'}}>{nation}</span> top the world?</> : 'Which nation leads the world?'}
            </h2>
            <p style={{ fontSize:'clamp(14px,2vw,16px)', color:'#6B7280', lineHeight:1.6 }}>
              Every prediction earns points for your country. The rivalry is live right now.
            </p>
          </div>

          {nations.length > 0 ? (
            <div style={{
              backgroundColor:'#0D2B14',border:'1px solid #1A7A4A',
              borderRadius:14,overflow:'hidden',marginBottom:24,
            }}>
              <div style={{
                backgroundColor:'#050E05',padding:'12px 20px',
                display:'flex',justifyContent:'space-between',
                fontSize:'10px',color:'#6B7280',fontWeight:700,letterSpacing:'1px',
                borderBottom:'1px solid #1A3A1A',
              }}>
                <span>RANK · NATION</span>
                <span>FORECASTERS · POINTS</span>
              </div>
              {nations.slice(0,6).map(({code,name,points,forecasters},i) => {
                const isMe = code===nationCode;
                const barW = Math.max(4,Math.round((points/(nations[0]?.points||1))*100));
                return (
                  <div key={code} style={{
                    display:'flex',alignItems:'center',gap:14,
                    padding:'14px 20px',
                    borderTop: i===0?'none':'1px solid #1A3A1A',
                    backgroundColor: isMe?'rgba(46,158,94,0.06)':'transparent',
                  }}>
                    <span style={{
                      fontSize:'13px',fontWeight:700,
                      color:i===0?'#F59E0B':'#6B7280',minWidth:28,
                    }}>#{i+1}</span>
                    <span style={{fontSize:'20px',flexShrink:0}}>{FLAG[code]||'🌍'}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                        <span style={{
                          fontSize:'15px',fontWeight: isMe?700:500,
                          color: isMe?'#2E9E5E':'white',
                        }}>
                          {name}
                          {isMe && <span style={{fontSize:'9px',color:'#2E9E5E',backgroundColor:'rgba(46,158,94,0.15)',padding:'2px 8px',borderRadius:999,marginLeft:8,letterSpacing:'1px',fontWeight:700}}>YOU</span>}
                        </span>
                        <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                          <span style={{fontSize:'14px',fontWeight:700,color:i===0?'#F59E0B':'#9CA3AF'}}>{points.toLocaleString()} pts</span>
                          <span style={{fontSize:'11px',color:'#4B5563',marginLeft:8}}>{forecasters}f</span>
                        </div>
                      </div>
                      <div style={{height:3,backgroundColor:'#0D1F0F',borderRadius:2,overflow:'hidden'}}>
                        <div style={{
                          width:barW+'%',height:'100%',borderRadius:2,
                          backgroundColor:i===0?'#F59E0B':isMe?'#2E9E5E':'#1A7A4A',
                          transition:'width 1s ease',
                        }}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div style={{textAlign:'center'}}>
            <a href="/nations" style={{color:'#2E9E5E',fontSize:'14px',fontWeight:700,textDecoration:'none'}}>
              Full Nation Battle standings →
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'64px 20px', borderBottom:'1px solid #1A3A1A' }}>
        <div style={{ maxWidth:'720px', margin:'0 auto' }}>
          <p style={{ fontSize:'11px', color:'#2E9E5E', fontWeight:700, letterSpacing:'3px', marginBottom:12, textAlign:'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontSize:'clamp(24px,5vw,38px)', fontWeight:800, letterSpacing:'-1px', textAlign:'center', marginBottom:40 }}>
            From prediction to legend.
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:48 }}>
            {[
              {icon:'🎯',title:'Call the match',desc:'Pick the winner. Predict the exact score. Set your confidence before kickoff.'},
              {icon:'🔒',title:'It locks forever',desc:'The moment the whistle blows, your call is sealed. No edits. No excuses.'},
              {icon:'⚡',title:'Earn reputation',desc:'Correct calls earn points for you and your nation. Upsets earn glory.'},
              {icon:'👑',title:'Build your legacy',desc:'World Cup → EPL → Champions League. One permanent record, forever.'},
            ].map(({icon,title,desc}) => (
              <div key={title} style={{
                backgroundColor:'#0D2B14',border:'1px solid #1A7A4A',
                borderRadius:14,padding:'24px 20px',
              }}>
                <div style={{fontSize:32,marginBottom:12}}>{icon}</div>
                <h3 style={{fontSize:'17px',color:'#2E9E5E',marginBottom:8,fontWeight:700}}>{title}</h3>
                <p style={{color:'#6B7280',fontSize:'14px',lineHeight:1.7,margin:0}}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Coming next */}
          <div style={{
            backgroundColor:'#0D2B14',border:'1px solid #1A3A1A',
            borderRadius:14,padding:'24px',marginBottom:48,
          }}>
            <p style={{fontSize:'11px',color:'#6B7280',fontWeight:700,letterSpacing:'2px',marginBottom:16}}>COMING NEXT</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {[
                {icon:'🏆',label:'World Cup 2026',date:'LIVE NOW',color:'#2E9E5E',active:true},
                {icon:'🏴',label:'EPL 2026/27',date:'Aug 16',color:'#8B5CF6',active:false},
                {icon:'⭐',label:'Champions League',date:'Sep 2026',color:'#F59E0B',active:false},
                {icon:'🇪🇸',label:'La Liga',date:'Oct 2026',color:'#EF4444',active:false},
              ].map(({icon,label,date,color,active}) => (
                <div key={label} style={{textAlign:'center'}}>
                  <div style={{
                    width:52,height:52,borderRadius:'50%',
                    border:`2px solid ${color}`,
                    backgroundColor: active ? color+'25' : 'transparent',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:22,margin:'0 auto 8px',
                    boxShadow: active ? `0 0 16px ${color}50` : 'none',
                  }}>{icon}</div>
                  <div style={{
                    fontSize:'9px',fontWeight:700,
                    backgroundColor: active ? color : '#1A3A1A',
                    color: active ? 'white' : '#4B5563',
                    padding:'2px 8px',borderRadius:999,
                    marginBottom:4,display:'inline-block',letterSpacing:'0.5px',
                  }}>{date}</div>
                  <div style={{fontSize:'11px',color: active ? color : '#4B5563',lineHeight:1.3}}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ textAlign:'center' }}>
            <h2 style={{
              fontSize:'clamp(28px,6vw,48px)',
              fontWeight:900,letterSpacing:'-1.5px',
              lineHeight:1.1,marginBottom:16,
            }}>
              {nation
                ? <>{nation}'s #1<br/><span style={{color:'#2E9E5E'}}>could be you.</span></>
                : <>Your record starts<br/><span style={{color:'#2E9E5E'}}>right now.</span></>
              }
            </h2>
            <p style={{color:'#6B7280',fontSize:'clamp(14px,2vw,16px)',marginBottom:28,lineHeight:1.6}}>
              Every match is a chance to prove your football intelligence.<br/>
              Predict. Represent your nation. Build your legacy.
            </p>
            <a href="/auth?utm_source=final&utm_medium=home"
              style={{
                display:'inline-block',
                backgroundColor:'#1A7A4A',color:'white',
                padding:'clamp(15px,3vw,18px) clamp(36px,7vw,56px)',
                borderRadius:12,textDecoration:'none',
                fontSize:'clamp(15px,2.5vw,18px)',fontWeight:700,
                letterSpacing:'0.3px',
                boxShadow:'0 0 48px rgba(46,158,94,0.35)',
              }}>
              ⚽ Predict Your First Match Free →
            </a>
            <p style={{fontSize:'12px',color:'#4B5563',marginTop:12}}>Free. No betting. No risk. Pure football reputation.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
