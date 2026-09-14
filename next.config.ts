/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.19.138.180', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '172.19.138.180' },
      { protocol: 'https', hostname: '*.hostinger.com' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '172.19.138.180:3000'],
    },
  },
};

export default nextConfig;
