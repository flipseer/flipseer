// lib/analytics.ts
// Unified analytics helpers for GA4, Meta Pixel, and Microsoft Clarity

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function ga(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

function fb(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

function clarityTag(tag: string, value?: string) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('set', tag, value ?? tag);
  }
}

// ─── Page / funnel events ────────────────────────────────────────────────────

export function trackLandingView(source?: string) {
  ga('landing_view', { source: source ?? 'direct' });
  clarityTag('landing_view', source ?? 'direct');
}

export function trackSignupStarted() {
  ga('signup_started');
  fb('InitiateCheckout');
  clarityTag('signup_started');
}

export function trackSignup(method: string, country?: string) {
  ga('sign_up', { method, country: country ?? '' });
  fb('CompleteRegistration', { method });
  clarityTag('signed_up', method);
}

// ─── Prediction events ───────────────────────────────────────────────────────

export function trackPredictionCreated(params: {
  match_id?: number | string;
  competition?: string;
  home_team?: string;
  away_team?: string;
}) {
  ga('prediction_created', params);
  fb('AddToCart', { content_type: 'prediction', content_ids: [String(params.match_id ?? '')] });
  clarityTag('prediction_created');
}

export function trackPredictionLocked(params: {
  match_id?: number | string;
  competition?: string;
}) {
  ga('prediction_locked', params);
  clarityTag('prediction_locked');
}

export function trackRepeatPrediction(params: {
  match_id?: number | string;
  competition?: string;
}) {
  ga('repeat_prediction', params);
  clarityTag('repeat_prediction');
}

export function trackFirstPrediction(competition: string) {
  ga('first_prediction', { competition });
  fb('Purchase', { currency: 'USD', value: 0, content_type: 'first_prediction' });
  clarityTag('first_prediction', competition);
}

export function trackSecondPrediction(competition: string) {
  ga('second_prediction', { competition });
  clarityTag('second_prediction', competition);
}

// ─── League events ───────────────────────────────────────────────────────────

export function trackLeagueJoined(params: {
  league_code?: string;
  league_name?: string;
}) {
  ga('league_joined', params);
  clarityTag('league_joined', params.league_code);
}

export function trackLeagueCreated(params: {
  league_code?: string;
  league_name?: string;
}) {
  ga('league_created', params);
  clarityTag('league_created');
}

// ─── Social / sharing events ─────────────────────────────────────────────────

export function trackInviteShared(params: {
  channel?: string;
  league_code?: string;
}) {
  ga('invite_shared', params);
  fb('Share', { content_type: 'invite', content_ids: [params.league_code ?? ''] });
  clarityTag('invite_shared', params.channel);
}

export function trackInviteSent(channel: string, leagueCode: string) {
  ga('invite_sent', { channel, league_code: leagueCode });
  clarityTag('invite_sent', channel);
}

export function trackProofCardShared(params: {
  channel?: string;
  competition?: string;
}) {
  ga('proof_card_shared', params);
  fb('Share', { content_type: 'proof_card' });
  clarityTag('proof_card_shared', params.channel);
}

// ─── Nation / onboarding events ──────────────────────────────────────────────

export function trackNationSet(country: string) {
  ga('nation_set', { country });
  clarityTag('nation_set', country);
}

// ─── CTA events ──────────────────────────────────────────────────────────────

export function trackCTAClick(cta: string) {
  ga('cta_click', { cta });
  clarityTag('cta_click', cta);
}
