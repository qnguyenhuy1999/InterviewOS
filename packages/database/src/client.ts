import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(__dirname, '../../../.env'), override: false })

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from './generated/prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to initialize PrismaClient.')
}

export function createPrismaAdapter(databaseUrl = connectionString) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize PrismaClient.')
  }

  return new PrismaPg({ connectionString: databaseUrl })
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createPrismaAdapter() })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
