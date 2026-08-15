// InviteBanner.tsx — add to homepage page
// Usage: import InviteBanner from '@/components/InviteBanner'
//        <InviteBanner />
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function InviteBanner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  if (!mounted) return null;

  return (
    <section style={{
      padding: '40px 20px',
      borderBottom: '1px solid #2D1B69',
      background: 'linear-gradient(180deg, #1A0B2E 0%, #0D1F0F 100%)',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0D2B14 100%)',
        border: '2px solid #7C3AED',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(124,58,237,0.2)',
      }}>
        {/* Top bar */}
        <div style={{
          backgroundColor: '#4C1D95',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 FLIPSEER · EPL 2026/27
          </span>
          <span style={{ fontSize: '11px', color: '#C4B5FD', fontWeight: 'bold', letterSpacing: '1px' }}>
            STARTS AUG 21
          </span>
        </div>

        <div style={{ padding: '28px 24px' }}>
          {/* Fire badge */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#7C3AED',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              padding: '5px 16px',
              borderRadius: '999px',
            }}>
              🔥 CHALLENGE YOUR FOOTBALL FRIENDS
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 4vw, 30px)',
            textAlign: 'center',
            marginBottom: '8px',
            color: 'white',
            lineHeight: 1.2,
          }}>
            Think you know the EPL<br />
            <span style={{ color: '#A78BFA' }}>better than your friends?</span>
          </h2>

          <p style={{
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '14px',
            marginBottom: '20px',
          }}>
            Prove it. Every prediction locks at kick-off. No edits. No excuses.
          </p>

          {/* 3 feature pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}>
            {[
              { icon: '👥', text: 'Private League' },
              { icon: '⚽', text: 'Predict Before KO' },
              { icon: '🏆', text: 'See Who\'s #1' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                backgroundColor: '#0D1F0F',
                border: '1px solid #6D28D9',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                color: '#DDD6FE',
                fontWeight: 'bold',
              }}>
                {icon} {text}
              </div>
            ))}
          </div>

          {/* Nation flags */}
          <div style={{ textAlign: 'center', fontSize: '22px', marginBottom: '6px', letterSpacing: '4px' }}>
            🇮🇳🇳🇬🇮🇩🇬🇭🇧🇷🏴󠁧󠁢󠁥󠁮󠁧󠁿🇫🇷🇪🇸
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', marginBottom: '20px' }}>
            Represent your nation · Earn points with every correct call
          </p>

          {/* CTA Button */}
          <a href="/groups" style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: '#7C3AED',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: 'bold',
            marginBottom: '12px',
            boxShadow: '0 0 24px rgba(124,58,237,0.4)',
            border: '2px solid #A78BFA',
          }}>
            👥 Invite 3 Friends — Create Your League
          </a>

          {/* Secondary links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="/groups" style={{ fontSize: '12px', color: '#8B5CF6', textDecoration: 'none' }}>
              Share via WhatsApp →
            </a>
            <a href="/predict" style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'none' }}>
              Predict solo →
            </a>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          borderTop: '1px solid #2D1B69',
          padding: '10px 24px',
          textAlign: 'center',
          backgroundColor: '#0D0B1A',
        }}>
          <span style={{ fontSize: '11px', color: '#4B5563' }}>
            Predict. Prove. Repeat. &nbsp;·&nbsp; Free forever. No betting.
          </span>
        </div>
      </div>
    </section>
  );
}
