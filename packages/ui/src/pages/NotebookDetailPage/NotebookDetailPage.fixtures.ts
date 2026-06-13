import {
  EnglishLevel,
  ExperienceLevel,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
} from '@interviewos/types'

import type { NotebookDetailPageFixture } from './NotebookDetailPage.types'

const userId = 'user-001'
const noteId = 'note-react-fiber'

export const notebookDetailFixture: NotebookDetailPageFixture = {
  note: {
    id: noteId,
    userId,
    title: 'React reconciliation & the fiber architecture',
    topic: 'React',
    rawInput:
      'How React decides what to re-render, why keys matter, how interruption works, and what changed with concurrent rendering.',
    type: NoteType.CONCEPT,
    status: NoteStatus.INTERVIEW_READY,
    overrideRole: 'Senior Frontend Engineer',
    overrideLevel: ExperienceLevel.SENIOR,
    overrideStack: ['React', 'TypeScript', 'Rendering'],
    overrideGoals: ['Frontend architecture depth', 'Stronger tradeoff explanations'],
    overrideEnglishLevel: EnglishLevel.UPPER_INTERMEDIATE,
    preferredOutputStyle: 'Concise and interview-ready',
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
    createdAt: new Date('2026-06-01T08:00:00.000Z'),
    updatedAt: new Date('2026-06-05T05:20:00.000Z'),
  },
  questionCount: 8,
  generatedQuestions: [
    {
      id: 'question-react-fiber-1',
      noteId,
      question:
        'Why does React need Fiber instead of processing the entire component tree in one synchronous pass?',
      category: 'Architecture',
      expectedAnswer:
        'Compare blocking work with interruptible scheduling, then explain how priorities improve responsiveness.',
      difficulty: QuestionDifficulty.HARD,
      expectedConcepts: ['Fiber scheduling', 'Priority lanes', 'Responsive rendering'],
      sourceSection: 'Core concepts',
    },
    {
      id: 'question-react-fiber-2',
      noteId,
      question:
        'What problem do keys solve during reconciliation, and what breaks when keys are unstable?',
      category: 'React internals',
      expectedAnswer:
        'Keys preserve sibling identity. Unstable keys cause state loss, wrong instance reuse, and noisier diffs.',
      difficulty: QuestionDifficulty.MEDIUM,
      expectedConcepts: ['Keys', 'Identity preservation', 'State retention'],
      sourceSection: 'Common pitfalls',
    },
    {
      id: 'question-react-fiber-3',
      noteId,
      question:
        'How would you explain the difference between the render phase and the commit phase to an interviewer?',
      category: 'Communication',
      expectedAnswer:
        'Render computes work and can be interrupted. Commit applies the final mutations and lifecycle effects.',
      difficulty: QuestionDifficulty.MEDIUM,
      expectedConcepts: ['Render phase', 'Commit phase', 'Interruption'],
      sourceSection: 'Mental model',
    },
  ],
  relatedNotes: [
    {
      id: 'note-node-loop',
      title: 'Node.js event loop phases',
      topic: 'Node.js',
      type: NoteType.LANGUAGE_SPECIFIC,
      status: NoteStatus.INTERVIEW_READY,
      updatedAt: new Date('2026-06-04T02:00:00.000Z'),
      questionCount: 6,
    },
    {
      id: 'note-nest-di',
      title: 'NestJS dependency injection in practice',
      topic: 'NestJS',
      type: NoteType.CONCEPT,
      status: NoteStatus.DRAFT,
      updatedAt: new Date('2026-06-02T09:00:00.000Z'),
      questionCount: 0,
    },
    {
      id: 'note-rate-limiter',
      title: 'Designing a distributed rate limiter',
      topic: 'System Design',
      type: NoteType.SYSTEM_DESIGN,
      status: NoteStatus.REVIEWING,
      updatedAt: new Date('2026-05-28T01:00:00.000Z'),
      questionCount: 4,
    },
  ],
}
