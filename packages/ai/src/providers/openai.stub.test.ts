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

test('OpenAIProvider falls back to chat completions when responses times out', async () => {
  const originalFetch = globalThis.fetch
  const requests: string[] = []
  const bodies: string[] = []

  globalThis.fetch = async (input, init) => {
    requests.push(typeof input === 'string' ? input : input.toString())
    bodies.push(typeof init?.body === 'string' ? init.body : '')

    if (requests.length === 1) {
      const timeoutError = new Error('The operation was aborted due to timeout')
      timeoutError.name = 'AbortError'
      throw timeoutError
    }

    assert.equal(
      init && typeof init === 'object' && 'method' in init ? init.method : undefined,
      'POST',
    )

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
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
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

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

    assert.deepEqual(requests, [
      'https://example.com/v1/responses',
      'https://example.com/v1/chat/completions',
    ])
    assert.equal(JSON.parse(bodies[1] ?? '{}').stream, false)
    assert.equal(result.result.title, 'Redis caching')
    assert.equal(result.metadata.tokenUsage?.inputTokens, 10)
    assert.equal(result.metadata.tokenUsage?.outputTokens, 20)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('OpenAIProvider falls back to chat completions when responses throws TimeoutError', async () => {
  const originalFetch = globalThis.fetch
  const requests: string[] = []

  globalThis.fetch = async (input) => {
    requests.push(typeof input === 'string' ? input : input.toString())

    if (requests.length === 1) {
      const timeoutError = new Error('The operation was aborted due to timeout')
      timeoutError.name = 'TimeoutError'
      throw timeoutError
    }

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
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
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

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

    assert.deepEqual(requests, [
      'https://example.com/v1/responses',
      'https://example.com/v1/chat/completions',
    ])
    assert.equal(result.result.title, 'Redis caching')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('OpenAIProvider prefers chat completions first for localhost gateways', async () => {
  const originalFetch = globalThis.fetch
  const requests: string[] = []

  globalThis.fetch = async (input) => {
    requests.push(typeof input === 'string' ? input : input.toString())

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
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
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const provider = new OpenAIProvider({
      apiKey: 'test-key',
      baseUrl: 'http://localhost:20128/v1',
      model: 'gpt-test',
    })

    const result = await provider.generateTechnicalNote({
      topic: 'Redis caching',
      noteType: NoteType.CONCEPT,
      targetLevel: ExperienceLevel.SENIOR,
      targetRole: 'Backend Engineer',
      englishLevel: EnglishLevel.INTERMEDIATE,
    })

    assert.deepEqual(requests, ['http://localhost:20128/v1/chat/completions'])
    assert.equal(result.result.title, 'Redis caching')
  } finally {
    globalThis.fetch = originalFetch
  }
})
