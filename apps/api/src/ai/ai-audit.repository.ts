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
        latencyMs: payload.metadata.latencyMs,
        generatedAt: new Date(payload.metadata.generatedAt),
        errorMessage: payload.errorMessage,
      },
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
