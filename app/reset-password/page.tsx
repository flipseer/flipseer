'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // ── Method 1: Listen for PASSWORD_RECOVERY event ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
      // Also handle SIGNED_IN with recovery token
      if (event === 'SIGNED_IN' && session) {
        setReady(true);
      }
    });

    // ── Method 2: Check URL hash for token directly ──
    // Supabase puts #access_token=xxx&type=recovery in URL
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setReady(true);
    }

    // ── Method 3: Check URL search params ──
    // Some Supabase versions use ?token=xxx&type=recovery
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'recovery') {
      setReady(true);
    }

    // ── Method 4: Check existing session ──
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password) { setMessage('Enter a new password'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setMessage('Passwords do not match'); return; }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Password updated! Redirecting...');
      setTimeout(() => { window.location.href = '/profile'; }, 2000);
    }
    setLoading(false);
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>
              Set New Password
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Choose a strong password for your account
            </p>
          </div>

          {!ready ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                ⏳ Verifying your reset link...
              </p>
              <p style={{ color: '#4B5563', fontSize: '12px', marginTop: '8px' }}>
                If this takes too long, try clicking the link in your email again.
              </p>
              {/* ── Fallback manual trigger ── */}
              <button
                onClick={() => setReady(true)}
                style={{ marginTop: '16px', backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#2E9E5E', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Continue anyway →
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: '#0D1F0F', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {message && (
                <div style={{ backgroundColor: message.startsWith('✅') ? '#1A7A4A' : '#7F1D1D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                  {message}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={loading}
                style={{ width: '100%', padding: '14px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Updating...' : 'Update Password →'}
              </button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/auth" style={{ color: '#2E9E5E', fontSize: '13px', textDecoration: 'none' }}>
              ← Back to Sign In
            </a>
          </div>

        </div>
      </div>
      <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · No betting. Pure football reputation.</p>
      </footer>
    </main>
  );
}
