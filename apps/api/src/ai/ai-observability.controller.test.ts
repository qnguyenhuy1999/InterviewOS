import assert from 'node:assert/strict'
import test from 'node:test'

import { NotFoundException } from '@nestjs/common'

import { AIObservabilityController } from './ai-observability.controller'

const GUARDS_METADATA = '__guards__'
const THROTTLER_LIMIT_AI = 'THROTTLER:LIMITai'
const THROTTLER_TTL_AI = 'THROTTLER:TTLai'

test('AIObservabilityController relies on global auth guard only', () => {
  assert.equal(Reflect.getMetadata(GUARDS_METADATA, AIObservabilityController), undefined)
})

test('AIObservabilityController applies AI throttling to observability endpoints', () => {
  assert.equal(
    Reflect.getMetadata(THROTTLER_LIMIT_AI, AIObservabilityController.prototype.getCostSummary),
    20,
  )
  assert.equal(
    Reflect.getMetadata(THROTTLER_TTL_AI, AIObservabilityController.prototype.getCostSummary),
    60_000,
  )
  assert.equal(
    Reflect.getMetadata(
      THROTTLER_LIMIT_AI,
      AIObservabilityController.prototype.getLatencyBreakdown,
    ),
    20,
  )
  assert.equal(
    Reflect.getMetadata(THROTTLER_TTL_AI, AIObservabilityController.prototype.getLatencyBreakdown),
    60_000,
  )
})

test('AIObservabilityController is disabled unless observability is explicitly enabled', async () => {
  const controller = new AIObservabilityController(
    {
      getCostSummary: async () => ({ total: 1 }),
      getLatencyBreakdown: async () => [{ operation: 'x' }],
    } as never,
    {
      get: (key: string, fallback?: unknown) =>
        key === 'ai.observabilityEnabled' ? false : fallback,
    } as never,
  )

  await assert.rejects(() => controller.getCostSummary('7'), NotFoundException)
  await assert.rejects(() => controller.getLatencyBreakdown('7'), NotFoundException)
})
