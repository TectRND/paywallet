/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['payload', 'payload-cloud', 'next-payload', 'thirdweb']
  }
};

module.exports = nextConfig;
