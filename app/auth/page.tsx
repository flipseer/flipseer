'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ── Google Sign-in ──
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
    // On success Supabase redirects automatically
  };

  const handleForgotPassword = async () => {
    if (!email) { setMessage('Enter your email address first'); return; }
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://flipseer.com/reset-password',
    });
    if (error) { setMessage(error.message); }
    else { setMessage('✅ Password reset link sent! Check your inbox.'); }
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
      if (!username) { setMessage('Username is required'); setLoading(false); return; }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error && error.message !== 'Error sending confirmation email') {
        setMessage(error.message);
      } else if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert([{
          id: data.user.id,
          username,
          reputation: 0,
          total_points: 0,
          prediction_count: 0,
          correct_count: 0,
          streak: 0,
          best_streak: 0,
          accuracy_pct: 0,
          rank: 'Rookie',
          rank_icon: '🥉',
        }], { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation failed:', profileError.message);
        }

        fetch('/api/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username }),
        }).catch(e => console.error('Welcome email failed silently:', e));

        setMessage('✅ Account created! Check your email to confirm.');
      }
    }
    setLoading(false);
  };

  // ── FORGOT PASSWORD VIEW ──
  if (isForgot) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
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
              <div style={{ backgroundColor: message.startsWith('✅') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
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
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>
        <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
          <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · No betting. Pure football reputation.</p>
        </footer>
      </main>
    );
  }

  // ── SIGN IN / SIGN UP VIEW ──
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px' }}>

          {/* TOGGLE */}
          <div style={{ display: 'flex', marginBottom: '32px', backgroundColor: '#0D1F0F', borderRadius: '8px', padding: '4px' }}>
            <button onClick={() => { setIsLogin(true); setMessage(''); }} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: isLogin ? '#1A7A4A' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Sign In</button>
            <button onClick={() => { setIsLogin(false); setMessage(''); }} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: !isLogin ? '#1A7A4A' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Sign Up</button>
          </div>

          {/* HEADING */}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>
            {isLogin ? 'Welcome back' : 'Build your reputation'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
            {isLogin ? 'Sign in to your forecasting profile' : 'Join the football forecasting network'}
          </p>

          {/* ── GOOGLE SIGN IN BUTTON ── */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{ width: '100%', padding: '13px', backgroundColor: 'white', color: '#1F2937', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px', opacity: googleLoading ? 0.7 : 1 }}>
            {googleLoading ? (
              '⏳ Connecting...'
            ) : (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1A7A4A' }} />
            <span style={{ color: '#6B7280', fontSize: '12px' }}>or use email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1A7A4A' }} />
          </div>

          {/* USERNAME (signup only) */}
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Username</label>
              <input type="text" placeholder="e.g. football_oracle" value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>This becomes your permanent public identity — choose wisely</p>
            </div>
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

          {/* FORGOT PASSWORD */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button onClick={() => { setIsForgot(true); setMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#2E9E5E', cursor: 'pointer', fontSize: '12px' }}>
                Forgot password?
              </button>
            </div>
          )}
          {!isLogin && <div style={{ marginBottom: '20px' }} />}

          {/* MESSAGE */}
          {message && (
            <div style={{ backgroundColor: message.startsWith('✅') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {message}
            </div>
          )}

          {/* SUBMIT */}
          <button onClick={handleAuth} disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>

          {/* SWITCH MODE */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#6B7280', fontSize: '13px' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#2E9E5E', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </span>
          </div>

        </div>
      </div>
      <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · No betting. Pure football reputation.</p>
      </footer>
    </main>
  );
}
