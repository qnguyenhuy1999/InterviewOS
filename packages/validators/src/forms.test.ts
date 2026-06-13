import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EnglishLevel,
  ExperienceLevel,
  InterviewType,
  NoteStatus,
  NoteType,
} from '@interviewos/types'

import {
  interviewAnswerFormSchema,
  interviewAnswerSchema,
  startInterviewSessionSchema,
} from './interview'
import {
  startMultiTurnSessionFormSchema,
  startMultiTurnSessionSchema,
  submitTurnSchema,
} from './interview-turn'
import { noteCreateSchema, noteFormSchema, noteUpdateSchema } from './note'
import { onboardingSchema, profileUpdateSchema } from './onboarding'

const profileFields = {
  targetRole: 'Backend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.ADVANCED,
  techStack: 'TypeScript, Node.js',
  interviewGoals: 'System design, communication',
  preferredOutputStyle: 'Concise',
}

const advancedFormFields = {
  targetRole: 'Backend Engineer',
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.ADVANCED,
  techStack: 'TypeScript, Node.js',
  interviewGoals: 'System design',
  preferredOutputStyle: 'Concise',
}

test('onboarding schemas require non-empty learning profile details', () => {
  assert.equal(
    onboardingSchema.safeParse({
      targetRole: 'Backend Engineer',
      currentLevel: ExperienceLevel.MID,
      targetLevel: ExperienceLevel.SENIOR,
      englishLevel: EnglishLevel.ADVANCED,
      techStack: ['TypeScript'],
      interviewGoals: ['System design'],
      preferredOutputStyle: 'Concise',
    }).success,
    true,
  )

  assert.equal(
    onboardingSchema.safeParse({ ...profileFields, techStack: [], interviewGoals: [] }).success,
    false,
  )
})

test('profileUpdateSchema validates comma-separated profile fields', () => {
  assert.equal(profileUpdateSchema.safeParse(profileFields).success, true)
  assert.equal(
    profileUpdateSchema.safeParse({ ...profileFields, techStack: ' , , ' }).success,
    false,
  )
  assert.equal(
    profileUpdateSchema.safeParse({ ...profileFields, interviewGoals: '' }).success,
    false,
  )
})

test('noteCreateSchema defaults note type and noteUpdateSchema allows status-only updates', () => {
  const note = noteCreateSchema.parse({
    title: 'Redis caching',
    roughNotes: 'Cache-aside, TTLs, invalidation.',
  })

  assert.equal(note.type, NoteType.CONCEPT)
  assert.equal(noteUpdateSchema.safeParse({ status: NoteStatus.MASTERED }).success, true)
  assert.equal(noteCreateSchema.safeParse({ title: '', roughNotes: 'notes' }).success, false)
})

test('noteFormSchema only requires override fields when advanced settings are enabled', () => {
  assert.equal(
    noteFormSchema.safeParse({
      title: 'Redis caching',
      topic: '',
      roughNotes: 'Cache-aside notes',
      type: NoteType.CONCEPT,
      advancedEnabled: false,
      ...advancedFormFields,
      targetRole: '',
      techStack: '',
      interviewGoals: '',
      preferredOutputStyle: '',
    }).success,
    true,
  )

  assert.equal(
    noteFormSchema.safeParse({
      title: 'Redis caching',
      topic: '',
      roughNotes: 'Cache-aside notes',
      type: NoteType.CONCEPT,
      advancedEnabled: true,
      ...advancedFormFields,
      targetRole: '',
      techStack: '',
      interviewGoals: '',
      preferredOutputStyle: '',
    }).success,
    false,
  )
})

test('interview schemas validate session ids, answers, and advanced override fields', () => {
  assert.equal(
    startInterviewSessionSchema.safeParse({ generatedQuestionId: 'question-1' }).success,
    true,
  )
  assert.equal(
    interviewAnswerSchema.safeParse({ answer: 'Use cache-aside with TTLs.' }).success,
    true,
  )
  assert.equal(
    submitTurnSchema.safeParse({ answer: 'I would clarify requirements first.' }).success,
    true,
  )

  assert.equal(startInterviewSessionSchema.safeParse({ generatedQuestionId: '' }).success, false)
  assert.equal(interviewAnswerSchema.safeParse({ answer: '' }).success, false)
  assert.equal(
    interviewAnswerFormSchema.safeParse({
      answer: 'Use cache-aside with TTLs.',
      advancedEnabled: true,
      ...advancedFormFields,
      techStack: ' , ',
    }).success,
    false,
  )
})

test('multi-turn session form validates mode-specific values and turn limits', () => {
  assert.equal(
    startMultiTurnSessionSchema.safeParse({
      type: InterviewType.SYSTEM_DESIGN,
      companyModeSlug: 'amazon',
      maxTurns: 8,
    }).success,
    true,
  )

  assert.equal(
    startMultiTurnSessionFormSchema.safeParse({
      type: InterviewType.SYSTEM_DESIGN,
      mode: 'COMPANY',
      companyModeSlug: 'amazon',
      noteId: '',
      overrideRole: 'Staff Engineer',
      overrideLevel: ExperienceLevel.STAFF,
      overrideStack: 'TypeScript, PostgreSQL',
      maxTurns: 8,
    }).success,
    true,
  )
  assert.equal(
    startMultiTurnSessionFormSchema.safeParse({
      type: InterviewType.SYSTEM_DESIGN,
      mode: 'COMPANY',
      companyModeSlug: 'amazon',
      noteId: '',
      overrideRole: 'Staff Engineer',
      overrideLevel: ExperienceLevel.STAFF,
      overrideStack: ' , ',
      maxTurns: 31,
    }).success,
    false,
  )
})
