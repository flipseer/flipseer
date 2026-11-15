'use client';
import { useState, useEffect } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushSubscribeButton({ userId }: { userId?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'unsupported' | 'denied'>('idle');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setStatus('subscribed');
      });
    });
  }, []);

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) return;
    setStatus('loading');
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission === 'denied') { setStatus('denied'); return; }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), user_id: userId || null }),
      });
      setStatus('subscribed');
    } catch (err: any) {
      console.error('Push subscribe error:', err);
      setStatus('idle');
    }
  };

  const unsubscribe = async () => {
    setStatus('loading');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      }
      setStatus('idle');
    } catch (err: any) {
      console.error('Push unsubscribe error:', err);
      setStatus('subscribed');
    }
  };

  if (status === 'unsupported') return null;

  if (status === 'subscribed') {
    return (
      <button onClick={unsubscribe} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        backgroundColor: 'rgba(46,158,94,0.15)', border: '1px solid #2E9E5E',
        color: '#2E9E5E', borderRadius: '8px', padding: '8px 14px',
        fontSize: '13px', cursor: 'pointer', fontWeight: 'bold',
      }}>
        🔔 Notifications On
        <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 'normal' }}>tap to turn off</span>
      </button>
    );
  }

  if (status === 'denied') {
    return (
      <div style={{ fontSize: '12px', color: '#EF4444', padding: '8px 14px', border: '1px solid #7F1D1D', borderRadius: '8px' }}>
        🔕 Notifications blocked — enable in browser settings
      </div>
    );
  }

  return (
    <button onClick={subscribe} disabled={status === 'loading'} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      backgroundColor: '#2E9E5E', border: 'none',
      color: 'white', borderRadius: '8px', padding: '8px 14px',
      fontSize: '13px', cursor: status === 'loading' ? 'default' : 'pointer',
      fontWeight: 'bold', opacity: status === 'loading' ? 0.7 : 1,
    }}>
      {status === 'loading' ? '⏳ Setting up...' : '🔔 Get Match Alerts'}
    </button>
  );
}
