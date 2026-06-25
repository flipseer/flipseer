import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar';
import FlipseerChat from '@/components/FlipseerChat';

// ── PWA Viewport ──
export const viewport: Viewport = {
  themeColor: '#1A7A4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Flipseer -- Build Your Football Reputation | World Cup 2026 Predictor',
  description: 'Predict World Cup 2026 matches, earn reputation points, and build your permanent football legacy. Free to join. No betting. No gambling. Pure football forecasting.',
  keywords: 'world cup 2026 predictions, football predictor, football forecasting, predict football matches, world cup predictor, football reputation, football prediction game, predict world cup 2026',
  authors: [{ name: 'Flipseer', url: 'https://flipseer.com' }],
  creator: 'Flipseer',
  publisher: 'Flipseer',
  metadataBase: new URL('https://flipseer.com'),
  alternates: { canonical: 'https://flipseer.com' },
  verification: {
    google: 'add-your-google-search-console-verification-here',
  },

  // ── PWA Manifest ──
  manifest: '/manifest.json',

  // ── PWA Apple ──
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flipseer',
  },

  openGraph: {
    title: 'Flipseer -- Your Football Legacy Starts Here',
    description: 'Predict World Cup 2026 matches before kick-off. Earn reputation points. Build a permanent record of your football intelligence. Free. No betting. Ever.',
    url: 'https://flipseer.com',
    siteName: 'Flipseer',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630, alt: 'Flipseer -- Build Your Football Reputation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flipseer -- Build Your Football Reputation | World Cup 2026',
    description: 'Predict World Cup 2026. Earn points. Build your permanent football legacy. Free. No betting. Ever.',
    images: ['https://flipseer.com/api/og/home'],
    creator: '@flipseer',
    site: '@flipseer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── PWA Icons ──
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
  },

  category: 'sports',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flipseer',
  url: 'https://flipseer.com',
  description: 'The permanent public record of your football intelligence. Predict World Cup 2026 matches, earn reputation points, and build your football legacy.',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  creator: { '@type': 'Organization', name: 'Flipseer', url: 'https://flipseer.com' },
  featureList: [
    'World Cup 2026 match predictions',
    'Global leaderboards',
    'National leaderboards',
    'Exact score predictions',
    'Permanent forecast journal',
    'Reputation points system',
    'EPL 2026/27 predictions (August)',
    'Champions League predictions (September)',
  ],
},
{
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Flipseer Nation Battle',
  url: 'https://flipseer.com/nations',
  sport: 'Football',
  description: 'Global nation vs nation football prediction competition. Predict World Cup 2026 matches and earn points for your country.',
},
{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Flipseer free to use?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Flipseer is 100% free. No card required. No betting. No gambling. Ever.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Nation Battle?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every prediction you make earns points for your nation. Countries compete on a global leaderboard updated in real time.' },
    },
    {
      '@type': 'Question',
      name: 'Can I edit my predictions?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Predictions lock permanently at kickoff. This is by design — your record is a permanent proof of your football intelligence.' },
    },
  ],
},
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        {Array.isArray(structuredData) ? structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        )) : (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        )}

        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==au=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_qPBtk56WM587foV2FeyweAeWvKG...', {
                api_host: 'https://us.i.posthog.com',
                person_profiles: 'identified_only',
              })
            `,
          }}
        />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Flipseer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flipseer" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1A7A4A" />
        <meta name="msapplication-TileImage" content="/icons/icon-192x192.png" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://us.i.posthog.com" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0D1F0F' }}>
        <Navbar />
        {children}
        <FlipseerChat />

        {/* FOOTER */}
        <footer style={{
          backgroundColor: '#0D1F0F',
          borderTop: '1px solid #1A7A4A',
          padding: '32px 20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '16px' }}>&#x26BD; FLIPSEER</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <a href="/about" style={footerLink}>About</a>
            <a href="/how-to-play" style={footerLink}>How to Play</a>
            <a href="/faq" style={footerLink}>FAQ</a>
            <a href="/privacy" style={footerLink}>Privacy</a>
            <a href="/terms" style={footerLink}>Terms</a>
            <a href="/disclaimer" style={footerLink}>Disclaimer</a>
          </div>
          <p style={{ color: '#4B5563', fontSize: '12px', margin: 0 }}>
            &#xA9; 2026 Flipseer &nbsp;&#xB7;&nbsp; Pure football reputation &nbsp;&#xB7;&nbsp; No betting &nbsp;&#xB7;&nbsp; No gambling &nbsp;&#xB7;&nbsp; Ever.
          </p>
        </footer>
      </body>
    </html>
  );
}

const footerLink: React.CSSProperties = {
  color: '#9CA3AF',
  textDecoration: 'none',
  fontSize: '14px',
};
