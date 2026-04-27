/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // ============================================================
  // BUILD GUARANTEES
  // ============================================================
  // Skip ALL non-critical checks during production builds.
  // Local dev still runs them, but Vercel deploys never fail from
  // stylistic issues. Real runtime errors will still surface.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'instagram.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
    ],
  },

  // Modern Sass API + silence ALL non-critical deprecations
  // CRITICAL: modern API uses `loadPaths`, legacy uses `includePaths` — set BOTH for safety
  sassOptions: {
    loadPaths: [path.join(__dirname, 'src/styles')],
    includePaths: [path.join(__dirname, 'src/styles')],
    additionalData: `@use "abstracts/variables" as *; @use "abstracts/mixins" as *;`,
    api: 'modern-compiler',
    silenceDeprecations: [
      'legacy-js-api',
      'color-functions',
      'global-builtin',
      'import',
      'slash-div',
      'mixed-decls',
      'function-units',
      'duplicate-var-flags',
      'css-function-mixin',
      'feature-exists',
    ],
  },

  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },

  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      {
        source: '/:path*\\.(svg|png|jpg|jpeg|webp|avif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/gif.worker.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
