import { config as loadEnv } from 'dotenv'
import type { NextConfig } from 'next'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '../../.env'), override: false })

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@interviewos/types',
    '@interviewos/validators',
    '@interviewos/ui',
    '@interviewos/config',
  ],
  async rewrites() {
    if (!apiUrl) return []
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
