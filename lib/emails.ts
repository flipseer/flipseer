import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── 1. Pre-match reminder (2h before kickoff) ──────────────────────────────
export async function sendMatchReminder({
  email, name, homeTeam, awayTeam, kickoffTime, matchUrl,
}: {
  email: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  matchUrl: string;
}) {
  return resend.emails.send({
    from: 'Flipseer <noreply@flipseer.com>',
    to: email,
    subject: `⚽ ${homeTeam} vs ${awayTeam} — 2 hours to predict!`,
    html: `
      <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
        <h1 style="font-family:Georgia,serif;color:#2E9E5E;margin-bottom:8px;">⚽ Flipseer</h1>
        <p style="color:#9CA3AF;font-size:13px;margin-bottom:24px;">Your football reputation is on the line</p>
        <div style="background:#0D2B14;border:1px solid #1A7A4A;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
          <p style="color:#6B7280;font-size:12px;margin-bottom:12px;">${kickoffTime}</p>
          <h2 style="font-size:22px;margin:0;">${homeTeam} <span style="color:#6B7280">vs</span> ${awayTeam}</h2>
          <p style="color:#F59E0B;font-size:13px;margin-top:12px;">⏱ Predictions close in 2 hours</p>
        </div>
        <a href="${matchUrl}" style="display:block;background:#1A7A4A;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
          Lock In My Prediction →
        </a>
        <p style="color:#4B5563;font-size:11px;text-align:center;margin-top:20px;">
          Hi ${name} · <a href="https://flipseer.com/unsubscribe" style="color:#4B5563;">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}

// ── 2. Predictions locked ──────────────────────────────────────────────────
export async function sendPredictionsLocked({
  email, name, homeTeam, awayTeam, userPick,
}: {
  email: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  userPick: string | null;
}) {
  const pickText = userPick
    ? `Your pick: <strong style="color:#2E9E5E">${userPick}</strong> — let's go! 🔥`
    : `⚠️ You didn't predict this match — don't miss the next one!`;

  return resend.emails.send({
    from: 'Flipseer <noreply@flipseer.com>',
    to: email,
    subject: `🔒 ${homeTeam} vs ${awayTeam} — match has started!`,
    html: `
      <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
        <h1 style="font-family:Georgia,serif;color:#2E9E5E;margin-bottom:8px;">⚽ Flipseer</h1>
        <div style="background:#0D2B14;border:1px solid #7F1D1D;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
          <p style="color:#FCA5A5;font-size:13px;font-weight:bold;">🔒 PREDICTIONS LOCKED</p>
          <h2 style="font-size:22px;margin:8px 0;">${homeTeam} vs ${awayTeam}</h2>
          <p style="font-size:13px;color:#9CA3AF;margin-top:12px;">${pickText}</p>
        </div>
        <a href="https://flipseer.com/leaderboard" style="display:block;background:#1A7A4A;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
          View Leaderboard →
        </a>
        <p style="color:#4B5563;font-size:11px;text-align:center;margin-top:20px;">
          Hi ${name} · <a href="https://flipseer.com/unsubscribe" style="color:#4B5563;">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}

// ── 3. Results are in ──────────────────────────────────────────────────────
export async function sendResultsEmail({
  email, name, homeTeam, awayTeam, score, pointsEarned, correct, leaderboardUrl,
}: {
  email: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  pointsEarned: number;
  correct: boolean;
  leaderboardUrl: string;
}) {
  return resend.emails.send({
    from: 'Flipseer <noreply@flipseer.com>',
    to: email,
    subject: correct
      ? `🎉 Correct! You earned ${pointsEarned} pts — ${homeTeam} vs ${awayTeam}`
      : `📊 Results in — ${homeTeam} vs ${awayTeam}`,
    html: `
      <div style="background:#0D1F0F;color:white;font-family:Arial,sans-serif;padding:32px;max-width:500px;margin:0 auto;border-radius:12px;">
        <h1 style="font-family:Georgia,serif;color:#2E9E5E;margin-bottom:8px;">⚽ Flipseer</h1>
        <div style="background:#0D2B14;border:1px solid #1A7A4A;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
          <h2 style="font-size:22px;margin:0 0 8px;">${homeTeam} vs ${awayTeam}</h2>
          <p style="font-size:32px;font-weight:bold;color:#2E9E5E;margin:8px 0;">${score}</p>
          ${correct
            ? `<p style="color:#6EE7B7;font-weight:bold;">🎉 Correct prediction! +${pointsEarned} pts</p>`
            : `<p style="color:#9CA3AF;">Better luck next match, ${name}!</p>`
          }
        </div>
        <a href="${leaderboardUrl}" style="display:block;background:#1A7A4A;color:white;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
          See Your Ranking →
        </a>
        <p style="color:#4B5563;font-size:11px;text-align:center;margin-top:20px;">
          Hi ${name} · <a href="https://flipseer.com/unsubscribe" style="color:#4B5563;">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}
