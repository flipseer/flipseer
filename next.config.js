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
      // /leaderboard/ghana-pl → canonical /ghana-premier-league
      {
        source: '/leaderboard/ghana-pl',
        destination: '/ghana-premier-league',
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
  async rewrites() {
    return [
      // Serve static HTML file from public/ before dynamic routes match
      {
        source: '/reputation-card.html',
        destination: '/reputation-card.html',
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
