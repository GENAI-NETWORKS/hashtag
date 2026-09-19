/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.19.138.180', '10.46.245.180', '10.240.155.180', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '172.19.138.180' },
      { protocol: 'http', hostname: '10.46.245.180' },
      { protocol: 'http', hostname: '10.240.155.180' },
      { protocol: 'https', hostname: '*.hostinger.com' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '172.19.138.180:3000', '10.46.245.180:3000', '10.240.155.180:3000'],
    },
  },
};

export default nextConfig;
