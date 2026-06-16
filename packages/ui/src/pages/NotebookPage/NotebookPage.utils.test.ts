import assert from 'node:assert/strict'

import { NoteStatus, NoteType } from '@interviewos/types'
import { test } from 'vitest'

import { notebookFixture } from './NotebookPage.fixtures'
import {
  getEnumLabel,
  getNotebookReadinessPercent,
  getNotebookSummary,
  getNotebookTopicOptions,
  getVisibleNotebookNotes,
  isSelectedFilter,
  sortNotebookNotes,
} from './NotebookPage.utils'

test('getNotebookTopicOptions returns sorted unique topics with ALL first', () => {
  assert.deepEqual(getNotebookTopicOptions(notebookFixture.notes), [
    'ALL',
    'Behavioral',
    'NestJS',
    'Node.js',
    'PostgreSQL',
    'React',
    'System Design',
  ])
})

test('getNotebookSummary prefers structured purpose and truncates long summaries', () => {
  const note = {
    ...notebookFixture.notes[0],
    structuredContent: null,
    rawInput: `${'A'.repeat(150)} trailing words`,
  }

  assert.equal(
    getNotebookSummary(notebookFixture.notes[0]),
    notebookFixture.notes[0].structuredContent?.purpose,
  )
  assert.equal(getNotebookSummary(note).length, 140)
  assert.match(getNotebookSummary(note), /\.\.\.$/)
})

test('getVisibleNotebookNotes filters by search, topic, status, and type', () => {
  assert.equal(
    getVisibleNotebookNotes({
      notes: notebookFixture.notes,
      empty: false,
      searchValue: 'redis as shared store',
    })[0]?.id,
    'note-rate-limiter',
  )

  assert.deepEqual(
    getVisibleNotebookNotes({
      notes: notebookFixture.notes,
      empty: false,
      selectedTopic: 'React',
      selectedStatus: NoteStatus.INTERVIEW_READY,
      selectedType: NoteType.CONCEPT,
    }).map((note) => note.id),
    ['note-react-fiber'],
  )

  assert.deepEqual(getVisibleNotebookNotes({ notes: notebookFixture.notes, empty: true }), [])
})

test('notebook enum labels and selected filters are human-readable', () => {
  assert.equal(getEnumLabel(NoteStatus.NEEDS_PRACTICE), 'Needs Practice')
  assert.equal(isSelectedFilter(undefined, 'ALL'), true)
  assert.equal(isSelectedFilter(NoteType.CONCEPT, NoteType.CONCEPT), true)
  assert.equal(isSelectedFilter(NoteType.BEHAVIORAL, NoteType.CONCEPT), false)
})

test('notebook readiness and sorting helpers are stable', () => {
  assert.equal(getNotebookReadinessPercent(NoteStatus.DRAFT), 15)
  assert.equal(getNotebookReadinessPercent(NoteStatus.INTERVIEW_READY), 85)
  assert.equal(getNotebookReadinessPercent(NoteStatus.MASTERED), 100)

  assert.deepEqual(
    sortNotebookNotes(notebookFixture.notes, 'questions-desc').map((note) => note.questionCount),
    [8, 6, 5, 4, 3, 0],
  )

  assert.deepEqual(
    sortNotebookNotes(notebookFixture.notes, 'title-asc').map((note) => note.title),
    [...notebookFixture.notes.map((note) => note.title)].sort((left, right) =>
      left.localeCompare(right),
    ),
  )
})
