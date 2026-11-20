import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'iconoir-react',
      'motion',
      'rough-notation',
      'framer-motion',
    ],
    // Inline critical CSS into the HTML to eliminate render-blocking CSS requests
    inlineCss: true,
  },
  async headers() {
    // Only production builds fingerprint their assets. In `next dev`, chunk URLs stay the same
    // across rebuilds, so an immutable cache header makes the browser keep stale chunks and
    // fail with "module factory is not available" after the .next cache is rebuilt.
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    return [
      {
        // Long-cache immutable static assets (Next.js fingerprints these)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images long-term
        source: '/:path*.(png|jpg|jpeg|svg|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
