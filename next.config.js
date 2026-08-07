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
      {
        source: '/world-cup-2026/:country',
        destination: '/nations',
        permanent: true,
      },
      {
        source: '/how-to-predict-football',
        destination: '/guide/how-to-predict-football',
        permanent: true,
      },
      {
        source: '/football-reputation',
        destination: '/guide/football-reputation',
        permanent: true,
      },
      {
        source: '/how-to-play',
        destination: '/guide/how-to-play',
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
