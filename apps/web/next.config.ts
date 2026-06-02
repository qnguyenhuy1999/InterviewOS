import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@interviewos/types',
    '@interviewos/validators',
    '@interviewos/ui',
    '@interviewos/config',
  ],
}

export default nextConfig
