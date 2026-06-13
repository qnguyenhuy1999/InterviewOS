import assert from 'node:assert/strict'

import { EnglishNoteStatus } from '@interviewos/types'
import { test } from 'vitest'

import { englishNotesFixture } from './EnglishNotesPage.fixtures'
import { getEnglishMasteryPercentage, getEnglishStatusClassName, getEnglishTopicGroups } from './EnglishNotesPage.utils'

test('getEnglishTopicGroups groups by grammar topic and sorts by volume', () => {
  const groups = getEnglishTopicGroups(englishNotesFixture.notes)

  assert.deepEqual(
    groups.map((group) => [group.name, group.total, group.mastered, group.needsPractice, group.masteryPercentage]),
    [
      ['Prepositions', 2, 1, 0, 50],
      ['Subject-verb agreement', 1, 0, 1, 0],
      ['Verb tense', 1, 0, 0, 0],
    ],
  )
})

test('english note helpers handle empty and status-specific states', () => {
  assert.equal(getEnglishMasteryPercentage([]), 0)
  assert.equal(getEnglishMasteryPercentage(englishNotesFixture.notes), 25)
  assert.match(getEnglishStatusClassName(EnglishNoteStatus.MASTERED), /success/)
  assert.match(getEnglishStatusClassName(EnglishNoteStatus.NEEDS_PRACTICE), /destructive/)
})
