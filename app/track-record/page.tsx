import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prediction Track Record | Flipseer',
  description: 'Flipseer\'s public prediction accuracy record — updated after every match result. See how our community performs across EPL, UCL, Liga 1, ISL and Ghana PL.',
}

export const revalidate = 3600 // revalidate every hour

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getOverallStats() {
  const { data } = await supabase.rpc('get_track_record_overall')
  if (data) return data
  // fallback: direct query
  const { data: rows } = await supabase
    .from('predictions')
    .select('prediction_processed, points_earned, confidence_pct')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  if (!rows) return null
  const processed = rows.filter(r => r.prediction_processed)
  const correct = processed.filter(r => r.points_earned > 0)
  const avgConf = processed.length
    ? Math.round(processed.reduce((s, r) => s + (r.confidence_pct || 0), 0) / processed.length * 10) / 10
    : 0
  const totalPts = processed.reduce((s, r) => s + (r.points_earned || 0), 0)
  return {
    total_processed: processed.length,
    correct: correct.length,
    accuracy_pct: processed.length ? Math.round(correct.length / processed.length * 1000) / 10 : 0,
    avg_confidence: avgConf,
    total_points_awarded: totalPts,
  }
}

async function getByCompetition() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: preds } = await supabase
    .from('predictions')
    .select('match_id, prediction_processed, points_earned')
    .eq('prediction_processed', true)
    .gte('created_at', thirtyDaysAgo)
  if (!preds || preds.length === 0) return []

  const matchIds = Array.from(new Set(preds.map(p => p.match_id)))
  const { data: matches } = await supabase
    .from('matches')
    .select('id, competition')
    .in('id', matchIds)
  if (!matches) return []

  const matchMap: Record<number, string> = {}
  matches.forEach(m => { matchMap[m.id] = m.competition })

  const compMap: Record<string, { total: number; correct: number }> = {}
  preds.forEach(p => {
    const comp = matchMap[p.match_id] || 'Unknown'
    if (!compMap[comp]) compMap[comp] = { total: 0, correct: 0 }
    compMap[comp].total++
    if (p.points_earned > 0) compMap[comp].correct++
  })

  return Object.entries(compMap)
    .map(([competition, s]) => ({
      competition,
      total: s.total,
      correct: s.correct,
      accuracy_pct: Math.round(s.correct / s.total * 1000) / 10,
    }))
    .sort((a, b) => b.total - a.total)
}

async function getByOutcome() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('predictions')
    .select('predicted_outcome, prediction_processed, points_earned')
    .eq('prediction_processed', true)
    .gte('created_at', thirtyDaysAgo)
  if (!data) return []

  const map: Record<string, { total: number; correct: number }> = {}
  data.forEach(r => {
    const o = r.predicted_outcome || 'unknown'
    if (!map[o]) map[o] = { total: 0, correct: 0 }
    map[o].total++
    if (r.points_earned > 0) map[o].correct++
  })

  return Object.entries(map).map(([outcome, s]) => ({
    outcome,
    total: s.total,
    correct: s.correct,
    accuracy_pct: Math.round(s.correct / s.total * 1000) / 10,
  })).sort((a, b) => b.total - a.total)
}

async function getWeeklyTrend() {
  const eightWeeksAgo = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('predictions')
    .select('created_at, prediction_processed, points_earned')
    .eq('prediction_processed', true)
    .gte('created_at', eightWeeksAgo)
    .order('created_at', { ascending: true })
  if (!data) return []

  const weekMap: Record<string, { total: number; correct: number }> = {}
  data.forEach(r => {
    const d = new Date(r.created_at)
    const day = d.getDay()
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((day + 6) % 7))
    monday.setHours(0, 0, 0, 0)
    const key = monday.toISOString().slice(0, 10)
    if (!weekMap[key]) weekMap[key] = { total: 0, correct: 0 }
    weekMap[key].total++
    if (r.points_earned > 0) weekMap[key].correct++
  })

  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, s]) => ({
      week,
      label: new Date(week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      total: s.total,
      accuracy_pct: Math.round(s.correct / s.total * 1000) / 10,
    }))
}

