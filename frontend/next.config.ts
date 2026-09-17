import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin the workspace root to the repo root so Turbopack doesn't get confused
  // by unrelated lockfiles in parent directories.
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      { pathname: '/images/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;