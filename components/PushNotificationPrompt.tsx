'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const checkState = async () => {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setSubscribed(true);
        return;
      }
      const permission = Notification.permission;
      if (permission === 'denied') return;
      setShow(true);
    };

    // small delay so it doesn't flash immediately on page load
    const t = setTimeout(checkState, 3000);
    return () => clearTimeout(t);
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setShow(false);
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error('VAPID public key not set');
        setShow(false);
        setLoading(false);
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShow(false);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          user_id: session.user.id,
        }),
      });

      if (res.ok) {
        setSubscribed(true);
        setShow(false);
      }
    } catch (err) {
      console.error('Push subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!show || subscribed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: 420,
      backgroundColor: '#0D2B14',
      border: '1px solid #2E9E5E',
      borderRadius: 14,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      zIndex: 1000,
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>🔔</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
          Get match result alerts
        </div>
        <div style={{ color: '#6B7280', fontSize: 12 }}>
          Know instantly when your predictions are scored
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleEnable}
          disabled={loading}
          style={{
            backgroundColor: '#1A7A4A',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Enabling…' : 'Enable'}
        </button>
        <button
          onClick={() => setShow(false)}
          style={{
            backgroundColor: 'transparent',
            color: '#4B5563',
            border: 'none',
            fontSize: 11,
            cursor: 'pointer',
            padding: '2px 0',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
