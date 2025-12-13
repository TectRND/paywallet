/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow these packages to be imported in Server Components
    serverComponentsExternalPackages: ['payload', 'payload-cloud', 'thirdweb', 'viem'],
  },
}

module.exports = nextConfig
