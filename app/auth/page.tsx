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
  const [message, setMessage] = useState('');

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
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([{
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
        }]);

        if (profileError) {
          console.error('Profile creation failed:', profileError.message);
        }

        // Fire and forget welcome email
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
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                Enter your email and we'll send a reset link
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {message && (
              <div style={{ backgroundColor: message.startsWith('✅') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {message}
              </div>
            )}

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '16px' }}>
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => { setIsForgot(false); setMessage(''); }}
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
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
            {isLogin ? 'Sign in to your forecasting profile' : 'Join the football forecasting network'}
          </p>

          {/* USERNAME (signup only) */}
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Username</label>
              <input
                type="text"
                placeholder="e.g. football_oracle"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                This becomes your permanent public identity — choose wisely
              </p>
            </div>
          )}

          {/* EMAIL */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              placeholder="minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* FORGOT PASSWORD LINK */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                onClick={() => { setIsForgot(true); setMessage(''); }}
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
          <button
            onClick={handleAuth}
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>

          {/* SWITCH MODE */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#6B7280', fontSize: '13px' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
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
