import { createPrismaAdapter, PrismaClient } from '@interviewos/database'
import { Injectable, type OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL is required to initialize PrismaService.')
    }

    super({
      adapter: createPrismaAdapter(connectionString),
    })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect()
  }
}
