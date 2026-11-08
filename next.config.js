/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // www → non-www (canonical domain consolidation)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.flipseer.com' }],
        destination: 'https://flipseer.com/:path*',
        permanent: true,
      },
      // Old world cup sub-pages → nations hub
      {
        source: '/world-cup-2026/:country',
        destination: '/nations',
        permanent: true,
      },
      // Old matchweek sub-pages (broken chains) → competition hubs
      {
        source: '/epl/matchweek-:num',
        destination: '/premier-league',
        permanent: true,
      },
      {
        source: '/epl/:path*',
        destination: '/premier-league',
        permanent: true,
      },
      // /champions-league duplicates /ucl — consolidate to /ucl
      {
        source: '/champions-league',
        destination: '/ucl',
        permanent: true,
      },
      // /ghana-premier-league duplicates — consolidate
      {
        source: '/ghana-premier-league',
        destination: '/leaderboard/ghana-pl',
        permanent: true,
      },
      // /leagues page doesn't exist
      {
        source: '/leagues',
        destination: '/leaderboard',
        permanent: true,
      },
    ]
  },
}
module.exports = withSentryConfig(nextConfig, {
  org: 'flipseer',
  project: 'flipseer',
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
