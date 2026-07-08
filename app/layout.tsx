import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import FlipseerChat from '@/components/FlipseerChat';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';

export const viewport: Viewport = {
  themeColor: '#1A7A4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Flipseer — Football Reputation Platform',
  description: 'Predict World Cup 2026 matches. Represent your nation. Build your permanent football reputation. Free. No betting. No gambling.',
  keywords: 'football prediction, World Cup 2026, football reputation, nation battle, EPL predictions',
  authors: [{ name: 'Flipseer' }],
  creator: 'Flipseer',
  publisher: 'Flipseer',
  metadataBase: new URL('https://flipseer.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flipseer',
    startupImage: [
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    title: 'Flipseer — Football Reputation Platform',
    description: 'Predict World Cup 2026 matches. Represent your nation. Build your permanent football reputation.',
    url: 'https://flipseer.com',
    siteName: 'Flipseer',
    images: [{ url: '/api/og/home', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flipseer — Football Reputation Platform',
    description: 'Predict World Cup 2026. Represent your nation. Build your permanent football reputation.',
    images: ['/api/og/home'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-96x96.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Flipseer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flipseer" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1A7A4A" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api-football.com" />

        {/* ── GOOGLE ANALYTICS 4 ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KG9XX5BWZY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KG9XX5BWZY');
            `,
          }}
        />

        {/* ── META PIXEL ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1791829218318412');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1791829218318412&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0D1F0F' }}>
        <Navbar />
        {children}
        <FlipseerChat />
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <PushNotificationPrompt />
      </body>
    </html>
  );
}
