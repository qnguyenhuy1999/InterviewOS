import type { Prisma } from '@interviewos/database'
import type { AIExecutionMetadata } from '@interviewos/types'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'

@Injectable()
export class AIAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRequestLog(payload: {
    userId?: string
    operation: string
    metadata: AIExecutionMetadata
    errorMessage?: string
  }) {
    return this.prisma.aIRequestLog.create({
      data: {
        userId: payload.userId,
        operation: payload.operation,
        provider: payload.metadata.provider,
        model: payload.metadata.model,
        promptKey: payload.metadata.promptKey,
        promptVersion: payload.metadata.promptVersion,
        schemaKey: payload.metadata.schemaKey,
        schemaVersion: payload.metadata.schemaVersion,
        inputHash: payload.metadata.inputHash,
        validationStatus: toPrismaValidationStatus(payload.metadata.validationStatus),
        tokenUsage: payload.metadata.tokenUsage as Prisma.InputJsonValue | undefined,
        // estimatedCostUsd field added via migration 20260612 — cast until client regenerated
        estimatedCostUsd: estimateCostUsd(payload.metadata.model, payload.metadata.tokenUsage) as never,
        latencyMs: payload.metadata.latencyMs,
        generatedAt: new Date(payload.metadata.generatedAt),
        errorMessage: payload.errorMessage,
      },
    })
  }

  async getLatencyBreakdown(since: Date) {
    return this.prisma.aIRequestLog.groupBy({
      by: ['operation'],
      where: { createdAt: { gte: since } },
      _avg: { latencyMs: true },
      _count: { id: true },
      // estimatedCostUsd sum added via migration 20260612 — cast until client regenerated
      _sum: { estimatedCostUsd: true } as never,
    })
  }

  async getCostSummary(since: Date) {
    return this.prisma.aIRequestLog.aggregate({
      where: { createdAt: { gte: since } },
      _count: { id: true },
      _avg: { latencyMs: true },
      // estimatedCostUsd sum added via migration 20260612 — cast until client regenerated
      _sum: { estimatedCostUsd: true } as never,
    })
  }
}

function toPrismaValidationStatus(status: AIExecutionMetadata['validationStatus']) {
  switch (status) {
    case 'success':
      return 'SUCCESS'
    case 'validation_failed':
      return 'VALIDATION_FAILED'
    case 'provider_error':
      return 'PROVIDER_ERROR'
  }
}

// USD per token costs for known models (input/output)
const MODEL_COSTS: Record<string, { inputPerToken: number; outputPerToken: number }> = {
  'gpt-4o': { inputPerToken: 0.000005, outputPerToken: 0.000015 },
  'gpt-4o-mini': { inputPerToken: 0.00000015, outputPerToken: 0.0000006 },
  'gpt-4-turbo': { inputPerToken: 0.00001, outputPerToken: 0.00003 },
  'gpt-3.5-turbo': { inputPerToken: 0.0000005, outputPerToken: 0.0000015 },
}

function estimateCostUsd(
  model: string,
  tokenUsage: AIExecutionMetadata['tokenUsage'],
): number | undefined {
  if (!tokenUsage) return undefined

  const rates = Object.entries(MODEL_COSTS).find(([key]) => model.includes(key))?.[1]
  if (!rates) return undefined

  const inputCost = (tokenUsage.inputTokens ?? 0) * rates.inputPerToken
  const outputCost = (tokenUsage.outputTokens ?? 0) * rates.outputPerToken
  return inputCost + outputCost
}
