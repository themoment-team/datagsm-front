import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/((?!oauth).+)',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/$1`,
      },
    ];
  },
};

export default nextConfig;
