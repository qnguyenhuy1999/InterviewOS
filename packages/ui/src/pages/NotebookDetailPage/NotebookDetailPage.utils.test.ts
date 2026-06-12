import assert from 'node:assert/strict'
import test from 'node:test'

import * as notebookDetailUtils from './NotebookDetailPage.utils'

const notebookDetailFixture = {
  note: {
    title: 'React reconciliation & the fiber architecture',
    topic: 'React',
    rawInput:
      'How React decides what to re-render, why keys matter, how interruption works, and what changed with concurrent rendering.',
    structuredContent: {
      purpose:
        'Explain how React turns UI updates into incremental work so you can reason about re-renders, priorities, and interruption in production systems.',
      quickReference: [
        'Reconciliation compares previous and next trees.',
        'Fiber breaks render work into units with priority metadata.',
        'Keys preserve identity across sibling lists.',
      ],
      coreConcepts: [
        'Element tree diffing vs instance preservation',
        'Fiber nodes as linked units of scheduled work',
        'Render phase vs commit phase responsibilities',
      ],
      mentalModel:
        'Fiber is React’s scheduler-friendly execution model: it keeps enough state per node to pause, resume, abandon, and commit UI work predictably.',
      productionUsage: [
        'Understanding why unstable keys reset local state',
        'Reasoning about transitions and urgent updates',
        'Debugging unexpected re-render chains in component trees',
      ],
      practicalExamples: [
        'Large searchable lists that defer expensive filtering',
        'Route transitions that preserve interactive input responsiveness',
      ],
      commonPitfalls: [
        'Using array indices as keys in reorderable lists',
        'Confusing render work with visible DOM mutations',
        'Assuming concurrent rendering means parallel DOM writes',
      ],
      debuggingChecklist: [
        'Inspect component keys and identity boundaries',
        'Confirm whether work was interrupted before commit',
        'Profile parent updates that cascade into child re-renders',
      ],
      productionChecklist: [
        'Use stable keys for persisted list items',
        'Separate urgent updates from deferred rendering work',
        'Profile before memoizing or restructuring components',
      ],
      seniorInterviewSignals: [
        'Explains scheduling tradeoffs instead of repeating definitions',
        'Connects reconciliation behavior to user-perceived responsiveness',
      ],
    },
  },
  questionCount: 8,
} as const

test('notebook detail exposes article sections in a reading-first order', () => {
  const getArticleSections = (notebookDetailUtils as Record<string, unknown>)
    .getNotebookDetailArticleSections as
    | ((data: (typeof notebookDetailFixture)['note']) => Array<{ key: string }>)
    | undefined

  assert.equal(typeof getArticleSections, 'function')

  assert.deepEqual(
    getArticleSections!(notebookDetailFixture.note).map((section) => section.key),
    [
      'summary',
      'coreConcepts',
      'mentalModel',
      'practicalExamples',
      'productionUsage',
      'commonPitfalls',
      'debuggingChecklist',
      'productionChecklist',
      'seniorInterviewSignals',
      'interviewAnswer',
    ],
  )
})

test('notebook detail derives a readable estimate for reading time', () => {
  const getReadingTimeLabel = (notebookDetailUtils as Record<string, unknown>)
    .getNotebookDetailEstimatedReadingTimeLabel as
    | ((data: typeof notebookDetailFixture) => string)
    | undefined

  assert.equal(typeof getReadingTimeLabel, 'function')
  assert.equal(getReadingTimeLabel!(notebookDetailFixture), '2 min read')
})

test('notebook detail composes an interview-ready answer from the structured note', () => {
  const getInterviewAnswer = (notebookDetailUtils as Record<string, unknown>)
    .getNotebookDetailInterviewAnswer as
    | ((data: typeof notebookDetailFixture) => string)
    | undefined

  assert.equal(typeof getInterviewAnswer, 'function')

  assert.match(
    getInterviewAnswer!(notebookDetailFixture),
    /React turns UI updates into incremental work/i,
  )
  assert.match(getInterviewAnswer!(notebookDetailFixture), /Fiber/i)
  assert.match(getInterviewAnswer!(notebookDetailFixture), /stable keys/i)
})
