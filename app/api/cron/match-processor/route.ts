import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

const COMP_EMOJI: Record<string,string> = {'EPL 2026/27':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','UCL 2026/27':'⭐','Liga 1 2026/27':'🇮🇩','Ghana PL 2026/27':'🇬🇭','ISL 2026/27':'🇮🇳'}
const COMP_SHORT: Record<string,string> = {'EPL 2026/27':'EPL','UCL 2026/27':'UCL','Liga 1 2026/27':'Liga 1','Ghana PL 2026/27':'Ghana PL','ISL 2026/27':'ISL'}

function slugify(s: string){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

async function tg(text: string, token: string){
  try{const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:'@flipseer',text,parse_mode:'HTML',disable_web_page_preview:true})});const d=await r.json();return d.ok===true}catch{return false}
}

export async function GET(req: NextRequest){
  const secret=req.headers.get('x-cron-secret')||req.nextUrl.searchParams.get('secret')
  const isVercel=req.headers.get('x-vercel-cron-signature')!==null||req.headers.get('user-agent')?.includes('vercel')
  if(secret!==process.env.CRON_SECRET&&!isVercel)return NextResponse.json({error:'Unauthorized'},{status:401})

  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const apiKey=process.env.API_FOOTBALL_KEY
  if(!apiKey)return NextResponse.json({error:'No API key'},{status:500})
  const token=process.env.TELEGRAM_BOT_TOKEN||''
  const log:string[]=[]
  const now=new Date()
  log.push('Cron started: '+now.toISOString())

  try{
    const wStart=new Date(now.getTime()-24*60*60*1000).toISOString()
    const wEnd=new Date(now.getTime()+3*60*60*1000).toISOString()
    const sCut=new Date(now.getTime()-3*60*60*1000).toISOString()

    const {data:wm}=await supabase.from('matches').select('id,api_id,home_team,away_team,kickoff,status,home_score,away_score,competition,tg_kickoff_posted,tg_halftime_posted,tg_last_home_score,tg_last_away_score').in('status',['upcoming','locked','live']).gte('kickoff',wStart).lte('kickoff',wEnd)
    const {data:sm}=await supabase.from('matches').select('id,api_id,home_team,away_team,kickoff,status,home_score,away_score,competition,tg_kickoff_posted,tg_halftime_posted,tg_last_home_score,tg_last_away_score').in('status',['locked','live','upcoming']).lt('kickoff',sCut)

    const seen=new Set<number>()
    const matches=[...(wm||[]),...(sm||[])].filter((m:any)=>{if(seen.has(m.id))return false;seen.add(m.id);return true})

    if(!matches.length){log.push('No matches');return NextResponse.json({ok:true,log})}
    log.push('Matches: '+matches.length)

    const fixtures:any[]=[]
    for(let i=0;i<matches.length;i+=20){
      const ids=matches.slice(i,i+20).map((m:any)=>m.api_id).join('-')
      const r=await fetch('https://v3.football.api-sports.io/fixtures?ids='+ids,{headers:{'x-apisports-key':apiKey},cache:'no-store'})
      if(r.ok){const d=await r.json();fixtures.push(...(d?.response||[]))}
      else log.push('API err: '+r.status)
    }
    log.push('Fixtures: '+fixtures.length)

    for(const fix of fixtures){
      const apiId=fix.fixture?.id
      const st=fix.fixture?.status?.short
      const elapsed=fix.fixture?.status?.elapsed||0
      const hs=fix.goals?.home??0
      const as_=fix.goals?.away??0
      const events:any[]=fix.events||[]
      const match=matches.find((m:any)=>m.api_id===apiId)
      if(!match)continue

      log.push(match.home_team+' vs '+match.away_team+' | '+st+' | DB:'+match.status)

      const koTime=new Date(match.kickoff.endsWith('Z')?match.kickoff:match.kickoff.replace(' ','T')+'Z').getTime()
      const inPlay=['1H','HT','2H','ET','P','BT'].includes(st)
      const finished=['FT','AET','PEN'].includes(st)
      const abandoned=['CANC','ABD','AWD','WO'].includes(st)
      const halftime=st==='HT'
      const pastKo=now.getTime()>=koTime
      const flag=COMP_EMOJI[match.competition]||'⚽'
      const comp=COMP_SHORT[match.competition]||match.competition
      const slug=slugify(match.home_team)+'-vs-'+slugify(match.away_team)
      const url='https://flipseer.com/matches/'+slug

      if((inPlay||pastKo)&&match.status==='upcoming'){
        await supabase.from('matches').update({status:'locked'}).eq('id',match.id)
        match.status='locked'
        log.push('LOCKED: '+match.home_team)
      }

      if(inPlay&&!match.tg_kickoff_posted){
        const {data:preds}=await supabase.from('predictions').select('predicted_outcome').eq('match_id',match.id)
        const total=preds?.length||0
        let hw=0,dw=0,aw=0
        ;(preds||[]).forEach((p:any)=>{if(p.predicted_outcome==='home')hw++;else if(p.predicted_outcome==='draw')dw++;else aw++})
        const predLine=total>0?`\n\n🔮 <b>Community split</b> (${total} forecasters)\n🏠 ${match.home_team} — <b>${Math.round(hw/total*100)}%</b>  🤝 Draw — <b>${Math.round(dw/total*100)}%</b>  ✈️ ${match.away_team} — <b>${Math.round(aw/total*100)}%</b>`:''
        const ok=await tg(`${flag} <b>KICK OFF · ${comp}</b>\n\n⚽ <b>${match.home_team} vs ${match.away_team}</b>\n🟢 The match has started!${predLine}\n\n👉 Watch live → ${url}`,token)
        if(ok){await supabase.from('matches').update({tg_kickoff_posted:true}).eq('id',match.id);match.tg_kickoff_posted=true;log.push('TG KO: '+match.home_team)}
      }

      if(inPlay){
        const pH=match.tg_last_home_score??match.home_score??0
        const pA=match.tg_last_away_score??match.away_score??0
        await supabase.from('matches').update({status:'live',home_score:hs,away_score:as_}).eq('id',match.id)
        match.status='live'
        log.push('SCORE: '+hs+'-'+as_)

        if(hs!==pH||as_!==pA){
          const goals=events.filter((e:any)=>e.type==='Goal'&&e.detail!=='Missed Penalty')
          const g=goals[goals.length-1]
          let gl='⚽ <b>GOAL!</b>'
          if(g){
            const sc=g.player?.name?.split(' ').pop()||''
            const ast=g.assist?.name?.split(' ').pop()||''
            const tm=g.team?.name||''
            const mn=g.time?.elapsed||elapsed
            if(g.detail==='Penalty')gl=`⚽ <b>GOAL! ${sc} (pen) — ${tm} · ${mn}'</b>`
            else if(g.detail==='Own Goal')gl=`⚽ <b>OWN GOAL! ${sc} — ${tm} · ${mn}'</b>`
            else gl=`⚽ <b>GOAL! ${sc}${ast?' (assist: '+ast+')':''} — ${tm} · ${mn}'</b>`
          }
          const ok=await tg(`${flag} <b>${comp}</b>\n\n${gl}\n\n🏟 <b>${match.home_team} ${hs} – ${as_} ${match.away_team}</b>\n\n👉 Live → ${url}`,token)
          if(ok){await supabase.from('matches').update({tg_last_home_score:hs,tg_last_away_score:as_}).eq('id',match.id);match.tg_last_home_score=hs;match.tg_last_away_score=as_;log.push('TG GOAL: '+hs+'-'+as_)}
        }
      }

      if(halftime&&!match.tg_halftime_posted){
        const ok=await tg(`${flag} <b>HALF TIME · ${comp}</b>\n\n⚽ <b>${match.home_team} ${hs} – ${as_} ${match.away_team}</b>\n\n👉 See predictions → ${url}`,token)
        if(ok){await supabase.from('matches').update({tg_halftime_posted:true}).eq('id',match.id);match.tg_halftime_posted=true;log.push('TG HT: '+match.home_team)}
      }

      if(finished&&match.status!=='completed'){
        const {error:ue}=await supabase.from('matches').update({status:'completed',home_score:hs,away_score:as_}).eq('id',match.id)
        if(ue){log.push('UPDATE ERR: '+ue.message);continue}
        log.push('SETTLED: '+match.home_team+' '+hs+'-'+as_+' '+match.away_team)

        const winner=hs>as_?'home':as_>hs?'away':'draw'
        const {data:preds}=await supabase.from('predictions').select('predicted_outcome').eq('match_id',match.id)
        if(preds&&preds.length>=2){
          const wp=preds.filter((p:any)=>p.predicted_outcome===winner).length/preds.length
          if(wp<0.4){await supabase.from('matches').update({is_upset:true,winner}).eq('id',match.id);log.push('UPSET: '+match.home_team)}
          else await supabase.from('matches').update({winner}).eq('id',match.id)
        }else await supabase.from('matches').update({winner}).eq('id',match.id)

        const {error:pe}=await supabase.rpc('process_match_results',{p_match_id:match.id})
        if(pe)log.push('PTS ERR: '+pe.message);else log.push('PTS OK: '+match.id)
        const {error:be}=await supabase.rpc('award_badges',{p_match_id:match.id})
        if(be)log.push('BADGE ERR: '+be.message);else log.push('BADGE OK: '+match.id)

        await new Promise(r=>setTimeout(r,3000))

        const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://flipseer.com'
        try{const r=await fetch(origin+'/api/notify-result',{method:'POST',headers:{'Content-Type':'application/json','x-cron-secret':process.env.CRON_SECRET||''},body:JSON.stringify({match_id:match.id})});log.push(r.ok?'NOTIFY OK':'NOTIFY FAIL: '+r.status)}catch(e:any){log.push('NOTIFY ERR: '+e.message)}
        try{const r=await fetch(origin+'/api/cron/auto-post?match_id='+match.id,{method:'GET',headers:{authorization:'Bearer '+(process.env.CRON_SECRET||'')}});log.push(r.ok?'SOCIAL OK':'SOCIAL FAIL: '+r.status)}catch(e:any){log.push('SOCIAL ERR: '+e.message)}
        try{const r=await fetch(origin+'/api/telegram/results',{method:'GET',headers:{'x-cron-secret':process.env.CRON_SECRET||''}});log.push(r.ok?'TG RESULT OK':'TG RESULT FAIL: '+r.status)}catch(e:any){log.push('TG RESULT ERR: '+e.message)}
      }

      if(abandoned&&match.status!=='completed'){
        await supabase.from('matches').update({status:'cancelled'}).eq('id',match.id)
        log.push('CANCELLED: '+match.home_team+' ('+st+')')
      }
    }

    const toCut=new Date(now.getTime()-3.5*60*60*1000).toISOString()
    const {data:stuck}=await supabase.from('matches').select('id,home_team,away_team,home_score,away_score').in('status',['live','locked']).lt('kickoff',toCut)
    for(const m of stuck||[]){
      const h=m.home_score??0,a=m.away_score??0
      await supabase.from('matches').update({status:'completed',winner:h>a?'home':a>h?'away':'draw'}).eq('id',m.id)
      log.push('TIMEOUT: '+m.home_team+' vs '+m.away_team)
    }

    log.push('Done: '+new Date().toISOString())
    return NextResponse.json({ok:true,log})
  }catch(err:any){
    log.push('FATAL: '+err.message)
    return NextResponse.json({ok:false,log,error:err.message},{status:500})
  }
}
