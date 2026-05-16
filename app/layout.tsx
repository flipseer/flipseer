import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Flipseer — Build Your Forecasting Reputation in Football',
  description: 'Where correct calls earn you status among real fans. No betting. No AI tips. Pure football reputation.',
  openGraph: {
  title: 'Flipseer — Build Your Forecasting Reputation in Football',
  description: 'Where correct calls earn you status among real fans.',
  images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  url: 'https://flipseer.com',
},
twitter: {
  card: 'summary_large_image',
  title: 'Flipseer — Build Your Forecasting Reputation',
  description: 'Where correct calls earn you status among real fans.',
  images: ['https://flipseer.com/api/og/home'],
},
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('npx -y @posthog/wizard@latest', {
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
      </body>
    </html>
  );
}
