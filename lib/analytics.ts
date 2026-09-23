// Flipseer GA4 Event Tracking
// Import and call these functions at the right moments in the app

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

// ── CORE TRACKER ──
function track(event: string, params?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params || {});
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', event, params || {});
    }
  } catch (e) {}
}

// ── KEY EVENTS ──

// 1. User signs up — call after successful auth
export function trackSignup(method: 'email' | 'google' = 'email', country?: string) {
  track('signup', {
    method,
    country: country || 'unknown',
  });
  // GA4 standard sign_up event
  track('sign_up', { method });
}

// 2. Prediction created — call when user submits prediction form
export function trackPredictionCreated(params: {
  competition: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  outcome: string;
  confidence: number;
  isFirstPrediction: boolean;
}) {
  track('prediction_created', {
    competition: params.competition,
    match_id: params.matchId,
    home_team: params.homeTeam,
    away_team: params.awayTeam,
    predicted_outcome: params.outcome,
    confidence: params.confidence,
    is_first_prediction: params.isFirstPrediction,
  });
}

// 3. Prediction locked — call when countdown hits 0 or user locks manually
export function trackPredictionLocked(params: {
  competition: string;
  matchId: string;
  confidence: number;
}) {
  track('prediction_locked', {
    competition: params.competition,
    match_id: params.matchId,
    confidence: params.confidence,
  });
}

// 4. League joined — call after successful group_members insert
export function trackLeagueJoined(params: {
  leagueCode: string;
  leagueName: string;
  viaInvite: boolean;
  isOfficial: boolean;
}) {
  track('league_joined', {
    league_code: params.leagueCode,
    league_name: params.leagueName,
    via_invite: params.viaInvite,
    is_official: params.isOfficial,
  });
}

// 5. League created — call after successful groups insert
export function trackLeagueCreated(params: {
  leagueCode: string;
  competition: string;
}) {
  track('league_created', {
    league_code: params.leagueCode,
    competition: params.competition,
  });
}

// 6. Invite shared — call when WhatsApp or copy link is clicked
export function trackInviteShared(params: {
  leagueCode: string;
  channel: 'whatsapp' | 'copy_link' | 'facebook' | 'twitter';
}) {
  track('invite_shared', {
    league_code: params.leagueCode,
    channel: params.channel,
  });
  // GA4 standard share event
  track('share', {
    method: params.channel,
    content_type: 'league_invite',
    item_id: params.leagueCode,
  });
}

// 7. Repeat prediction — call when user who already has predictions makes another
export function trackRepeatPrediction(params: {
  totalPredictions: number;
  competition: string;
  daysSinceFirst: number;
}) {
  track('repeat_prediction', {
    total_predictions: params.totalPredictions,
    competition: params.competition,
    days_since_first: params.daysSinceFirst,
    milestone: params.totalPredictions >= 50 ? '50+' 
      : params.totalPredictions >= 20 ? '20+'
      : params.totalPredictions >= 10 ? '10+'
      : params.totalPredictions >= 5 ? '5+'
      : 'early',
  });
}

// ── BONUS EVENTS ──

// Proof card shared
export function trackProofCardShared(params: {
  predictionId: string;
  result: 'exact' | 'correct' | 'wrong' | 'pending';
  channel: 'whatsapp' | 'twitter' | 'facebook' | 'copy';
}) {
  track('proof_card_shared', {
    prediction_id: params.predictionId,
    result: params.result,
    channel: params.channel,
  });
}

// Nation set
export function trackNationSet(country: string) {
  track('nation_set', { country });
}

// CTA clicked on homepage
export function trackCTAClick(cta: string) {
  track('cta_click', { cta_label: cta });
}
