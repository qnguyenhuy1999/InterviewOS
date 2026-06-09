import { InterviewType, NoteStatus, QuestionDifficulty } from '@interviewos/types'

import type {
  InterviewSessionPageFixture,
  InterviewSessionPageSession,
  InterviewSessionPageTurn,
} from './InterviewSessionPage.types'

export const interviewSessionFixtureTurns: InterviewSessionPageTurn[] = [
  {
    id: 'turn-1',
    role: 'INTERVIEWER',
    content: 'Design a rate limiter for a multi-tenant API.',
    turnNumber: 1,
    topicTags: ['system-design', 'apis'],
  },
  {
    id: 'turn-2',
    role: 'CANDIDATE',
    content:
      'I would start with token bucket per tenant, then add Redis-backed coordination only when a single node is no longer enough.',
    turnNumber: 2,
    topicTags: ['redis', 'architecture'],
    decision: 'FOLLOW_UP',
  },
  {
    id: 'turn-3',
    role: 'INTERVIEWER',
    content: 'How would you keep limits fair during traffic spikes?',
    turnNumber: 3,
    topicTags: ['fairness', 'burst-traffic'],
  },
]

export const interviewSessionFixtureSession: InterviewSessionPageSession = {
  id: 'session-multi-turn',
  type: InterviewType.SYSTEM_DESIGN,
  mode: 'MULTI_TURN',
  status: NoteStatus.REVIEWING,
  createdAt: new Date('2026-06-08T02:00:00Z'),
  updatedAt: new Date('2026-06-08T02:16:00Z'),
  version: 2,
  maxTurns: 6,
  lastActivityAt: new Date('2026-06-08T02:15:00Z'),
  companyMode: null,
  note: null,
  summary: {
    headline: 'The interviewer is pushing on fairness and distributed coordination.',
  },
  readinessImpact: {
    overallDelta: 4,
    technicalDelta: 6,
    behavioralDelta: 1,
    systemDesignDelta: 7,
    communicationDelta: 3,
  },
  questions: [
    {
      id: 'question-1',
      question: 'When would you use debounce instead of throttle in a search UI?',
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Frontend performance',
      expectedConcepts: ['debounce', 'throttle', 'search UX'],
      answer: null,
    },
  ],
}

export const interviewSessionPageFixture: InterviewSessionPageFixture = {
  session: interviewSessionFixtureSession,
  turns: interviewSessionFixtureTurns,
}
