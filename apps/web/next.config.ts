import path from 'path'

import { config as loadEnv } from 'dotenv'
import type { NextConfig } from 'next'

loadEnv({ path: path.resolve(process.cwd(), '../../.env'), override: false })

const nextConfig: NextConfig = {
  transpilePackages: [
    '@interviewos/types',
    '@interviewos/validators',
    '@interviewos/ui',
    '@interviewos/config',
  ],
}

export default nextConfig
