import assert from 'node:assert/strict'
import test from 'node:test'

import { EnglishNoteStatus } from '@interviewos/types'

import { EnglishNotesService } from './english-notes.service'

test('EnglishNotesService updates status and syncs the note into review items', async () => {
  let syncedNotes: Array<Record<string, unknown>> | undefined
  const service = new EnglishNotesService(
    {
      updateStatus: async (_userId: string, englishNoteId: string, status: EnglishNoteStatus) => ({
        id: englishNoteId,
        grammarTopic: 'Verb tense',
        originalSentence: 'I has built APIs.',
        status,
      }),
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
    } as never,
    {
      syncEnglishNoteReviews: async (_userId: string, notes: Array<Record<string, unknown>>) => {
        syncedNotes = notes
      },
    } as never,
  )

  const note = await service.updateEnglishNoteStatus(
    { id: 'user-1' },
    'english-note-1',
    { status: EnglishNoteStatus.MASTERED },
  )

  assert.equal(note.status, EnglishNoteStatus.MASTERED)
  assert.deepEqual(syncedNotes, [
    {
      id: 'english-note-1',
      grammarTopic: 'Verb tense',
      originalSentence: 'I has built APIs.',
      status: EnglishNoteStatus.MASTERED,
    },
  ])
})
