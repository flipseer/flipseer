import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Users without country set who have predictions
const ACTIVE_USERS = [
  { email: 'toluajayi283@gmail.com', username: 'ajayi_tolu_don__9329', preds: 19 },
  { email: 'gichuhipeter79@gmail.com', username: 'gichuhipeter79_59ed', preds: 8 },
  { email: 'dare2dream212@gmail.com', username: 'sheik_tausif_sa_8740', preds: 7 },
  { email: 'shawntavares678@gmail.com', username: 'shawn_tavares_8908', preds: 7 },
  { email: 'obimax58@gmail.com', username: 'obi_max_7071', preds: 6 },
  { email: 'akpobisamson@gmail.com', username: 'akpobi_samson_6262', preds: 5 },
  { email: 'faroukibrahim994@gmail.com', username: 'farouk_ibrahim_2866', preds: 4 },
  { email: 'domprehrichard09@gmail.com', username: 'richard_dompreh_1695', preds: 4 },
  { email: 'steveototo91@gmail.com', username: 'steve_ototo_1282', preds: 3 },
  { email: 'agongvincent92@gmail.com', username: 'vincent_agong_9937', preds: 3 },
  { email: 'jessicanovax013@gmail.com', username: 'jessica_novax_5510', preds: 2 },
  { email: 'eswarmanoj123@gmail.com', username: 'bharti_manoj_7638', preds: 2 },
  { email: 'ajayitolu99@gmail.com', username: 'ajayi_tolu_2015', preds: 2 },
  { email: 'willsmithjames59@gmail.com', username: 'willsmithjames59_2ba6', preds: 2 },
  { email: 'okaforemeka006@gmail.com', username: 'emeka_okafor_3736', preds: 2 },
  { email: 'mamondoljun52@gmail.com', username: 'jun_mamondol_2299', preds: 2 },
  { email: 'ej8310255@gmail.com', username: 'emmanuel_johnso_3955', preds: 1 },
  { email: 'jioj8153@gmail.com', username: 'jioj8153', preds: 1 },
  { email: 'ahmadyerokuranga@gmail.com', username: 'ahmad_yero_kura_2909', preds: 1 },
  { email: 'nsunuwar98@gmail.com', username: 'nabin_sunuwar_2419', preds: 1 },
  { email: 'idadzie343@gmail.com', username: 'isaac_dadzie_3633', preds: 1 },
  { email: 'kmwirigi09@gmail.com', username: 'kelvin_mwirigi_3211', preds: 1 },
  { email: 'winterbutter587@gmail.com', username: 'winter_butter_4442', preds: 1 },
  { email: 'richmondquansah714@gmail.com', username: 'richmond_quansa_7081', preds: 1 },
  { email: 'preciousnigerianguy@gmail.com', username: 'gabriel_ajayi_9947', preds: 1 },
  { email: 'isaackwesiakyinbarack97@gmail.com', username: 'isaac_kwesi_aky_3394', preds: 1 },
  { email: 'kennyremi11@gmail.com', username: 'kenny_remi_6360', preds: 1 },
  { email: 'gariosera@gmail.com', username: 'gario_sera_6528', preds: 1 },
  { email: 'bg1204869@gmail.com', username: 'boateng_godwin_4172', preds: 1 },
  { email: 'markcisco32@gmail.com', username: 'mark_cisco_2527', preds: 1 },
  { email: 'oyebamijiolalekan75@gmail.com', username: 'oyebamiji_olale_7621', preds: 1 },
  { email: 'kwamedu882@gmail.com', username: 'kwame_3235', preds: 1 },
  { email: 'sekafelix3@gmail.com', username: 'seka_flix_5660', preds: 1 },
  { email: 'janoscki7@gmail.com', username: 'janoscki_0556', preds: 1 },
  { email: 'godzwilly69@gmail.com', username: 'godzwilly69_89e4', preds: 1 },
  { email: 'mmunene850@gmail.com', username: 'moses_mirangu_0204', preds: 1 },
  { email: 'severinbella26@gmail.com', username: 'sverin_bella_2068', preds: 1 },
  { email: 'opeyemibamideleadedotun@gmail.com', username: 'opeyemi_bamidel_9211', preds: 1 },
]

