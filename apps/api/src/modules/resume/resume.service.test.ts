import assert from 'node:assert/strict'
import test from 'node:test'

import { BadRequestException } from '@nestjs/common'

import { ResumeService } from './resume.service'

test('ResumeService findLatest maps stored analysis JSON into public resume analysis', async () => {
  const createdAt = new Date('2026-06-01T00:00:00Z')
  const service = new ResumeService(
    {
      findLatestAnalysis: async () => ({
        id: 'analysis-1',
        userId: 'user-1',
        rawText: 'Resume text',
        analysisResult: {
          score: 88,
          strengths: ['Backend systems'],
          gaps: ['More metrics'],
          recommendations: ['Quantify impact'],
          keySkillsFound: ['TypeScript'],
          targetRole: 'Senior Backend Engineer',
          targetLevel: 'SENIOR',
          fileName: 'resume.txt',
        },
        createdAt,
      }),
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
    } as never,
    {} as never,
  )

  assert.deepEqual(await service.findLatest({ id: 'user-1' }), {
    id: 'analysis-1',
    userId: 'user-1',
    resumeText: 'Resume text',
    score: 88,
    strengths: ['Backend systems'],
    gaps: ['More metrics'],
    recommendations: ['Quantify impact'],
    keySkillsFound: ['TypeScript'],
    targetRole: 'Senior Backend Engineer',
    targetLevel: 'SENIOR',
    fileName: 'resume.txt',
    analyzedAt: createdAt,
  })
})

test('ResumeService findLatest rejects invalid stored analysis JSON', async () => {
  const service = new ResumeService(
    {
      findLatestAnalysis: async () => ({
        id: 'analysis-1',
        userId: 'user-1',
        rawText: 'Resume text',
        analysisResult: { score: 'bad' },
        createdAt: new Date(),
      }),
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
    } as never,
    {} as never,
  )

  await assert.rejects(service.findLatest({ id: 'user-1' }), BadRequestException)
})
