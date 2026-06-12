import { Controller, Get, Query } from '@nestjs/common'

import { AiThrottle } from '../common/decorators/throttle.decorator'
import { AIAuditRepository } from './ai-audit.repository'

@Controller('ai/observability')
export class AIObservabilityController {
  constructor(private readonly aiAuditRepository: AIAuditRepository) {}

  @Get('cost-summary')
  @AiThrottle()
  async getCostSummary(@Query('days') days = '7') {
    const since = daysAgo(Number(days))
    return this.aiAuditRepository.getCostSummary(since)
  }

  @Get('latency-breakdown')
  @AiThrottle()
  async getLatencyBreakdown(@Query('days') days = '7') {
    const since = daysAgo(Number(days))
    return this.aiAuditRepository.getLatencyBreakdown(since)
  }
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.max(1, Math.min(n, 90)))
  return d
}
