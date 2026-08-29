import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const maxDuration = 60

// ── Active competitions — add UCL 2026/27 on Sep 17 ──
const ACTIVE_COMPETITIONS = [
  'EPL 2026/27',
  'UCL 2026/27',
  'Liga 1 2026/27',
  'NPFL 2026/27',
  'Ghana PL 2026/27',
]

const COMPETITION_META: { [key: string]: { emoji: string; label: string; color: string } } = {
  'EPL 2026/27':      { emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'Premier League 2026/27',     color: '#8B5CF6' },
  'UCL 2026/27':      { emoji: '⭐',           label: 'UEFA Champions League',      color: '#A78BFA' },
  'Liga 1 2026/27':   { emoji: '🇮🇩',           label: 'Liga 1 Indonesia 2026/27',   color: '#EF4444' },
  'NPFL 2026/27':     { emoji: '🇳🇬',           label: 'NPFL Nigeria 2026/27',       color: '#2E9E5E' },
  'Ghana PL 2026/27': { emoji: '🇬🇭',           label: 'Ghana Premier League',       color: '#F59E0B' },
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = request.headers.get('x-vercel-cron-signature') !== null
      || request.headers.get('user-agent')?.includes('vercel')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const in2h = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const in2h10 = new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000)
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .in('competition', ACTIVE_COMPETITIONS)
      .gte('kickoff', in2h.toISOString())
      .lte('kickoff', in2h10.toISOString())
    if (!matches?.length) {
      return NextResponse.json({ sent: 0, message: 'No matches in window' })
    }
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError
    const { data: profiles } = await supabase.from('profiles').select('id, username, country')
    const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? [])
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    let sent = 0
    const errors: string[] = []

    for (const match of matches) {
      const meta = COMPETITION_META[match.competition] || { emoji: '⚽', label: match.competition, color: '#8B5CF6' }

      // For local competitions — only notify users from that country
      const targetCountries: { [key: string]: string[] } = {
        'Liga 1 2026/27':   ['ID'],
        'NPFL 2026/27':     ['NG'],
        'Ghana PL 2026/27': ['GH'],
      }
      const countryFilter = targetCountries[match.competition]

      const validUsers = (users ?? []).filter(u => {
        if (!u.email) return false
        if (countryFilter) {
          const profile = profileMap.get(u.id)
          return profile && countryFilter.includes((profile as any).country)
        }
        return true // EPL and UCL — notify everyone
      })

      for (const user of validUsers) {
        const profile = profileMap.get(user.id) as any
        const username = profile?.username || 'Forecaster'
        let attempt = 0
        while (attempt < 3) {
          try {
            await resend.emails.send({
              from: 'Flipseer <noreply@flipseer.com>',
              to: user.email!,
              subject: `${meta.emoji} ${match.home_team} vs ${match.away_team} — 2 hours to predict!`,
              html: `
                <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
                  <div style="text-align:center;margin-bottom:24px;">
                    <h1 style="color:${meta.color};font-family:Georgia,serif;margin:0">${meta.emoji} Flipseer</h1>
                    <p style="color:#6B7280;font-size:12px;margin:4px 0 0;letter-spacing:1px">${meta.label}</p>
                  </div>
                  <p style="color:#9CA3AF;">Hi @${username},</p>
                  <h2 style="color:white;font-family:Georgia,serif;">${match.home_team} vs ${match.away_team}</h2>
                  <div style="background:#0D2B14;border:1px solid ${meta.color};border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
                    <p style="color:${meta.color};font-weight:bold;margin:0;">⏱ Predictions close in 2 hours!</p>
                  </div>
                  <p style="color:#9CA3AF;font-size:14px;">Once the match kicks off, predictions are locked forever. Don't miss your chance to call it.</p>
                  <a href="https://flipseer.com/predict"
                     style="display:block;background:${meta.color};color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin-top:20px;">
                    Lock In My Prediction →
                  </a>
                  <p style="color:#4B5563;font-size:11px;text-align:center;margin-top:24px;">
                    © 2026 Flipseer · Pure football reputation. No betting. Ever.
                  </p>
                </div>
              `,
            })
            sent++
            break
          } catch (err: any) {
            const isRateLimit = err?.statusCode === 429 || String(err?.message).includes('429') || String(err?.message).toLowerCase().includes('rate limit')
            if (isRateLimit && attempt < 2) {
              attempt++
              await new Promise(resolve => setTimeout(resolve, 1000))
              continue
            }
            errors.push(`${user.email}: ${err.message}`)
            break
          }
        }
        await new Promise(resolve => setTimeout(resolve, 250))
      }
    }
    return NextResponse.json({
      sent,
      errors: errors.length > 0 ? errors : undefined,
      message: `✅ Sent ${sent} notifications`
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
