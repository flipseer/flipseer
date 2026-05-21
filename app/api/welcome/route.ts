import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, LIMITS } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    
    // ── Rate limit welcome emails ──
    const limit = rateLimit(`welcome:${ip}`, LIMITS.WELCOME)
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { email, username } = await req.json();
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Flipseer <noreply@flipseer.com>',
      to: email,
      subject: '⚽ Welcome to Flipseer — Your Football Legacy Starts Now',
      html: `
        <div style="background:#0D1F0F;padding:40px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:48px;margin-bottom:12px">⚽</div>
            <h1 style="font-family:Georgia,serif;color:#2E9E5E;font-size:32px;margin:0 0 8px">Welcome, @${username}!</h1>
            <p style="color:#9CA3AF;font-size:16px;margin:0">Your football reputation starts today.</p>
          </div>
          <div style="background:#0D2B14;border:1px solid #2E9E5E;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center">
            <p style="color:#2E9E5E;font-size:13px;font-weight:bold;letter-spacing:2px;margin:0 0 8px">WORLD CUP 2026</p>
            <p style="color:white;font-size:18px;font-weight:bold;margin:0 0 8px">⏱ June 11 — The whistle blows</p>
            <p style="color:#6B7280;font-size:13px;margin:0">64 matches to predict before kick-off</p>
          </div>
          <a href="https://flipseer.com/predict" style="display:block;background:#1A7A4A;color:white;padding:18px;border-radius:10px;text-align:center;text-decoration:none;font-weight:bold;font-size:17px;margin-bottom:24px">
            Make Your First Prediction →
          </a>
          <div style="border-top:1px solid #1A7A4A;padding-top:20px;text-align:center">
            <p style="color:#4B5563;font-size:11px;margin:0">
              © 2026 Flipseer · Pure football reputation. No betting. Ever.<br/>
              <a href="https://flipseer.com" style="color:#2E9E5E;text-decoration:none">flipseer.com</a>
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
