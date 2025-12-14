import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['payload', 'payload-cloud', 'thirdweb', 'viem', 'pg', 'sharp'],
}

export default withPayload(nextConfig)
