import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { type, to, data } = await request.json();

  let subject = '';
  let html = '';

  if (type === 'welcome') {
    subject = '⚽ Welcome to Flipseer — Build Your Football Legacy';
    html = `
      <div style="background:#0D1F0F;padding:40px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:12px;">
        <h1 style="color:#2E9E5E;font-size:28px;">⚽ Welcome to Flipseer, ${data.username}!</h1>
        <p style="color:#D1FAE5;font-size:16px;line-height:1.6;">
          Your permanent football forecasting record has begun. Every prediction you make from today 
          will be recorded forever — building your reputation as a football intelligence.
        </p>
        <div style="background:#0D2B14;border:1px solid #1A7A4A;border-radius:8px;padding:20px;margin:24px 0;">
          <p style="color:#2E9E5E;font-weight:bold;margin:0 0 8px;">World Cup 2026 starts in 24 days ⏰</p>
          <p style="color:#9CA3AF;margin:0;font-size:14px;">64 matches. Your chance to prove your football intelligence.</p>
        </div>
        <a href="https://flipseer.com/predict" style="display:inline-block;background:#1A7A4A;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
          Start Predicting Now →
        </a>
        <p style="color:#4B5563;font-size:12px;margin-top:32px;">
          Your profile: <a href="https://flipseer.com/u/${data.username}" style="color:#2E9E5E;">flipseer.com/u/${data.username}</a>
        </p>
      </div>
    `;
  }

  if (type === 'points_earned') {
    subject = `🎉 You earned ${data.points} points! — Flipseer`;
    html = `
      <div style="background:#0D1F0F;padding:40px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:12px;">
        <h1 style="color:#2E9E5E;font-size:28px;">🎉 ${data.points} points earned, ${data.username}!</h1>
        <p style="color:#D1FAE5;font-size:16px;">
          Your prediction for <strong>${data.match}</strong> was correct!
        </p>
        <div style="background:#0D2B14;border:1px solid #2E9E5E;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
          <div style="font-size:48px;font-weight:bold;color:#2E9E5E;">+${data.points}</div>
          <div style="color:#9CA3AF;font-size:14px;">reputation points added</div>
        </div>
        <a href="https://flipseer.com/u/${data.username}" style="display:inline-block;background:#1A7A4A;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Your Profile →
        </a>
      </div>
    `;
  }

  if (type === 'predict_reminder') {
    subject = `⏰ ${data.match} kicks off in 2 hours — predict now!`;
    html = `
      <div style="background:#0D1F0F;padding:40px;font-family:Arial,sans-serif;color:white;max-width:600px;margin:0 auto;border-radius:12px;">
        <h1 style="color:#2E9E5E;font-size:28px;">⏰ Don't miss this one, ${data.username}!</h1>
        <p style="color:#D1FAE5;font-size:16px;">
          <strong>${data.match}</strong> kicks off in 2 hours. Make your prediction before it locks!
        </p>
        <div style="background:#0D2B14;border:1px solid #F59E0B;border-radius:8px;padding:20px;margin:24px 0;">
          <p style="color:#F59E0B;font-weight:bold;margin:0;">⚡ Predictions lock at kick-off</p>
        </div>
        <a href="https://flipseer.com/predict" style="display:inline-block;background:#1A7A4A;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Predict Now →
        </a>
      </div>
    `;
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Flipseer <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) return Response.json({ error }, { status: 400 });
    return Response.json({ success: true, id: emailData?.id });
  } catch (error) {
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
