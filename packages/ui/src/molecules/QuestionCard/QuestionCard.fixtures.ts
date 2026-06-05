import { QuestionDifficulty } from '@interviewos/types'

export const questionFixtures = [
  {
    id: 'q-001',
    sessionId: 'session-001',
    question: 'Explain how React hooks work under the hood.',
    difficulty: QuestionDifficulty.MEDIUM,
    order: 1,
  },
  {
    id: 'q-002',
    sessionId: 'session-001',
    question: 'Design a scalable notification system.',
    difficulty: QuestionDifficulty.HARD,
    order: 2,
  },
  {
    id: 'q-003',
    sessionId: 'session-001',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    difficulty: QuestionDifficulty.EASY,
    order: 3,
  },
]

export const answerFixtures = [
  {
    id: 'a-001',
    questionId: 'q-001',
    transcript:
      'React hooks use a linked list stored on the fiber node to track state between renders...',
    score: 82,
    feedback:
      'Good explanation of the fiber architecture. Could elaborate on the dependency array semantics.',
    evaluatedAt: new Date('2025-02-10T10:15:00'),
  },
  {
    id: 'a-002',
    questionId: 'q-002',
    transcript: 'I would use a pub/sub architecture with Kafka for high-throughput delivery...',
    score: 76,
    feedback:
      'Solid approach. Consider discussing fan-out patterns and notification deduplication.',
    evaluatedAt: new Date('2025-02-10T10:35:00'),
  },
]