// Inactive users — shorter re-engage email
const INACTIVE_USERS = [
  { email: 'edikan1992@gmail.com', username: 'victory_udo_0831' },
  { email: 'bemgbamartins@gmail.com', username: 'user_4949fdf1' },
  { email: 'mohammedvsims169@gmail.com', username: 'mohammed_vsims_5898' },
  { email: 'sundayabiodun781@gmail.com', username: 'sundayabiodun_1d8' },
  { email: 'maibampprem@gmail.com', username: 'maibam_prem_7817' },
  { email: 'kelvinhermanto@gmail.com', username: 'kelvin_natanael_0283' },
  { email: 'mosesbullet6@gmail.com', username: 'moses_bullet_0268' },
  { email: 'basseyfelix207@gmail.com', username: 'basseyfelix207_4132' },
  { email: 'agborsunday696@gmail.com', username: 'agbor_sunday_4881' },
  { email: 'favnsnsdn5@gmail.com', username: 'favnsnsdn5_2ebb' },
  { email: 'danjohn5511@gmail.com', username: 'daniel_john_pas_0229' },
  { email: 'boatenggodwin890@gamil.com', username: 'boatenggodwin890_bf3d' },
  { email: 'celeugwu64@gmail.com', username: 'ugwu_cele_0961' },
  { email: 'rasgma4@gmail.com', username: 'ras_gma_9246' },
  { email: 'anyaogujude87@gmail.com', username: 'anyaogujude87' },
  { email: 'ahmedokin@gmail.com', username: 'ahmedokin_5d30' },
  { email: 'ayodelefarotimi123@gmail.com', username: 'farotimi_ayodel_2786' },
  { email: 'whitedanny815@gmail.com', username: 'danny_white_9993' },
  { email: 'asmaroamar212@gmail.com', username: 'asmar_amar_5281' },
  { email: 'olalekanolusegunabiodun@gmail.com', username: 'olalekan_oluseg_0804' },
  { email: 'ahmedokin4@gmail.com', username: 'ahmedokin4_8793' },
  { email: 'abdullahibillal101@gmail.com', username: 'abdullahibillal_b717' },
  { email: 'oluwatobigutno1999@gmail.com', username: 'oluwatobi_gtuon_9932' },
  { email: 'ruttoronald1@gmail.com', username: 'ronald_rutto_3303' },
  { email: 'skviper52@gmail.com', username: 'viper_s3k3_4970' },
  { email: 'erichawei@gmail.com', username: 'erichawei_372b' },
  { email: 'fredsimiyu113@gmail.com', username: 'fred_simiyu_3664' },
  { email: 'lowk37935@gmail.com', username: 'low_key_8647' },
  { email: 'humbleboybassey@gmail.com', username: 'humbleboybassey_7673' },
  { email: 'kallahzakkayahaya@gmail.com', username: 'kallahzakkayahaya_6c04' },
  { email: 'akpomahlucky@gmail.com', username: 'akpomahlucky_c89e' },
  { email: 'joshuaadu833@gmail.com', username: 'joshua_adu_4869' },
  { email: 'viktorianusyukur058@gmail.com', username: 'viktorianusyukur058_6263' },
  { email: 'oscarpierre104@gmail.com', username: 'oscarpierre104_38fb' },
  { email: 'akaninyenegoodnews145@gmail.com', username: 'goodnews_akanin_9366' },
  { email: 'viveksanthanam88@gmail.com', username: 'viveksanthanam88' },
  { email: 'hassagunners88@gmail.com', username: 'ishaq_hassan_7918' },
  { email: 'emmyadam49@gmail.com', username: 'emmy_adam_8977' },
  { email: 'phemanth891@gmail.com', username: 'puneeth_gowda' },
  { email: 'amirshuaibu177@gmail.com', username: 'amirshuaibu177_bdd1' },
  { email: 'isaaclemas859@gmail.com', username: 'isaaclemas859_daee' },
  { email: 'fatimajablah742@gmail.com', username: 'fatima_jablah_4595' },
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

  // Send to active users — nation selection email
  for (const user of ACTIVE_USERS) {
    try {
      await resend.emails.send({
        from: 'Flipseer <noreply@flipseer.com>',
        to: user.email,
        subject: `@${user.username} — your predictions aren't counting for your nation yet`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0D1F0F;color:white;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#1A0B2E,#0D2B14);padding:32px;text-align:center;border-bottom:1px solid #2D1B69">
    <div style="font-size:48px;margin-bottom:12px">🌍</div>
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px;color:white">Your nation needs you</h1>
    <p style="font-size:13px;color:#C4B5FD;margin:0">Your predictions aren't earning nation REP yet</p>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 16px">Hi @${user.username},</p>
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 20px">
      You've made <strong style="color:#8B5CF6">${user.preds} prediction${user.preds !== 1 ? 's' : ''}</strong> on Flipseer. 
      But your nation isn't set — so none of your correct calls are earning REP points for your country in the global Nation Battle.
    </p>
    <div style="background:#0D2B14;border:1px solid #2D1B69;border-radius:12px;padding:16px 20px;margin-bottom:20px">
      <p style="font-size:12px;color:#8B5CF6;font-weight:bold;letter-spacing:1px;margin:0 0 12px">NATION BATTLE — CURRENT STANDINGS</p>
      ${[
        { flag: '🇮🇳', name: 'India', color: '#FF9933' },
        { flag: '🇳🇬', name: 'Nigeria', color: '#008751' },
        { flag: '🇬🇭', name: 'Ghana', color: '#F59E0B' },
        { flag: '🇮🇩', name: 'Indonesia', color: '#CE1126' },
      ].map(n => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-size:20px">${n.flag}</span>
        <span style="font-size:14px;color:white;font-weight:bold">${n.name}</span>
        <span style="margin-left:auto;font-size:11px;color:${n.color};font-weight:bold">Competing</span>
      </div>`).join('')}
    </div>
    <div style="background:#050E05;border:1px solid #8B5CF6;border-radius:8px;padding:12px 16px;margin-bottom:24px;text-align:center">
      <p style="font-size:13px;color:#8B5CF6;font-weight:bold;margin:0">
        Set your nation and every correct prediction earns REP for your country. Takes 10 seconds.
      </p>
    </div>
    <div style="text-align:center">
      <a href="https://flipseer.com/profile" 
        style="display:inline-block;background:#8B5CF6;color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold">
        🌍 Set My Nation →
      </a>
    </div>
    <p style="font-size:11px;color:#4B5563;text-align:center;margin-top:12px">Free forever · No betting · No card required</p>
  </div>
  <div style="padding:14px 32px;border-top:1px solid #1A3A1A;text-align:center">
    <p style="font-size:11px;color:#4B5563;margin:0">© 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${user.email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a></p>
  </div>
</div>`,
      })
      sent++
      results.push({ email: user.email, username: user.username, type: 'active', status: 'sent' })
    } catch (e: any) {
      results.push({ email: user.email, username: user.username, type: 'active', status: 'failed', error: e.message })
    }
    await new Promise(r => setTimeout(r, 150))
  }

  // Send to inactive users — re-engage + nation email
  for (const user of INACTIVE_USERS) {
    try {
      await resend.emails.send({
        from: 'Flipseer <noreply@flipseer.com>',
        to: user.email,
        subject: `@${user.username} — EPL matchday. Your first prediction is free.`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0D1F0F;color:white;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0A0014,#0D2B14);padding:32px;text-align:center;border-bottom:1px solid #1A2A1A">
    <div style="font-size:48px;margin-bottom:12px">⚽</div>
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px;color:white">EPL is live. Predict now.</h1>
    <p style="font-size:13px;color:#9CA3AF;margin:0">Lock your call before kickoff. Permanent record.</p>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 16px">Hi @${user.username},</p>
    <p style="font-size:15px;color:#9CA3AF;line-height:1.8;margin:0 0 20px">
      You joined Flipseer but haven't predicted yet. EPL, UCL, Liga 1 and Ghana PL matches are live right now.
    </p>
    <div style="background:#0D2B14;border:1px solid #1A3A1A;border-radius:12px;padding:16px 20px;margin-bottom:20px">
      <p style="font-size:12px;color:#6B7280;font-weight:bold;letter-spacing:1px;margin:0 0 10px">LIVE NOW</p>
      ${[
        { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'EPL 2026/27', color: '#8B5CF6' },
        { flag: '⭐', name: 'UCL 2026/27', color: '#A78BFA' },
        { flag: '🇮🇩', name: 'Liga 1 Indonesia', color: '#CE1126' },
        { flag: '🇬🇭', name: 'Ghana Premier League', color: '#F59E0B' },
      ].map(c => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-size:18px">${c.flag}</span>
        <span style="font-size:14px;color:white">${c.name}</span>
        <span style="margin-left:auto;font-size:10px;background:${c.color}20;color:${c.color};border:1px solid ${c.color}40;padding:2px 8px;border-radius:999px;font-weight:bold">LIVE</span>
      </div>`).join('')}
    </div>
    <div style="text-align:center;margin-bottom:16px">
      <a href="https://flipseer.com/predict"
        style="display:inline-block;background:#8B5CF6;color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold">
        ⚽ Make My First Prediction →
      </a>
    </div>
    <p style="font-size:12px;color:#4B5563;text-align:center">Free forever · No betting · No card required</p>
  </div>
  <div style="padding:14px 32px;border-top:1px solid #1A3A1A;text-align:center">
    <p style="font-size:11px;color:#4B5563;margin:0">© 2026 Flipseer · <a href="https://flipseer.com/unsubscribe?email=${user.email}" style="color:#4B5563;text-decoration:none">Unsubscribe</a></p>
  </div>
</div>`,
      })
      sent++
      results.push({ email: user.email, username: user.username, type: 'inactive', status: 'sent' })
    } catch (e: any) {
      results.push({ email: user.email, username: user.username, type: 'inactive', status: 'failed', error: e.message })
    }
    await new Promise(r => setTimeout(r, 150))
  }

  return NextResponse.json({
    sent,
    active_sent: results.filter(r => r.type === 'active' && r.status === 'sent').length,
    inactive_sent: results.filter(r => r.type === 'inactive' && r.status === 'sent').length,
    total: ACTIVE_USERS.length + INACTIVE_USERS.length,
    results
  })
}
