'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth'; return; }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Loading your profile...</p>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* NAV */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A7A4A' }}>
        <a href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>FLIPSEER</a>
        <button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#9CA3AF', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
          Sign Out
        </button>
      </nav>

      {/* PROFILE HERO */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#1A7A4A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
          ⚽
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '8px' }}>
          @{profile?.username || 'forecaster'}
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>Football Forecaster · Flipseer</p>

        {/* REPUTATION SCORE */}
        <div style={{ display: 'inline-block', backgroundColor: '#0D2B14', border: '2px solid #1A7A4A', borderRadius: '16px', padding: '24px 48px', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>
            {profile?.reputation || 0}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '2px', marginTop: '4px' }}>REPUTATION SCORE</div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Predictions', value: '0' },
            { label: 'Correct', value: '0' },
            { label: 'Accuracy', value: '0%' },
          ].map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BADGES */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Badges</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Start predicting to earn your first badge</p>
        </div>
      </section>

      {/* FORECAST JOURNAL */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Forecast Journal</h2>
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Your prediction history will appear here</p>
          <a href="/predict" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            Make Your First Prediction →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1A7A4A' }}>
        <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2026 Flipseer · flipseer.com · Pure football reputation.</p>
      </footer>

    </main>
  );
}
