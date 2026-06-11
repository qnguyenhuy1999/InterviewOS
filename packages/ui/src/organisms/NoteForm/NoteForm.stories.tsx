import {
  EnglishLevel,
  ExperienceLevel,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
  type TechnicalNote,
  type UserLearningProfile,
} from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteForm } from './NoteForm'

const profileFixture: UserLearningProfile = {
  id: 'profile-1',
  userId: 'user-1',
  targetRole: 'Backend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.INTERMEDIATE,
  techStack: ['Node.js', 'PostgreSQL'],
  interviewGoals: ['Architecture depth', 'Stronger tradeoff explanations'],
  preferredOutputStyle: 'Clear and production-oriented',
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-10T09:00:00Z'),
}

const noteFixture: TechnicalNote & { questionCount: number; difficulty: QuestionDifficulty } = {
  id: 'note-1',
  userId: 'user-1',
  title: 'Redis Caching Strategies',
  topic: 'Caching',
  rawInput: 'Cache-aside, invalidation, TTL tuning, race conditions',
  type: NoteType.CONCEPT,
  status: NoteStatus.IN_PROGRESS,
  overrideRole: 'Staff Backend Engineer',
  overrideLevel: ExperienceLevel.SENIOR,
  overrideStack: ['Redis', 'Node.js'],
  overrideGoals: ['System design', 'Failure handling'],
  overrideEnglishLevel: EnglishLevel.UPPER_INTERMEDIATE,
  preferredOutputStyle: 'Structured with examples',
  structuredContent: null,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-10T09:00:00Z'),
  questionCount: 6,
  difficulty: QuestionDifficulty.MEDIUM,
}

const meta = {
  title: 'Organisms/NoteForm',
  component: NoteForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    profile: profileFixture,
    onSubmit: async () => {},
  },
} satisfies Meta<typeof NoteForm>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {}

export const Edit: Story = {
  args: {
    note: noteFixture,
  },
}
