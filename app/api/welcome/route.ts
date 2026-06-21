import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, LIMITS } from '@/lib/rate-limit';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    const limit = rateLimit(`welcome:${ip}`, LIMITS.WELCOME);
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { email, username, country } = await req.json();
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Country flag map for email
    const FLAG: { [key: string]: string } = {
      'IN': '🇮🇳', 'ID': '🇮🇩', 'NG': '🇳🇬', 'BR': '🇧🇷',
      'AR': '🇦🇷', 'GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'US': '🇺🇸', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'ES': '🇪🇸', 'PT': '🇵🇹', 'MX': '🇲🇽',
      'GH': '🇬🇭', 'MA': '🇲🇦', 'JP': '🇯🇵', 'ZA': '🇿🇦',
      'KR': '🇰🇷', 'AU': '🇦🇺', 'CA': '🇨🇦', 'CO': '🇨🇴',
      'EG': '🇪🇬', 'SA': '🇸🇦', 'PK': '🇵🇰', 'BD': '🇧🇩',
      'TR': '🇹🇷', 'HR': '🇭🇷', 'SE': '🇸🇪', 'NO': '🇳🇴',
    };
    const flag = FLAG[country] || '🌍';
    const hasCountry = country && FLAG[country];

    await resend.emails.send({
      from: 'Flipseer <noreply@flipseer.com>',
      to: email,
      subject: `⚽ Welcome to Flipseer, @${username} — Your football record starts now`,
      html: `
        <div style="background:#0D1F0F;padding:40px 32px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:16px">

          <!-- HEADER -->
          <div style="text-align:center;margin-bottom:28px">
            <div style="font-size:48px;margin-bottom:12px">⚽</div>
            <h1 style="font-family:Georgia,serif;color:#2E9E5E;font-size:28px;margin:0 0 8px">Welcome, @${username}!</h1>
            <p style="color:#9CA3AF;font-size:15px;margin:0">Your permanent football reputation starts right now.</p>
          </div>

          <!-- LIVE BADGE -->
          <div style="background:#0D2B14;border:1px solid #2E9E5E;border-radius:12px;padding:20px;margin-bottom:20px;text-align:center">
            <p style="color:#EF4444;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 8px">⚡ WORLD CUP 2026 · LIVE NOW · DAY 11</p>
            <p style="color:white;font-size:17px;font-weight:bold;margin:0 0 8px">
              ${hasCountry ? `${flag} You're representing ${FLAG[country] ? country : 'your nation'}` : '🌍 Represent your nation'}
            </p>
            <p style="color:#6B7280;font-size:13px;margin:0">
              Round of 32 starts June 28 — knockout predictions open now.
            </p>
          </div>

          <!-- HOW IT WORKS -->
          <div style="margin-bottom:20px">
            <p style="color:#6B7280;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 12px">HOW IT WORKS</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                { icon: '🎯', title: 'Pick the outcome', desc: 'Home win, Draw, or Away win before kickoff' },
                { icon: '📊', title: 'Set your confidence', desc: 'How sure are you? 1-100%. Affects your points.' },
                { icon: '🔒', title: 'It locks forever', desc: 'Once the whistle blows — your call is permanent.' },
                { icon: '⚡', title: 'Earn points', desc: 'Correct calls earn points for you AND your nation.' },
              ].map(({ icon, title, desc }) => `
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:40px;font-size:22px">${icon}</td>
                  <td style="padding:8px 0 8px 8px;vertical-align:top;border-bottom:1px solid #1A3A1A">
                    <div style="color:white;font-weight:bold;font-size:14px;margin-bottom:2px">${title}</div>
                    <div style="color:#6B7280;font-size:12px">${desc}</div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          <!-- CTA -->
          <a href="https://flipseer.com/predict?utm_source=welcome_email&utm_medium=email&utm_campaign=signup"
            style="display:block;background:#1A7A4A;color:white;padding:18px;border-radius:10px;text-align:center;text-decoration:none;font-weight:bold;font-size:17px;margin-bottom:20px;box-shadow:0 0 20px rgba(46,158,94,0.3)">
            ⚽ Make Your First Prediction →
          </a>

          <!-- COMING NEXT -->
          <div style="background:#0D2B14;border:1px solid #1A3A1A;border-radius:12px;padding:16px;margin-bottom:20px">
            <p style="color:#6B7280;font-size:10px;font-weight:bold;letter-spacing:2px;margin:0 0 12px">YOUR RECORD CONTINUES AFTER WORLD CUP</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;padding:4px">
                  <div style="color:#2E9E5E;font-size:20px">🏆</div>
                  <div style="color:#2E9E5E;font-size:11px;font-weight:bold">World Cup</div>
                  <div style="color:#4B5563;font-size:10px">LIVE</div>
                </td>
                <td style="text-align:center;color:#1A3A1A;font-size:18px">→</td>
                <td style="text-align:center;padding:4px">
                  <div style="color:#8B5CF6;font-size:20px">🏴</div>
                  <div style="color:#8B5CF6;font-size:11px;font-weight:bold">EPL</div>
                  <div style="color:#4B5563;font-size:10px">Aug 16</div>
                </td>
                <td style="text-align:center;color:#1A3A1A;font-size:18px">→</td>
                <td style="text-align:center;padding:4px">
                  <div style="color:#F59E0B;font-size:20px">⭐</div>
                  <div style="color:#F59E0B;font-size:11px;font-weight:bold">UCL</div>
                  <div style="color:#4B5563;font-size:10px">Sep 2026</div>
                </td>
                <td style="text-align:center;color:#1A3A1A;font-size:18px">→</td>
                <td style="text-align:center;padding:4px">
                  <div style="color:#EF4444;font-size:20px">🇪🇸</div>
                  <div style="color:#EF4444;font-size:11px;font-weight:bold">La Liga</div>
                  <div style="color:#4B5563;font-size:10px">Oct 2026</div>
                </td>
              </tr>
            </table>
            <p style="color:#4B5563;font-size:11px;text-align:center;margin:12px 0 0">One permanent record. Every competition. Forever.</p>
          </div>

          <!-- FOOTER -->
          <div style="border-top:1px solid #1A3A1A;padding-top:16px;text-align:center">
            <p style="color:#4B5563;font-size:11px;margin:0">
              © 2026 Flipseer · Pure football reputation. No betting. Ever.<br/>
              <a href="https://flipseer.com" style="color:#2E9E5E;text-decoration:none">flipseer.com</a>
              &nbsp;·&nbsp;
              <a href="https://flipseer.com/profile" style="color:#6B7280;text-decoration:none">Your profile</a>
              &nbsp;·&nbsp;
              <a href="https://flipseer.com/nations" style="color:#6B7280;text-decoration:none">Nation Battle</a>
            </p>
          </div>

        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
