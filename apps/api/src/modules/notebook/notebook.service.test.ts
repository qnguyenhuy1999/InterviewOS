import assert from 'node:assert/strict'
import test from 'node:test'

import { NotebookService } from './notebook.service'

test('NotebookService uses saved onboarding defaults when note overrides are absent', async () => {
  let capturedInput: Record<string, unknown> | undefined
  let savedMetadata: Record<string, unknown> | undefined

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
      setNoteStatus: async () => undefined,
      replaceGeneratedContent: async (
        _userId: string,
        _noteId: string,
        payload: Record<string, unknown>,
      ) => {
        savedMetadata = payload.aiMetadata as Record<string, unknown>
        return payload
      },
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1', email: 'user@example.com' }),
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
          result: {
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
          },
          metadata: {
            provider: 'mock',
            model: 'mock-model',
            promptKey: 'technical-note.v1',
            promptVersion: 'v1',
            schemaKey: 'technical_note',
            schemaVersion: 'v1',
            inputHash: 'abc123',
            validationStatus: 'success',
            tokenUsage: { totalTokens: 42 },
            latencyMs: 5,
            generatedAt: new Date().toISOString(),
          },
        }
      },
    } as never,
    {
      build: () => ({
        learningState: {
          targetLevel: 'SENIOR',
          englishLevel: 'INTERMEDIATE',
          techStack: ['TypeScript', 'Redis'],
          targetRole: 'Backend Engineer',
          interviewGoals: ['Tradeoffs'],
          activeWeakConcepts: [],
          weakConceptCount: 0,
        },
        explanationDepth: 'DEEP',
      }),
    } as never,
    {
      syncTechnicalNoteReview: async () => undefined,
      replaceQuestionReviews: async () => undefined,
    } as never,
  )

  await service.generateTechnicalNote({ id: 'user-1' }, 'note-1')
  await new Promise((resolve) => setImmediate(resolve))

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
    explanationDepth: 'DEEP',
  })
  assert.equal(savedMetadata?.promptKey, 'technical-note.v1')
})
