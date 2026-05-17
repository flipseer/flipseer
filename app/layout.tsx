import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Flipseer — Build Your Football Reputation | World Cup 2026 Predictor',
  description: 'Predict World Cup 2026 matches, earn reputation points, and build your permanent football legacy. Free to join. No betting. No gambling. Pure football forecasting.',
  keywords: 'world cup 2026 predictions, football predictor, football forecasting, predict football matches, world cup predictor, football reputation, football prediction game, predict world cup 2026',
  authors: [{ name: 'Flipseer', url: 'https://flipseer.com' }],
  creator: 'Flipseer',
  publisher: 'Flipseer',
  <head>
  <meta name="google-site-verification" content="paste_your_code_here" />
  metadataBase: new URL('https://flipseer.com'),
  alternates: {
    canonical: 'https://flipseer.com',
  },
  openGraph: {
    title: 'Flipseer — Your Football Legacy Starts Here',
    description: 'Predict World Cup 2026 matches before kick-off. Earn reputation points. Build a permanent record of your football intelligence. Free. No betting. Ever.',
    url: 'https://flipseer.com',
    siteName: 'Flipseer',
    images: [
      {
        url: 'https://flipseer.com/api/og/home',
        width: 1200,
        height: 630,
        alt: 'Flipseer — Build Your Football Reputation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flipseer — Build Your Football Reputation | World Cup 2026',
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
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
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'Flipseer',
    url: 'https://flipseer.com',
  },
  featureList: [
    'World Cup 2026 match predictions',
    'Global leaderboards',
    'National leaderboards',
    'Exact score predictions',
    'Permanent forecast journal',
    'Reputation points system',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('YOUR_POSTHOG_KEY_HERE', {
                api_host: 'https://us.i.posthog.com',
                person_profiles: 'identified_only',
              })
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0D1F0F' }}>
        <Navbar />
        {children}

        {/* FOOTER */}
        <footer style={{
          backgroundColor: '#0D1F0F',
          borderTop: '1px solid #1A7A4A',
          padding: '32px 20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '16px' }}>⚽ FLIPSEER</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <a href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>About</a>
            <a href="/faq" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>FAQ</a>
            <a href="/how-to-play" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>How to Play</a>
            <a href="/predict" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>Predict</a>
            <a href="/leaderboard" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>Leaderboard</a>
          </div>
          <p style={{ color: '#4B5563', fontSize: '12px', margin: 0 }}>
            © 2026 Flipseer · Pure football reputation · No betting · No AI tips
          </p>
        </footer>
      </body>
    </html>
  );
}
