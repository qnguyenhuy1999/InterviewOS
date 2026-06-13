import assert from 'node:assert/strict'

import { NoteStatus, NoteType } from '@interviewos/types'
import { test } from 'vitest'

import { notebookFixture } from './NotebookPage.fixtures'
import {
  getEnumLabel,
  getNotebookSummary,
  getNotebookTopicOptions,
  getVisibleNotebookNotes,
  isSelectedFilter,
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
