/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['payload', 'thirdweb']
  }
};

module.exports = nextConfig;
