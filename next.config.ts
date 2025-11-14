import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mehedis-lms.t3.storage.dev',
        port: '',
      },
    ],
  },
};

export default nextConfig;
