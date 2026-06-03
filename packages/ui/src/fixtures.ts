/**
 * Shared story fixtures — import from here to avoid inline duplication across stories.
 * Self-contained: mirrors types from @interviewos/types without importing the package.
 */

// ---------------------------------------------------------------------------
// Enum mirrors (keep in sync with @interviewos/types/src/enums.ts)
// ---------------------------------------------------------------------------

export const ExperienceLevel = {
  JUNIOR: 'JUNIOR',
  MID: 'MID',
  SENIOR: 'SENIOR',
  STAFF: 'STAFF',
  PRINCIPAL: 'PRINCIPAL',
} as const
export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel]

export const NoteStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const
export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus]

export const NoteType = {
  CONCEPT: 'CONCEPT',
  ALGORITHM: 'ALGORITHM',
  SYSTEM_DESIGN: 'SYSTEM_DESIGN',
  BEHAVIORAL: 'BEHAVIORAL',
  LANGUAGE_SPECIFIC: 'LANGUAGE_SPECIFIC',
} as const
export type NoteType = (typeof NoteType)[keyof typeof NoteType]

export const InterviewType = {
  TECHNICAL: 'TECHNICAL',
  BEHAVIORAL: 'BEHAVIORAL',
  SYSTEM_DESIGN: 'SYSTEM_DESIGN',
  MIXED: 'MIXED',
} as const
export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType]

export const QuestionDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EXPERT: 'EXPERT',
} as const
export type QuestionDifficulty = (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty]

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const userFixtures = {
  jane: {
    id: 'user-001',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-03-10'),
  },
  anonymous: {
    id: 'user-002',
    email: 'anon@example.com',
    name: null as string | null,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
}

export const learningProfileFixture = {
  id: 'profile-001',
  userId: userFixtures.jane.id,
  targetRole: 'Frontend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  techStack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  interviewGoals: ['System Design', 'Frontend Architecture', 'React Internals'],
  englishLevel: 'ADVANCED',
  preferredOutputStyle: 'concise',
  createdAt: new Date('2024-01-20'),
  updatedAt: new Date('2025-02-01'),
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export const noteFixtures = {
  published: {
    id: 'note-001',
    userId: userFixtures.jane.id,
    title: 'React Reconciliation Algorithm',
    content:
      "React's reconciliation algorithm determines how the virtual DOM updates efficiently using a diffing strategy based on two assumptions: two elements of different types produce different trees, and the developer can hint at stable children with a key prop.",
    noteType: NoteType.ALGORITHM,
    status: NoteStatus.PUBLISHED,
    tags: ['react', 'algorithms', 'frontend'],
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-10-01'),
  },
  draft: {
    id: 'note-002',
    userId: userFixtures.jane.id,
    title: 'System Design: URL Shortener',
    content: 'Draft notes on designing a scalable URL shortener service...',
    noteType: NoteType.SYSTEM_DESIGN,
    status: NoteStatus.DRAFT,
    tags: ['system-design', 'backend'],
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  archived: {
    id: 'note-003',
    userId: userFixtures.jane.id,
    title: 'Old JavaScript Patterns',
    content: 'Legacy patterns that have been superseded by modern JavaScript.',
    noteType: NoteType.CONCEPT,
    status: NoteStatus.ARCHIVED,
    tags: ['javascript', 'legacy'],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

const noteTypeValues = Object.values(NoteType)
export const manyNotes = Array.from({ length: 20 }, (_, i) => ({
  id: `note-bulk-${i}`,
  userId: userFixtures.jane.id,
  title: `Study Note #${i + 1}: ${noteTypeValues[i % noteTypeValues.length]}`,
  content: `Detailed content for study note ${i + 1}. Covers key concepts and patterns.`,
  noteType: noteTypeValues[i % noteTypeValues.length] as NoteType,
  status: i % 3 === 0 ? NoteStatus.DRAFT : NoteStatus.PUBLISHED,
  tags: ['tag-a', 'tag-b'],
  createdAt: new Date(2024, i % 12, (i % 28) + 1),
  updatedAt: new Date(2025, i % 12, (i % 28) + 1),
}))

// ---------------------------------------------------------------------------
// Interviews
// ---------------------------------------------------------------------------

export const interviewSessionFixtures = {
  technical: {
    id: 'session-001',
    userId: userFixtures.jane.id,
    interviewType: InterviewType.TECHNICAL,
    startedAt: new Date('2025-02-10T10:00:00'),
    endedAt: new Date('2025-02-10T11:00:00'),
  },
  inProgress: {
    id: 'session-002',
    userId: userFixtures.jane.id,
    interviewType: InterviewType.MIXED,
    startedAt: new Date('2025-06-03T09:00:00'),
    endedAt: null as Date | null,
  },
}

export const questionFixtures = [
  {
    id: 'q-001',
    sessionId: interviewSessionFixtures.technical.id,
    question: 'Explain how React hooks work under the hood.',
    difficulty: QuestionDifficulty.MEDIUM,
    order: 1,
  },
  {
    id: 'q-002',
    sessionId: interviewSessionFixtures.technical.id,
    question: 'Design a scalable notification system.',
    difficulty: QuestionDifficulty.HARD,
    order: 2,
  },
  {
    id: 'q-003',
    sessionId: interviewSessionFixtures.technical.id,
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

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

export const dashboardStats = {
  totalSessions: 24,
  averageScore: 79,
  notesCount: 47,
  streakDays: 12,
  topicsStudied: ['React', 'System Design', 'TypeScript', 'Algorithms'],
  recentScores: [72, 78, 81, 79, 85, 76, 83],
}
