'use client';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const alreadyDismissed = localStorage.getItem('pwa_dismissed');
    if (alreadyDismissed) return;

    // Check if already running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds — user has engaged with the site
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa_dismissed', '1');
  };

  if (!showPrompt || dismissed || installed) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 800,
        backgroundColor: '#0D2B14',
        borderTop: '2px solid #2E9E5E',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.4s ease',
        flexWrap: 'wrap',
      }}>
        {/* Left — icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            backgroundColor: '#2E9E5E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            ⚽
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
              Add to Home Screen
            </div>
            <div style={{ fontSize: 12, color: '#8895A3' }}>
              Instant predictions during live matches
            </div>
          </div>
        </div>

        {/* Right — buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={handleDismiss} style={{
            backgroundColor: 'transparent', color: '#6B7280',
            border: '1px solid #1A3A1A', borderRadius: 8,
            padding: '8px 14px', fontSize: 13, cursor: 'pointer',
            fontWeight: 600,
          }}>
            Not now
          </button>
          <button onClick={handleInstall} style={{
            backgroundColor: '#2E9E5E', color: 'white',
            border: 'none', borderRadius: 8,
            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
            fontWeight: 700, boxShadow: '0 0 16px rgba(46,158,94,0.4)',
          }}>
            Install →
          </button>
        </div>
      </div>
    </>
  );
}
