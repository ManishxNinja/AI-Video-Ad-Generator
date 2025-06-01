import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files2.heygen.ai',
        port: '', // leave empty unless using a specific port
        pathname: '/**', // match all paths under the domain
      },
    ],
  },
};

export default nextConfig;
