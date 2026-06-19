import assert from 'node:assert/strict'
import test from 'node:test'

import { NoteStatus, NoteType, QuestionDifficulty } from '../../../packages/types/src/enums'
import {
  hydrateNotebookDetailView,
  hydrateNotebookNote,
  hydrateNotebookNotes,
} from './notebook-data'

test('hydrateNotebookNotes converts serialized notebook list timestamps into Date instances', () => {
  const notes = hydrateNotebookNotes([
    {
      id: 'note-1',
      userId: 'user-1',
      title: 'Queues',
      topic: 'System Design',
      rawInput: 'A quick note',
      type: NoteType.CONCEPT,
      status: NoteStatus.DRAFT,
      overrideRole: null,
      overrideLevel: null,
      overrideStack: [],
      overrideGoals: [],
      overrideEnglishLevel: null,
      preferredOutputStyle: null,
      structuredContent: null,
      createdAt: '2026-06-01T08:00:00.000Z',
      updatedAt: '2026-06-05T05:20:00.000Z',
      questionCount: 2,
      difficulty: QuestionDifficulty.MEDIUM,
    },
  ])

  assert.equal(notes[0]?.createdAt instanceof Date, true)
  assert.equal(notes[0]?.updatedAt instanceof Date, true)
  assert.equal(notes[0]?.updatedAt.toISOString(), '2026-06-05T05:20:00.000Z')
})

test('hydrateNotebookNote converts serialized note timestamps for edit routes', () => {
  const note = hydrateNotebookNote({
    id: 'note-1',
    userId: 'user-1',
    title: 'Queues',
    topic: 'System Design',
    rawInput: 'A quick note',
    type: NoteType.CONCEPT,
    status: NoteStatus.DRAFT,
    overrideRole: null,
    overrideLevel: null,
    overrideStack: [],
    overrideGoals: [],
    overrideEnglishLevel: null,
    preferredOutputStyle: null,
    structuredContent: null,
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: '2026-06-05T05:20:00.000Z',
  })

  assert.equal(note.createdAt instanceof Date, true)
  assert.equal(note.updatedAt instanceof Date, true)
})

test('hydrateNotebookDetailView converts nested notebook detail timestamps into Date instances', () => {
  const detail = hydrateNotebookDetailView({
    note: {
      id: 'note-1',
      userId: 'user-1',
      title: 'Queues',
      topic: 'System Design',
      rawInput: 'A quick note',
      type: NoteType.CONCEPT,
      status: NoteStatus.DRAFT,
      overrideRole: null,
      overrideLevel: null,
      overrideStack: [],
      overrideGoals: [],
      overrideEnglishLevel: null,
      preferredOutputStyle: null,
      structuredContent: null,
      createdAt: '2026-06-01T08:00:00.000Z',
      updatedAt: '2026-06-05T05:20:00.000Z',
    },
    questionCount: 2,
    generatedQuestions: [],
    relatedNotes: [
      {
        id: 'note-2',
        title: 'Workers',
        topic: 'System Design',
        type: NoteType.CONCEPT,
        status: NoteStatus.REVIEWING,
        updatedAt: '2026-06-04T02:00:00.000Z',
        questionCount: 4,
      },
    ],
  })

  assert.equal(detail.note.updatedAt instanceof Date, true)
  assert.equal(detail.relatedNotes[0]?.updatedAt instanceof Date, true)
})
