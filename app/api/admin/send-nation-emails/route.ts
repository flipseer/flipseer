import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const USERS = [
  { email: 'toluajayi283@gmail.com', username: 'ajayi_tolu_don__9329', pts: 72, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'gichuhipeter79@gmail.com', username: 'gichuhipeter79_59ed', pts: 48, nation: 'Kenya', flag: '🇰🇪' },
  { email: 'steveototo91@gmail.com', username: 'steve_ototo_1282', pts: 42, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'faroukibrahim994@gmail.com', username: 'farouk_ibrahim_2866', pts: 32, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'eswarmanoj123@gmail.com', username: 'bharti_manoj_7638', pts: 32, nation: 'India', flag: '🇮🇳' },
  { email: 'sekafelix3@gmail.com', username: 'seka_flix_5660', pts: 28, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'shawntavares678@gmail.com', username: 'shawn_tavares_8908', pts: 28, nation: null, flag: '🌍' },
  { email: 'obimax58@gmail.com', username: 'obi_max_7071', pts: 20, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'okaforemeka006@gmail.com', username: 'emeka_okafor_3736', pts: 20, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'dare2dream212@gmail.com', username: 'sheik_tausif_sa_8740', pts: 20, nation: 'India', flag: '🇮🇳' },
  { email: 'richmondquansah714@gmail.com', username: 'richmond_quansa_7081', pts: 14, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'bg1204869@gmail.com', username: 'boateng_godwin_4172', pts: 14, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'janoscki7@gmail.com', username: 'janoscki_0556', pts: 14, nation: null, flag: '🌍' },
  { email: 'ahmadyerokuranga@gmail.com', username: 'ahmad_yero_kura_2909', pts: 12, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'idadzie343@gmail.com', username: 'isaac_dadzie_3633', pts: 12, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'godzwilly69@gmail.com', username: 'godzwilly69_89e4', pts: 10, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'akpobisamson@gmail.com', username: 'akpobi_samson_6262', pts: 10, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'kennyremi11@gmail.com', username: 'kenny_remi_6360', pts: 10, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'domprehrichard09@gmail.com', username: 'richard_dompreh_1695', pts: 0, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'jioj8153@gmail.com', username: 'jioj8153', pts: 0, nation: null, flag: '🌍' },
  { email: 'jessicanovax013@gmail.com', username: 'jessica_novax_5510', pts: 0, nation: null, flag: '🌍' },
  { email: 'nsunuwar98@gmail.com', username: 'nabin_sunuwar_2419', pts: 0, nation: 'Nepal', flag: '🇳🇵' },
  { email: 'ajayitolu99@gmail.com', username: 'ajayi_tolu_2015', pts: 0, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'kmwirigi09@gmail.com', username: 'kelvin_mwirigi_3211', pts: 0, nation: 'Kenya', flag: '🇰🇪' },
  { email: 'winterbutter587@gmail.com', username: 'winter_butter_4442', pts: 0, nation: null, flag: '🌍' },
  { email: 'mamondoljun52@gmail.com', username: 'jun_mamondol_2299', pts: 0, nation: null, flag: '🌍' },
  { email: 'preciousnigerianguy@gmail.com', username: 'gabriel_ajayi_9947', pts: 0, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'isaackwesiakyinbarack97@gmail.com', username: 'isaac_kwesi_aky_3394', pts: 0, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'markcisco32@gmail.com', username: 'mark_cisco_2527', pts: 0, nation: null, flag: '🌍' },
  { email: 'agongvincent92@gmail.com', username: 'vincent_agong_9937', pts: 0, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'opeyemibamideleadedotun@gmail.com', username: 'opeyemi_bamidel_9211', pts: 0, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'mmunene850@gmail.com', username: 'moses_mirangu_0204', pts: 0, nation: 'Kenya', flag: '🇰🇪' },
  { email: 'willsmithjames59@gmail.com', username: 'willsmithjames59_2ba6', pts: 0, nation: null, flag: '🌍' },
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
      ? `${user.flag} @${user.username} — your ${user.pts} REP isn't counting for ${user.nation} yet`
      : `🌍 @${user.username} — set your nation on Flipseer`

    const intro = hasNation
      ? `You've earned <strong style="color:#8B5CF6">${user.pts} REP</strong> on Flipseer — but none of it is counting for ${user.nation} in the Nation Battle yet.`
      : `You're on Flipseer but haven't set your nation yet. Every correct prediction earns reputation points for your country in the global Nation Battle.`

    const cta = hasNation
      ? `${user.flag} Claim ${user.nation}'s Points →`
      : `🌍 Set My Nation — 10 seconds →`

    try {
      await resend.emails.send({
        from: 'Flipseer <noreply@flipseer.com>',
        to: user.email,
        subject,
        html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0D1F0F;color:white;padding:0;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#1A0B2E,#4C1D95);padding:28px 32px;text-align:center">
    <div style="font-size:11px;color:#C4B5FD;font-weight:bold;letter-spacing:3px;margin-bottom:8px">⚽ FLIPSEER · NATION BATTLE</div>
    <div style="font-size:40px;margin-bottom:8px">${user.flag}</div>
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0;color:white">Represent Your Nation</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 16px">Hi @${user.username},</p>
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 24px">${intro}</p>

    <div style="background:#0D2B14;border:1px solid #8B5CF6;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center">
      <p style="font-size:12px;color:#C4B5FD;margin:0 0 6px;font-weight:bold;letter-spacing:1px">YOUR REPUTATION</p>
      <p style="font-size:36px;font-weight:bold;color:white;font-family:Georgia,serif;margin:0 0 4px">${user.pts} REP</p>
      <p style="font-size:12px;color:#EF4444;margin:0">Not yet counting for any nation 🚫</p>
    </div>

    <div style="background:#0D2B14;border:1px solid #1A3A1A;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="font-size:13px;color:#9CA3AF;margin:0 0 10px;font-weight:bold">🌍 NATION BATTLE — Live Rankings</p>
      ${[
        { flag: '🇮🇳', name: 'India', rank: 1 },
        { flag: '🇮🇩', name: 'Indonesia', rank: 2 },
        { flag: '🇳🇬', name: 'Nigeria', rank: 3 },
      ].map(n => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1A3A1A">
        <span style="font-size:13px">${n.flag} ${n.name}</span>
        <span style="font-size:11px;color:#8B5CF6;font-weight:bold">#${n.rank}</span>
      </div>`).join('')}
      <p style="font-size:11px;color:#6B7280;margin:10px 0 0;text-align:center">Your nation could be here. Set it now.</p>
    </div>

    <div style="text-align:center">
      <a href="https://flipseer.com/profile"
        style="display:inline-block;background:#8B5CF6;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:bold;box-shadow:0 0 24px rgba(139,92,246,0.3)">
        ${cta}
      </a>
    </div>
    <p style="font-size:11px;color:#4B5563;text-align:center;margin-top:16px">Takes 10 seconds · Free forever · No betting</p>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #1A3A1A;text-align:center">
    <p style="font-size:11px;color:#4B5563;margin:0">© 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${user.email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a></p>
  </div>
</div>`,
      })
      sent++
      results.push({ email: user.email, username: user.username, nation: user.nation || 'unknown', status: 'sent' })
    } catch (e: any) {
      results.push({ email: user.email, username: user.username, status: 'failed', error: e.message })
    }
    await new Promise(r => setTimeout(r, 200))
  }

  return NextResponse.json({ sent, total: USERS.length, results })
}
