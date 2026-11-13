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
      // AFCON 2027 alternate slugs → canonical /afcon
      {
        source: '/africa-cup-2027',
        destination: '/afcon',
        permanent: true,
      },
      {
        source: '/africa-cup-of-nations',
        destination: '/afcon',
        permanent: true,
      },
      {
        source: '/afcon-2027',
        destination: '/afcon',
        permanent: true,
      },
      // Asian Cup 2027 alternate slugs → canonical /asian-cup-2027
      {
        source: '/asian-cup',
        destination: '/asian-cup-2027',
        permanent: true,
      },
      {
        source: '/afc-asian-cup',
        destination: '/asian-cup-2027',
        permanent: true,
      },
      // Indonesian Super League → canonical /indonesia (temp until route renamed next season)
      {
        source: '/indonesian-super-league',
        destination: '/indonesia',
        permanent: false,
      },
      // NPFL short slug → canonical /nigeria-premier-league
      {
        source: '/npfl',
        destination: '/nigeria-premier-league',
        permanent: true,
      },
      {
        source: '/nigeria-football',
        destination: '/nigeria-premier-league',
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
