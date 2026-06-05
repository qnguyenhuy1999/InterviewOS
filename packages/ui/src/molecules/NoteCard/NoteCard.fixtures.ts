import { NoteStatus, NoteType } from '@interviewos/types'

const userId = 'user-001'

export const noteFixtures = {
  published: {
    id: 'note-001',
    userId,
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
    userId,
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
    userId,
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
  userId,
  title: `Study Note #${i + 1}: ${noteTypeValues[i % noteTypeValues.length]}`,
  content: `Detailed content for study note ${i + 1}. Covers key concepts and patterns.`,
  noteType: noteTypeValues[i % noteTypeValues.length] as NoteType,
  status: i % 3 === 0 ? NoteStatus.DRAFT : NoteStatus.PUBLISHED,
  tags: ['tag-a', 'tag-b'],
  createdAt: new Date(2024, i % 12, (i % 28) + 1),
  updatedAt: new Date(2025, i % 12, (i % 28) + 1),
}))
