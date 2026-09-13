import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const USERS = [
  { email: 'rasgma4@gmail.com', username: 'ras_gma_9246', pts: 0, nation: null, flag: '🌍' },
  { email: 'domprehrichard09@gmail.com', username: 'richard_dompreh_1695', pts: 0, nation: 'Ghana', flag: '🇬🇭' },
  { email: 'mmunene850@gmail.com', username: 'moses_mirangu_0204', pts: 0, nation: 'Kenya', flag: '🇰🇪' },
  { email: 'whitedanny815@gmail.com', username: 'danny_white_9993', pts: 0, nation: null, flag: '🌍' },
  { email: 'steveototo91@gmail.com', username: 'steve_ototo_1282', pts: 10, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'opeyemibamideleadedotun@gmail.com', username: 'opeyemi_bamidel_9211', pts: 0, nation: 'Nigeria', flag: '🇳🇬' },
  { email: 'joshuaadu833@gmail.com', username: 'joshua_adu_4869', pts: 0, nation: 'Ghana', flag: '🇬🇭' },
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
      ? `${user.flag} @${user.username} — Your predictions aren't counting for ${user.nation} yet`
      : `🌍 @${user.username} — Set your nation on Flipseer`

    const bodyText = hasNation
      ? `You have ${user.pts} reputation points on Flipseer — but they are not contributing to ${user.nation} in the Nation Battle yet. Set your nation now and every correct prediction earns points for ${user.nation} globally.`
      : `You are on Flipseer but have not set your nation yet. Every correct prediction earns points for your country in the global Nation Battle.`

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
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 20px">${bodyText}</p>
    <div style="background:#0D2B14;border:1px solid #8B5CF6;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="font-size:13px;color:#C4B5FD;margin:0 0 4px;font-weight:bold">Your current reputation</p>
      <p style="font-size:28px;font-weight:bold;color:white;font-family:Georgia,serif;margin:0">${user.pts} REP</p>
      <p style="font-size:12px;color:#6B7280;margin:4px 0 0">Not yet contributing to any nation</p>
    </div>
    <div style="text-align:center">
      <a href="https://flipseer.com/profile#country-selector"
        style="display:inline-block;background:#8B5CF6;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:bold">
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
    await new Promise(r => setTimeout(r, 200))
  }

  return NextResponse.json({ sent, total: USERS.length, results })
}
