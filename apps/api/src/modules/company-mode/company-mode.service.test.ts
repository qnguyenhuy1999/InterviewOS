import assert from 'node:assert/strict'
import test from 'node:test'

import { NotFoundException } from '@nestjs/common'

import { CompanyModeService } from './company-mode.service'

test('CompanyModeService returns company modes by slug', async () => {
  const service = new CompanyModeService({
    findBySlug: async (slug: string) => ({ slug, name: 'Amazon Loop' }),
  } as never)

  assert.deepEqual(await service.findBySlug('amazon'), { slug: 'amazon', name: 'Amazon Loop' })
})

test('CompanyModeService throws NotFoundException for unknown slugs', async () => {
  const service = new CompanyModeService({
    findBySlug: async () => null,
  } as never)

  await assert.rejects(service.findBySlug('missing'), NotFoundException)
})
