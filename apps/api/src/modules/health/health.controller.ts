import { Controller, Get } from '@nestjs/common'

import { Public } from '../../common/decorators/public.decorator'
import { PrismaService } from '../../database/prisma.service'

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    let dbStatus: 'ok' | 'error' = 'ok'

    try {
      await this.prisma.$queryRaw`SELECT 1`
    } catch {
      dbStatus = 'error'
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
    }
  }
}
