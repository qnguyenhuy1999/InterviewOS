import type { InterviewEvaluation } from '@interviewos/types'
import { EvaluationStatus, InterviewType, NoteStatus } from '@interviewos/types'

import type {
  InterviewReviewPageFixture,
  InterviewReviewPageSession,
  InterviewReviewPageTurn,
} from './InterviewReviewPage.types'

export const interviewReviewFixtureSession: InterviewReviewPageSession = {
  id: 'session-review-frontend',
  type: InterviewType.TECHNICAL,
  status: NoteStatus.PUBLISHED,
  createdAt: new Date('2026-06-07T09:00:00Z'),
  endedAt: new Date('2026-06-07T09:46:00Z'),
  readinessImpact: {
    id: 'impact-1',
    sessionId: 'session-review-frontend',
    userId: 'user-1',
    overallDelta: 7,
    technicalDelta: 9,
    behavioralDelta: 3,
    systemDesignDelta: 4,
    communicationDelta: 6,
    consistencyDelta: 5,
    snapshot: null,
    createdAt: new Date('2026-06-07T09:47:00Z'),
  },
  summary: {
    id: 'summary-1',
    sessionId: 'session-review-frontend',
    generatedFromVersion: 3,
    headline: 'Strong debugging instinct with clearer tradeoff framing needed.',
    keyTakeaways: [
      'Explained cache invalidation risks before proposing code changes.',
      'Recovered from a misleading hypothesis by checking runtime behavior.',
      'Missed one opportunity to compare optimistic and pessimistic update strategies.',
    ],
    strengths: [],
    weaknesses: [],
    recommendations: [],
    transcript: null,
    createdAt: new Date('2026-06-07T09:47:00Z'),
    updatedAt: new Date('2026-06-07T09:47:00Z'),
  },
}

export const interviewReviewFixtureEvaluation: InterviewEvaluation = {
  id: 'evaluation-1',
  sessionId: 'session-review-frontend',
  status: EvaluationStatus.COMPLETE,
  overallScore: 84,
  summary: 'Clear technical reasoning with good structure and moderate depth.',
  confidence: 88,
  dimensionScores: {
    correctness: 86,
    depth: 79,
    problemSolving: 85,
    clarity: 90,
    structure: 87,
    confidence: 82,
  },
  starScores: null,
  designScores: null,
  rubricScores: [
    { key: 'debugging', label: 'Debugging', score: 88, evidence: [] },
    { key: 'communication', label: 'Communication', score: 90, evidence: [] },
    { key: 'tradeoffs', label: 'Tradeoffs', score: 74, evidence: [] },
  ],
  evidence: [
    {
      quote: 'I would verify the stale state came from the cache before touching the mutation.',
      rationale: 'Shows good problem-isolation discipline.',
      turnNumber: 2,
    },
    {
      quote: 'The optimistic update looks fast, but it increases rollback complexity.',
      rationale: 'Demonstrates practical tradeoff thinking.',
      turnNumber: 5,
    },
  ],
  weaknesses: [
    {
      title: 'Tradeoff depth',
      detail: 'Risk analysis was directionally correct but lacked cost estimates.',
      severity: 'MEDIUM',
    },
  ],
  recommendations: [
    {
      title: 'Quantify architecture choices',
      detail: 'Practice comparing options with latency, complexity, and failure-mode costs.',
      priority: 'NOW',
    },
    {
      title: 'Tighten summary answers',
      detail: 'End longer explanations with a one-sentence recommendation.',
      priority: 'NEXT',
    },
  ],
  strengths: ['Debugging discipline', 'Clear communication'],
  improvements: ['More precise tradeoff analysis'],
  coachingNotes: ['Lead with decision, then supporting rationale.'],
  weakConcepts: ['Rollback strategy'],
  createdAt: new Date('2026-06-07T09:47:00Z'),
  updatedAt: new Date('2026-06-07T09:47:00Z'),
}

export const interviewReviewFixtureTurns: InterviewReviewPageTurn[] = [
  {
    id: 'turn-1',
    role: 'INTERVIEWER',
    content: 'Walk me through how you would debug a stale React Query cache after a mutation.',
    turnNumber: 1,
    topicTags: ['react-query', 'debugging'],
  },
  {
    id: 'turn-2',
    role: 'CANDIDATE',
    content:
      'I would confirm whether the server returned fresh data, then inspect the cache keys and invalidation path.',
    turnNumber: 2,
    topicTags: ['react-query', 'state-management'],
    decision: 'FOLLOW_UP',
  },
  {
    id: 'turn-3',
    role: 'INTERVIEWER',
    content: 'When would you avoid an optimistic update here?',
    turnNumber: 3,
    topicTags: ['mutations'],
  },
  {
    id: 'turn-4',
    role: 'CANDIDATE',
    content:
      'I would avoid it when rollback is complex or when other data dependencies make consistency hard to guarantee.',
    turnNumber: 4,
    topicTags: ['mutations', 'tradeoffs'],
    decision: 'EVALUATE',
    reasoning: 'Candidate understands the default but should quantify the cost more sharply.',
  },
]

export const interviewReviewPageFixture: InterviewReviewPageFixture = {
  session: interviewReviewFixtureSession,
  turns: interviewReviewFixtureTurns,
  evaluation: interviewReviewFixtureEvaluation,
}
