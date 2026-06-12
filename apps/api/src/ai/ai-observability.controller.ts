import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AIAuditRepository } from './ai-audit.repository'

@Controller('ai/observability')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class AIObservabilityController {
  constructor(private readonly aiAuditRepository: AIAuditRepository) {}

  @Get('cost-summary')
  async getCostSummary(@Query('days') days = '7') {
    const since = daysAgo(Number(days))
    return this.aiAuditRepository.getCostSummary(since)
  }

  @Get('latency-breakdown')
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
