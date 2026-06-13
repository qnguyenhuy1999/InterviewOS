import assert from 'node:assert/strict'
import test from 'node:test'

import { EnglishLevel, ExperienceLevel } from '@interviewos/types'

import { UsersService } from './users.service'

test('UsersService updateMe preserves the existing name when payload omits it', async () => {
  let updatedPayload: Record<string, unknown> | undefined
  const service = new UsersService({
    ensureUserById: async () => ({ id: 'user-1', name: 'Ada Lovelace' }),
    updateById: async (_userId: string, payload: Record<string, unknown>) => {
      updatedPayload = payload
      return { id: 'user-1', ...payload }
    },
  } as never)

  const result = await service.updateMe({ id: 'user-1' }, {})

  assert.deepEqual(updatedPayload, { name: 'Ada Lovelace' })
  assert.equal(result.name, 'Ada Lovelace')
})

test('UsersService upsertProfile validates onboarding payloads before persisting', async () => {
  let persistedProfile: Record<string, unknown> | undefined
  const service = new UsersService({
    ensureUserById: async () => ({ id: 'user-1' }),
    upsertProfile: async (_userId: string, input: Record<string, unknown>) => {
      persistedProfile = input
      return input
    },
  } as never)

  await service.upsertProfile({ id: 'user-1' }, {
    targetRole: 'Backend Engineer',
    currentLevel: ExperienceLevel.MID,
    targetLevel: ExperienceLevel.SENIOR,
    englishLevel: EnglishLevel.ADVANCED,
    techStack: ['TypeScript', 'PostgreSQL'],
    interviewGoals: ['System design'],
    preferredOutputStyle: 'Concise',
  })

  assert.deepEqual(persistedProfile?.techStack, ['TypeScript', 'PostgreSQL'])
  await assert.rejects(
    service.upsertProfile({ id: 'user-1' }, {
      targetRole: '',
      currentLevel: ExperienceLevel.MID,
      targetLevel: ExperienceLevel.SENIOR,
      englishLevel: EnglishLevel.ADVANCED,
      techStack: [],
      interviewGoals: [],
      preferredOutputStyle: 'Concise',
    }),
  )
})
