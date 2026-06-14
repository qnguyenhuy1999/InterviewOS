import { config as loadEnv } from 'dotenv'
import type { NextConfig } from 'next'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '../../.env'), override: false })

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@interviewos/types',
    '@interviewos/validators',
    '@interviewos/ui',
    '@interviewos/config',
  ],
}

export default nextConfig
