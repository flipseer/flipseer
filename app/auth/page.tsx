'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'GB', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'SC', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

// Map detected nation name to country code
const NATION_TO_CODE: { [key: string]: string } = {
  'India': 'IN', 'Indonesia': 'ID', 'Nigeria': 'NG', 'Brazil': 'BR',
  'Argentina': 'AR', 'Mexico': 'MX', 'USA': 'US', 'England': 'GB',
  'France': 'FR', 'Germany': 'DE', 'Spain': 'ES', 'Portugal': 'PT',
  'Netherlands': 'NL', 'Belgium': 'BE', 'Italy': 'IT', 'Ghana': 'GH',
  'South Africa': 'ZA', 'Morocco': 'MA', 'Egypt': 'EG', 'Senegal': 'SN',
  'Japan': 'JP', 'South Korea': 'KR', 'Australia': 'AU', 'Canada': 'CA',
  'Colombia': 'CO', 'Pakistan': 'PK', 'Bangladesh': 'BD', 'Singapore': 'SG',
  'Malaysia': 'MY', 'Philippines': 'PH', 'Thailand': 'TH', 'Turkey': 'TR',
  'Saudi Arabia': 'SA', 'UAE': 'AE', 'Iraq': 'IQ', 'Iran': 'IR',
  'Jordan': 'JO', 'Uzbekistan': 'UZ', 'Croatia': 'HR', 'Sweden': 'SE',
  'Norway': 'NO', 'Czech Republic': 'CZ', 'Austria': 'AT', 'New Zealand': 'NZ',
  'DR Congo': 'CD', 'Ivory Coast': 'CI', 'Tunisia': 'TN', 'Algeria': 'DZ',
  'Kenya': 'KE', 'Haiti': 'HT', 'Uruguay': 'UY', 'Paraguay': 'PY',
  'Chile': 'CL', 'Peru': 'PE', 'Qatar': 'QA', 'Switzerland': 'CH',
};

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [detectedNation, setDetectedNation] = useState('');

  // Prefill country from homepage localStorage detection
  useEffect(() => {
    try {
      const nation = localStorage.getItem('flipseer_detected_nation');
      if (nation) {
        setDetectedNation(nation);
        const code = NATION_TO_CODE[nation];
        if (code) setCountry(code);
      }
    } catch (e) {}
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) { setMessage(error.message); setGoogleLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) { setMessage('Enter your email address first'); return; }
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://flipseer.com/reset-password',
    });
    if (error) { setMessage(error.message); }
    else { setMessage('Password reset link sent! Check your inbox.'); }
    setLoading(false);
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    setLoading(true);
    setMessage('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage(error.message); }
      else { window.location.href = '/profile'; }
    } else {
      if (!username.trim()) { setMessage('Username is required'); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error && error.message !== 'Error sending confirmation email') {
        setMessage(error.message);
      } else if (data.user) {
        await supabase.from('profiles').upsert([{
          id: data.user.id,
          username: username.trim(),
          country: country || null,
          reputation: 0, total_points: 0,
          prediction_count: 0, correct_count: 0,
          streak: 0, best_streak: 0,
          accuracy_pct: 0, rank: 'Rookie', rank_icon: '🥉',
        }], { onConflict: 'id' });
        fetch('/api/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, country }),
        }).catch(() => {});
        window.location.href = '/profile';
      }
    }
    setLoading(false);
  };

  if (isForgot) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Reset Password</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Enter your email and we'll send a reset link</p>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {message && (
            <div style={{ backgroundColor: message.startsWith('Password reset') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {message}
            </div>
          )}
          <button onClick={handleForgotPassword} disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '16px' }}>
            {loading ? 'Sending...' : 'Send Reset Link →'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setIsForgot(false); setMessage(''); }}
              style={{ background: 'none', border: 'none', color: '#2E9E5E', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* URGENCY BANNER */}
      <div style={{ backgroundColor: '#1A7A4A', padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>
          ⚽ World Cup 2026 is LIVE —{' '}
          {detectedNation
            ? `Represent ${detectedNation}. Predict every match free.`
            : 'Predict every match. Represent your nation. Free forever.'
          }
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '420px' }}>

          {/* HEADING */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚽</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '6px' }}>
              {isLogin ? 'Welcome back' : detectedNation ? `Represent ${detectedNation}` : 'Build your reputation'}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
              {isLogin
                ? 'Sign in to your forecasting profile'
                : detectedNation
                  ? `Join ${detectedNation}'s forecasters. Predict. Earn points. Build legacy.`
                  : 'Join the global football forecasting competition'
              }
            </p>
          </div>

          {/* GOOGLE BUTTON */}
          <button onClick={handleGoogleSignIn} disabled={googleLoading}
            style={{ width: '100%', padding: '14px', backgroundColor: 'white', color: '#1F2937', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', opacity: googleLoading ? 0.7 : 1 }}>
            {googleLoading ? 'Connecting...' : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1A7A4A' }} />
            <span style={{ color: '#6B7280', fontSize: '12px' }}>or use email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1A7A4A' }} />
          </div>

          {/* TOGGLE */}
          <div style={{ display: 'flex', marginBottom: '20px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '4px' }}>
            <button onClick={() => { setIsLogin(true); setMessage(''); }}
              style={{ flex: 1, padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: isLogin ? '#1A7A4A' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              Sign In
            </button>
            <button onClick={() => { setIsLogin(false); setMessage(''); }}
              style={{ flex: 1, padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: !isLogin ? '#1A7A4A' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              Sign Up
            </button>
          </div>

          {/* SIGNUP FIELDS */}
          {!isLogin && (
            <>
              {/* USERNAME */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Username</label>
                <input type="text" placeholder="e.g. football_oracle" value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Your permanent public identity</p>
              </div>

              {/* COUNTRY — prefilled from detection */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>
                  Your Nation <span style={{ color: '#2E9E5E', fontSize: '11px' }}>— earn points for your country</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '8px',
                      border: '1px solid ' + (country ? '#2E9E5E' : '#1A7A4A'),
                      backgroundColor: '#0D1F0F', color: country ? 'white' : '#6B7280',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      appearance: 'none', cursor: 'pointer',
                    }}>
                    <option value="">Select your nation...</option>
                    {COUNTRIES.map(({ code, name, flag }) => (
                      <option key={code} value={code}>{flag} {name}</option>
                    ))}
                  </select>
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none', fontSize: '12px' }}>▼</span>
                </div>
                {country && selectedCountry && (
                  <p style={{ fontSize: '11px', color: '#2E9E5E', marginTop: '4px' }}>
                    {selectedCountry.flag} Every correct prediction earns points for {selectedCountry.name} 🏆
                  </p>
                )}
                {!country && (
                  <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                    Required — join your nation's leaderboard
                  </p>
                )}
              </div>
            </>
          )}

          {/* EMAIL */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" placeholder="minimum 6 characters" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button onClick={() => { setIsForgot(true); setMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#2E9E5E', cursor: 'pointer', fontSize: '12px' }}>
                Forgot password?
              </button>
            </div>
          )}
          {!isLogin && <div style={{ marginBottom: '20px' }} />}

          {message && (
            <div style={{ backgroundColor: message.includes('reset') || message.includes('created') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {message}
            </div>
          )}

          <button onClick={handleAuth} disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : detectedNation ? `Join & Represent ${detectedNation} →` : 'Create Account →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: '#6B7280', fontSize: '13px' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#2E9E5E', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </span>
          </div>

          {/* TRUST SHIELD */}
          <div style={{ marginTop: '20px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center', marginBottom: '10px' }}>YOUR DATA. YOUR RULES.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { icon: '🔒', text: 'Your personal data stays yours' },
                { icon: '🛡️', text: 'Encrypted & Secure' },
                { icon: '🚫', text: 'Never Sold' },
                { icon: '⚙️', text: 'Under Your Control' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px' }}>{icon}</span>
                  <span style={{ fontSize: '11px', color: '#6EE7B7' }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <a href="/privacy" style={{ fontSize: '11px', color: '#4B5563', textDecoration: 'none' }}>
                Full privacy policy →
              </a>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#4B5563', fontSize: '11px', marginTop: '16px' }}>
            Free. No betting. No gambling. Pure football.
          </p>
        </div>
      </div>
    </main>
  );
}