const COMP_META: Record<string, { flag: string; color: string }> = {
  'EPL 2026/27':      { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#8B5CF6' },
  'UCL 2026/27':      { flag: '⭐',           color: '#A78BFA' },
  'Liga 1 2026/27':   { flag: '🇮🇩',          color: '#CE1126' },
  'ISL 2026/27':      { flag: '🇮🇳',          color: '#FF6B35' },
  'Ghana PL 2026/27': { flag: '🇬🇭',          color: '#F59E0B' },
}

const OUTCOME_META: Record<string, { label: string; color: string }> = {
  home:  { label: 'Home Win', color: '#2E9E5E' },
  away:  { label: 'Away Win', color: '#EF4444' },
  draw:  { label: 'Draw',     color: '#F59E0B' },
}

function pctColor(pct: number) {
  if (pct >= 50) return '#2E9E5E'
  if (pct >= 40) return '#8B5CF6'
  return '#EF4444'
}

export default async function TrackRecordPage() {
  const [overall, byComp, byOutcome, weekly] = await Promise.all([
    getOverallStats(),
    getByCompetition(),
    getByOutcome(),
    getWeeklyTrend(),
  ])

  const maxWeeklyPct = Math.max(...weekly.map(w => w.accuracy_pct), 60)

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ backgroundColor: '#050E05', borderBottom: '1px solid #1A3A1A', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 800, color: '#8B5CF6', textDecoration: 'none', letterSpacing: '-.5px' }}>⚽ FLIPSEER</a>
        <a href="/predict" style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'none' }}>Predict Now →</a>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)', padding: 'clamp(40px,8vw,64px) 20px 40px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '999px', padding: '5px 16px', marginBottom: '20px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 700, letterSpacing: '1.5px' }}>LIVE TRACK RECORD · LAST 30 DAYS</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px' }}>
            Our <span style={{ color: '#8B5CF6' }}>Prediction</span> Track Record
          </h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF', maxWidth: '480px', margin: '0 auto' }}>
            Every call logged. Every result verified. This is Flipseer&apos;s public accuracy record — updated after every match.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

        {/* STAT GRID */}
        {overall && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '10px', paddingTop: '32px' }}>
            {[
              { label: 'Overall Accuracy', value: `${overall.accuracy_pct}%`, sub: `${overall.correct} correct of ${overall.total_processed}`, color: '#2E9E5E' },
              { label: 'Predictions Made', value: String(overall.total_processed), sub: 'last 30 days', color: '#8B5CF6' },
              { label: 'Avg Confidence', value: `${overall.avg_confidence}%`, sub: 'user-set confidence', color: '#F59E0B' },
              { label: 'Rep Points Awarded', value: String(overall.total_points_awarded), sub: 'total earned', color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '12px', padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 900, lineHeight: 1, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* BY COMPETITION */}
        {byComp.length > 0 && (
          <div style={{ paddingTop: '32px' }}>
            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Accuracy by Competition</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {byComp.map(c => {
                const meta = COMP_META[c.competition] || { flag: '⚽', color: '#8B5CF6' }
                return (
                  <div key={c.competition} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{meta.flag} {c.competition}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{c.correct} correct of {c.total}</div>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: meta.color }}>{c.accuracy_pct}%</div>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.accuracy_pct}%`, backgroundColor: meta.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BY OUTCOME */}
        {byOutcome.length > 0 && (
          <div style={{ paddingTop: '32px' }}>
            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Accuracy by Predicted Outcome</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {byOutcome.map(o => {
                const meta = OUTCOME_META[o.outcome] || { label: o.outcome, color: '#8B5CF6' }
                return (
                  <div key={o.outcome} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '16px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>{meta.label}</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 900, color: meta.color }}>{o.accuracy_pct}%</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px' }}>{o.correct} of {o.total}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* WEEKLY TREND */}
        {weekly.length > 0 && (
          <div style={{ paddingTop: '32px' }}>
            <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Weekly Accuracy Trend</div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '12px', padding: '20px 16px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', minWidth: '400px', height: '120px' }}>
                {weekly.map(w => {
                  const heightPct = (w.accuracy_pct / maxWeeklyPct) * 100
                  const color = pctColor(w.accuracy_pct)
                  return (
                    <div key={w.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color }}>{w.accuracy_pct}%</div>
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${heightPct}%`, minHeight: '4px', backgroundColor: color + '22', border: `1px solid ${color}60`, borderBottom: 'none', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      <div style={{ fontSize: '9px', color: '#6B7280', whiteSpace: 'nowrap' }}>{w.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* FOOTNOTE */}
        <div style={{ paddingTop: '24px', paddingBottom: '48px', marginTop: '32px', borderTop: '1px solid #1A3A1A', textAlign: 'center', fontSize: '11px', color: '#6B7280' }}>
          Data updates after every processed match result. Accuracy = predictions with points earned &gt; 0 ÷ total processed predictions.{' '}
          <a href="/predict" style={{ color: '#8B5CF6', textDecoration: 'none' }}>Start predicting →</a>
        </div>

      </div>
    </main>
  )
}
