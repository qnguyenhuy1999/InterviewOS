import assert from 'node:assert/strict'
import test from 'node:test'

import { NotebookService } from './notebook.service'

test('NotebookService uses saved onboarding defaults when note overrides are absent', async () => {
  let capturedInput: Record<string, unknown> | undefined

  const service = new NotebookService(
    {
      findNoteById: async () => ({
        id: 'note-1',
        title: 'Redis',
        type: 'CONCEPT',
        rawInput: 'rough',
        overrideRole: null,
        overrideLevel: null,
        overrideStack: [],
        overrideGoals: [],
        overrideEnglishLevel: null,
        preferredOutputStyle: null,
      }),
      replaceGeneratedContent: async (_noteId: string, payload: Record<string, unknown>) => payload,
    } as never,
    {
      ensureUserByEmail: async () => ({ id: 'user-1', email: 'user@example.com' }),
      findProfileByUserId: async () => ({
        targetRole: 'Backend Engineer',
        targetLevel: 'SENIOR',
        englishLevel: 'INTERMEDIATE',
        techStack: ['TypeScript', 'Redis'],
        interviewGoals: ['Tradeoffs'],
        preferredOutputStyle: 'Practical',
      }),
    } as never,
    {
      generateTechnicalNote: async (input: Record<string, unknown>) => {
        capturedInput = input
        return {
          title: 'Redis',
          content: {
            purpose: 'purpose',
            quickReference: ['ref'],
            coreConcepts: ['concept'],
            mentalModel: 'model',
            productionUsage: ['usage'],
            practicalExamples: ['example'],
            commonPitfalls: ['pitfall'],
            debuggingChecklist: ['debug'],
            productionChecklist: ['prod'],
            seniorInterviewSignals: ['signal'],
          },
          sections: [{ heading: 'Purpose', content: 'purpose' }],
        }
      },
    } as never,
  )

  await service.generateTechnicalNote({ email: 'user@example.com' }, 'note-1')

  assert.deepEqual(capturedInput, {
    topic: 'Redis',
    noteType: 'CONCEPT',
    targetLevel: 'SENIOR',
    targetRole: 'Backend Engineer',
    englishLevel: 'INTERMEDIATE',
    techStack: ['TypeScript', 'Redis'],
    interviewGoals: ['Tradeoffs'],
    preferredOutputStyle: 'Practical',
    additionalContext: 'rough',
  })
})
