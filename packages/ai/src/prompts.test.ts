import assert from 'node:assert/strict'
import test from 'node:test'

import { technicalNotePrompt } from './prompts.ts'

const baseInput = {
  topic: 'React hooks',
  noteType: 'CONCEPT' as const,
  targetLevel: 'MID' as const,
  targetRole: 'Frontend Engineer',
  englishLevel: 'INTERMEDIATE' as const,
}

test('technicalNotePrompt instructions do not contain "concise"', () => {
  const { instructions } = technicalNotePrompt(baseInput)
  assert.ok(!instructions.toLowerCase().includes('concise'), `Found "concise" in: ${instructions}`)
})

test('technicalNotePrompt includes topic in user_input tags', () => {
  const { prompt } = technicalNotePrompt(baseInput)
  assert.ok(prompt.includes('<user_input>React hooks</user_input>'))
})

test('technicalNotePrompt QUICK depth gives focused instruction', () => {
  const { instructions } = technicalNotePrompt({ ...baseInput, explanationDepth: 'QUICK' as const })
  assert.ok(instructions.includes('focused') || instructions.includes('essential'))
})

test('technicalNotePrompt DEEP depth gives deep theory instruction', () => {
  const { instructions } = technicalNotePrompt({ ...baseInput, explanationDepth: 'DEEP' as const })
  assert.ok(
    instructions.toLowerCase().includes('deep') || instructions.toLowerCase().includes('theor'),
  )
})

test('technicalNotePrompt asks for self-contained notes that avoid external searching', () => {
  const { instructions } = technicalNotePrompt(baseInput)
  assert.match(instructions, /without needing to search elsewhere/i)
})

test('technicalNotePrompt asks for both tutorial depth and interview-ready guidance', () => {
  const { instructions } = technicalNotePrompt(baseInput)
  assert.match(instructions, /teach the topic end-to-end/i)
  assert.match(instructions, /interview-ready/i)
})

test('technicalNotePrompt INTERVIEW depth mentions interview signals', () => {
  const { instructions } = technicalNotePrompt({
    ...baseInput,
    explanationDepth: 'INTERVIEW' as const,
  })
  assert.ok(instructions.toLowerCase().includes('interview'))
})

test('technicalNotePrompt STANDARD depth gives balanced instruction', () => {
  const { instructions } = technicalNotePrompt({
    ...baseInput,
    explanationDepth: 'STANDARD' as const,
  })
  assert.ok(instructions.toLowerCase().includes('balanced'))
})

test('technicalNotePrompt prompt includes explanation depth field', () => {
  const { prompt } = technicalNotePrompt({ ...baseInput, explanationDepth: 'DEEP' as const })
  assert.ok(prompt.includes('Explanation depth'))
  assert.ok(prompt.includes('DEEP'))
})

test('technicalNotePrompt wraps user-supplied fields in user_input tags', () => {
  const { prompt } = technicalNotePrompt({
    ...baseInput,
    techStack: ['React', 'TypeScript'],
    interviewGoals: ['pass FAANG'],
  })
  assert.ok(prompt.includes('<user_input>React, TypeScript</user_input>'))
  assert.ok(prompt.includes('<user_input>pass FAANG</user_input>'))
})

test('technicalNotePrompt version is v1', () => {
  const result = technicalNotePrompt(baseInput)
  assert.equal(result.version, 'v1')
})
