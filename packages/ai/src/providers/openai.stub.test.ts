import assert from 'node:assert/strict'
import test from 'node:test'

import { EnglishLevel, ExperienceLevel, NoteType } from '@interviewos/types'

import { OpenAIProvider } from './openai.stub'

test('OpenAIProvider unwraps wrapped structured output payloads', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        output_parsed: {
          content: JSON.stringify({
            title: 'Redis caching',
            content: {
              purpose: 'Understand Redis caching tradeoffs.',
              quickReference: ['Know cache-aside.'],
              coreConcepts: ['Eviction policies'],
              mentalModel: 'Cache hot paths, not everything.',
              productionUsage: ['Use caching for read-heavy endpoints.'],
              practicalExamples: ['Product detail pages'],
              commonPitfalls: ['Stale cache'],
              debuggingChecklist: ['Check TTL'],
              productionChecklist: ['Define invalidation'],
              seniorInterviewSignals: ['Discuss consistency tradeoffs'],
            },
            sections: [{ heading: 'Purpose', content: 'Why Redis caching matters.' }],
          }),
        },
        usage: { input_tokens: 10, output_tokens: 20, total_tokens: 30 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )

  try {
    const provider = new OpenAIProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.com/v1',
      model: 'gpt-test',
    })

    const result = await provider.generateTechnicalNote({
      topic: 'Redis caching',
      noteType: NoteType.CONCEPT,
      targetLevel: ExperienceLevel.SENIOR,
      targetRole: 'Backend Engineer',
      englishLevel: EnglishLevel.INTERMEDIATE,
    })

    assert.equal(result.result.title, 'Redis caching')
    assert.equal(result.result.content.purpose, 'Understand Redis caching tradeoffs.')
    assert.equal(result.result.sections[0]?.heading, 'Purpose')
  } finally {
    globalThis.fetch = originalFetch
  }
})
