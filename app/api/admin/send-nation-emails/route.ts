// One-time script — run via: 
// https://flipseer.com/api/admin/send-nation-emails?secret=flipseer2026
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const USERS = [
  { email: 'toluajayi283@gmail.com', username: 'ajayi_tolu_don__9329', pts: 72, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'faroukibrahim994@gmail.com', username: 'farouk_ibrahim_2866', pts: 32, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'obimax58@gmail.com', username: 'obi_max_7071', pts: 20, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'okaforemeka006@gmail.com', username: 'emeka_okafor_3736', pts: 20, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'kennyremi11@gmail.com', username: 'kenny_remi_6360', pts: 10, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'akpobisamson@gmail.com', username: 'akpobi_samson_6262', pts: 10, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'preciousnigerianguy@gmail.com', username: 'gabriel_ajayi_9947', pts: 0, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'ajayitolu99@gmail.com', username: 'ajayi_tolu_2015', pts: 0, nation: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  { email: 'richmondquansah714@gmail.com', username: 'richmond_quansa_7081', pts: 14, nation: 'Ghana', flag: '🇬🇭', code: 'GH' },
  { email: 'idadzie343@gmail.com', username: 'isaac_dadzie_3633', pts: 12, nation: 'Ghana', flag: '🇬🇭', code: 'GH' },
  { email: 'isaackwesiakyinbarack97@gmail.com', username: 'isaac_kwesi_aky_3394', pts: 0, nation: 'Ghana', flag: '🇬🇭', code: 'GH' },
  { email: 'agongvincent92@gmail.com', username: 'vincent_agong_9937', pts: 0, nation: 'Ghana', flag: '🇬🇭', code: 'GH' },
  { email: 'eswarmanoj123@gmail.com', username: 'bharti_manoj_7638', pts: 32, nation: 'India', flag: '🇮🇳', code: 'IN' },
  { email: 'dare2dream212@gmail.com', username: 'sheik_tausif_sa_8740', pts: 20, nation: 'India', flag: '🇮🇳', code: 'IN' },
  { email: 'nsunuwar98@gmail.com', username: 'nabin_sunuwar_2419', pts: 0, nation: 'India', flag: '🇮🇳', code: 'IN' },
  { email: 'gichuhipeter79@gmail.com', username: 'gichuhipeter79_59ed', pts: 48, nation: 'Kenya', flag: '🇰🇪', code: 'KE' },
  { email: 'kmwirigi09@gmail.com', username: 'kelvin_mwirigi_3211', pts: 0, nation: 'Kenya', flag: '🇰🇪', code: 'KE' },
  { email: 'shawntavares678@gmail.com', username: 'shawn_tavares_8908', pts: 28, nation: null, flag: '🌍', code: null },
  { email: 'godzwilly69@gmail.com', username: 'godzwilly69_89e4', pts: 10, nation: null, flag: '🌍', code: null },
  { email: 'ahmadyerokuranga@gmail.com', username: 'ahmad_yero_kura_2909', pts: 12, nation: null, flag: '🌍', code: null },
  { email: 'winterbutter587@gmail.com', username: 'winter_butter_4442', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'mamondoljun52@gmail.com', username: 'jun_mamondol_2299', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'jessicanovax013@gmail.com', username: 'jessica_novax_5510', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'willsmithjames59@gmail.com', username: 'willsmithjames59_2ba6', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'markcisco32@gmail.com', username: 'mark_cisco_2527', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'jioj8153@gmail.com', username: 'jioj8153', pts: 0, nation: null, flag: '🌍', code: null },
  { email: 'agongvincent92@gmail.com', username: 'vincent_agong_9937', pts: 0, nation: null, flag: '🌍', code: null },
]

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  let sent = 0
  const results = []

  for (const user of USERS) {
    const hasNation = !!user.nation
    const subject = hasNation
      ? `${user.flag} @${user.username} — Your ${user.pts} reputation points aren't counting for ${user.nation} yet`
      : `🌍 @${user.username} — Set your nation on Flipseer`

    const bodyText = hasNation
      ? `You have ${user.pts} reputation points on Flipseer — but they are not contributing to ${user.nation} in the Nation Battle yet.\n\n${user.nation} needs you. Set your nation now and every correct prediction earns points for ${user.nation} globally.`
      : `You are on Flipseer but have not set your nation yet.\n\nEvery correct prediction earns points for your country in the global Nation Battle. Right now your predictions are not counting for anyone.`

    const leagueLine = user.code === 'GH'
      ? 'Ghana Premier League is live now.'
      : user.code === 'IN'
      ? 'ISL India launches October 10.'
      : user.code === 'NG'
      ? 'Nigeria fans are joining every day.'
      : ''

    try {
      await resend.emails.send({
        from: 'Flipseer <noreply@flipseer.com>',
        to: user.email,
        subject,
        html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0D1F0F;color:white;padding:0">
  <div style="background:linear-gradient(135deg,#1A0B2E,#4C1D95);padding:24px 32px;text-align:center">
    <div style="font-size:11px;color:#C4B5FD;font-weight:bold;letter-spacing:3px;margin-bottom:8px">⚽ FLIPSEER · NATION BATTLE</div>
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0;color:white">${user.flag} Represent Your Nation</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 16px">Hi @${user.username},</p>
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 16px">${bodyText}</p>
    ${leagueLine ? `<p style="font-size:14px;color:#F59E0B;margin:0 0 20px">${leagueLine}</p>` : ''}
    <div style="background:#0D2B14;border:1px solid #8B5CF6;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="font-size:13px;color:#C4B5FD;margin:0 0 4px;font-weight:bold">Your current reputation</p>
      <p style="font-size:28px;font-weight:bold;color:white;font-family:Georgia,serif;margin:0">${user.pts} REP</p>
      <p style="font-size:12px;color:#6B7280;margin:4px 0 0">Not yet contributing to any nation</p>
    </div>
    <div style="text-align:center">
      <a href="https://flipseer.com/profile#country-selector"
        style="display:inline-block;background:#8B5CF6;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:bold;box-shadow:0 0 20px rgba(139,92,246,0.3)">
        ${user.flag} Set Your Nation — 10 seconds →
      </a>
    </div>
    <p style="font-size:11px;color:#4B5563;text-align:center;margin-top:16px">Free forever · No betting · No card required</p>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #1A3A1A;text-align:center">
    <p style="font-size:11px;color:#4B5563;margin:0">© 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${user.email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a></p>
  </div>
</div>`,
      })
      sent++
      results.push({ email: user.email, username: user.username, status: 'sent' })
    } catch (e: any) {
      results.push({ email: user.email, username: user.username, status: 'failed', error: e.message })
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200))
  }

  return NextResponse.json({ sent, total: USERS.length, results })
}
