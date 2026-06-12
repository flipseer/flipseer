import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password');
    const cronSecret = req.headers.get('x-cron-secret');

    const validAdmin = adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
                       adminPassword === process.env.ADMIN_PASSWORD
    const validCron = cronSecret === process.env.CRON_SECRET

    if (!validAdmin && !validCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const match_id = Number(body.match_id);

    if (!match_id) {
      return NextResponse.json({ error: 'match_id required' }, { status: 400 });
    }

    // Get match
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single();

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found', match_id }, { status: 404 });
    }

    // Get predictions separately
    const { data: predictions, error: predError } = await supabaseAdmin
      .from('predictions')
      .select('*')
      .eq('match_id', match_id)
      .eq('prediction_processed', true);

    if (!predictions || predictions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No processed predictions',
        sent: 0,
        debug: { match_id, pred_count: predictions?.length || 0, error: predError?.message }
      });
    }

    // Get profiles separately
    const userIds = predictions.map((p: any) => p.user_id);
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, username, total_points, correct_count, prediction_count, accuracy_pct, streak')
      .in('id', userIds);

    const profileMap: { [key: string]: any } = {};
    profiles?.forEach((p: any) => { profileMap[p.id] = p; });

    // Get emails
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailMap: { [key: string]: string } = {};
    if (authUsers?.users) {
      authUsers.users.forEach((u: any) => {
        if (userIds.includes(u.id) && u.email) emailMap[u.id] = u.email;
      });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    let sent = 0;
    let failed = 0;

    const matchName = match.home_team + ' vs ' + match.away_team;
    const actualScore = match.home_score + '-' + match.away_score;
    const isUpset = match.is_upset === true;

    for (const pred of predictions) {
      const email = emailMap[pred.user_id];
      if (!email) continue;

      const profile = profileMap[pred.user_id];
      const username = profile?.username || 'Forecaster';
      const won = pred.points_earned > 0;
      const points = pred.points_earned || 0;
      const accuracy = profile?.accuracy_pct || 0;
      const streak = profile?.streak || 0;
      const totalPoints = profile?.total_points || 0;

      const outcomeLabel =
        pred.predicted_outcome === 'home' ? match.home_team :
        pred.predicted_outcome === 'away' ? match.away_team : 'Draw';

      const breakdown = [];
      if (pred.base_points > 0) breakdown.push('+' + pred.base_points + ' outcome');
      if (pred.exact_bonus > 0) breakdown.push('+' + pred.exact_bonus + ' exact score');
      if (pred.goal_diff_bonus > 0) breakdown.push('+' + pred.goal_diff_bonus + ' goal diff');
      if (pred.upset_bonus > 0) breakdown.push('+' + pred.upset_bonus + ' upset');
      if (pred.confidence_multiplier > 1) breakdown.push('x' + pred.confidence_multiplier + ' confidence');

      const subject = won
        ? 'You called it! +' + points + ' pts - ' + matchName
        : 'Missed this one - ' + matchName + ' result';

      const html = `
<div style="background:#0D1F0F;padding:40px 32px;font-family:Arial,sans-serif;color:white;max-width:580px;margin:0 auto;border-radius:16px">
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:44px;margin-bottom:10px">${won ? '&#x2705;' : '&#x274C;'}</div>
    <h1 style="font-family:Georgia,serif;color:${won ? '#2E9E5E' : '#EF4444'};font-size:26px;margin:0 0 6px">
      ${won ? 'You called it right!' : 'Missed this one'}
    </h1>
    <p style="color:#9CA3AF;font-size:14px;margin:0">@${username}</p>
  </div>
  <div style="background:#0D2B14;border:1px solid #1A7A4A;border-radius:12px;padding:20px;margin-bottom:20px;text-align:center">
    <p style="color:#6B7280;font-size:10px;font-weight:bold;letter-spacing:2px;margin:0 0 8px">FULL TIME</p>
    <p style="color:white;font-size:18px;font-weight:bold;margin:0 0 8px">${matchName}</p>
    <p style="color:#2E9E5E;font-size:36px;font-weight:bold;font-family:Georgia,serif;margin:0 0 8px">${actualScore}</p>
    ${isUpset ? '<p style="color:#F59E0B;font-size:12px;font-weight:bold;margin:0">UPSET RESULT</p>' : ''}
  </div>
  <div style="background:#0D2B14;border:2px solid ${won ? '#2E9E5E' : '#7F1D1D'};border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="color:#6B7280;font-size:10px;font-weight:bold;letter-spacing:2px;margin:0 0 14px">YOUR PREDICTION</p>
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="color:#9CA3AF;font-size:13px;padding:4px 0">You picked</td>
        <td style="color:white;font-weight:bold;font-size:13px;text-align:right">${outcomeLabel}</td>
      </tr>
      <tr>
        <td style="color:#9CA3AF;font-size:13px;padding:4px 0">Confidence</td>
        <td style="color:white;font-weight:bold;font-size:13px;text-align:right">${pred.confidence_pct}%</td>
      </tr>
    </table>
    <div style="background:${won ? 'rgba(46,158,94,0.15)' : 'rgba(127,29,29,0.15)'};border:1px solid ${won ? '#2E9E5E' : '#7F1D1D'};border-radius:8px;padding:14px;text-align:center;margin-top:14px">
      <p style="color:${won ? '#2E9E5E' : '#EF4444'};font-size:28px;font-weight:bold;margin:0">${won ? '+' + points + ' pts' : '0 pts'}</p>
      ${breakdown.length > 0 ? '<p style="color:#6B7280;font-size:11px;margin:4px 0 0">' + breakdown.join(' &middot; ') + '</p>' : ''}
    </div>
  </div>
  <a href="https://flipseer.com/predict" style="display:block;background:#1A7A4A;color:white;padding:16px;border-radius:10px;text-align:center;text-decoration:none;font-weight:bold;font-size:16px;margin-bottom:12px">
    Predict Next Match &#x2192;
  </a>
  <a href="https://flipseer.com/leaderboard" style="display:block;background:transparent;color:#2E9E5E;padding:12px;border-radius:10px;text-align:center;text-decoration:none;font-size:14px;border:1px solid #2E9E5E;margin-bottom:24px">
    View Leaderboard &#x2192;
  </a>
  <div style="border-top:1px solid #1A7A4A;padding-top:16px;text-align:center">
    <p style="color:#4B5563;font-size:11px;margin:0">
      Flipseer &middot; Pure football reputation. No betting. Ever.
    </p>
  </div>
</div>`;

      try {
        await resend.emails.send({
          from: 'Flipseer <noreply@flipseer.com>',
          to: email,
          subject,
          html,
        });
        sent++;
      } catch (e) {
        console.error('Email failed:', email, e);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      match: matchName,
      total_predictions: predictions.length,
      emails_sent: sent,
      emails_failed: failed,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
