'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if PWA notifications are supported and not already subscribed
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const dismissed = localStorage.getItem('push_dismissed');
    if (dismissed) return;

    // Show after 2 minutes of use
    const timer = setTimeout(() => setShow(true), 120000);
    return () => clearTimeout(timer);
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setShow(false); return; }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, userId: session.user.id }),
      });

      setSubscribed(true);
      setTimeout(() => setShow(false), 2000);
    } catch (err) {
      console.error('Push subscription failed:', err);
      setShow(false);
    }
    setLoading(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('push_dismissed', '1');
  };

  if (!show) return null;

  return (
    <>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{
        position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 700,
        backgroundColor: '#0D2B14', border: '1px solid #2E9E5E',
        borderRadius: 14, padding: '16px 18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.3s ease',
        display: 'flex', alignItems: 'center', gap: 12,
        maxWidth: 480, margin: '0 auto',
      }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>⚽</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
            {subscribed ? '✅ Notifications enabled!' : 'Get match reminders'}
          </div>
          <div style={{ fontSize: 12, color: '#8895A3' }}>
            {subscribed ? 'We\'ll notify you before kickoff.' : 'Never miss a prediction window again.'}
          </div>
        </div>
        {!subscribed && (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={dismiss} style={{
              background: 'transparent', border: '1px solid #1A3A1A',
              color: '#6B7280', padding: '6px 12px', borderRadius: 8,
              fontSize: 12, cursor: 'pointer',
            }}>
              No thanks
            </button>
            <button onClick={subscribe} disabled={loading} style={{
              background: '#2E9E5E', border: 'none',
              color: 'white', padding: '6px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              {loading ? '...' : 'Enable →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
