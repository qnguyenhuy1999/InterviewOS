import {
  type CompanyMode,
  ExperienceLevel,
  type NotebookNoteListItem,
  QuestionDifficulty,
  type UserLearningProfile,
} from '@interviewos/types'
import { EnglishLevel, NoteStatus, NoteType } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { StartInterviewForm } from './StartInterviewForm'

const profileFixture: UserLearningProfile = {
  id: 'profile-1',
  userId: 'user-1',
  targetRole: 'Senior Backend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.UPPER_INTERMEDIATE,
  techStack: ['Node.js', 'PostgreSQL', 'Redis'],
  interviewGoals: ['System design', 'Tradeoff communication'],
  preferredOutputStyle: 'Practical and concise',
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-10T09:00:00Z'),
}

const notes: NotebookNoteListItem[] = [
  {
    id: 'note-1',
    userId: 'user-1',
    title: 'Rate limiting',
    topic: 'System design',
    rawInput: 'Token bucket and sliding window',
    type: NoteType.CONCEPT,
    status: NoteStatus.READY,
    overrideRole: null,
    overrideLevel: null,
    overrideStack: [],
    overrideGoals: [],
    overrideEnglishLevel: null,
    preferredOutputStyle: null,
    structuredContent: null,
    createdAt: new Date('2026-06-02T09:00:00Z'),
    updatedAt: new Date('2026-06-10T09:00:00Z'),
    questionCount: 4,
    difficulty: QuestionDifficulty.MEDIUM,
  },
]

const companyModes: CompanyMode[] = [
  {
    id: 'company-1',
    slug: 'stripe-backend',
    name: 'Stripe Backend',
    config: {
      interviewerPersona: 'Direct and system-focused',
      difficultyProfile: {
        startingDifficulty: QuestionDifficulty.MEDIUM,
        escalationRate: 'MEDIUM',
        maxDifficulty: QuestionDifficulty.HARD,
      },
      followUpBehavior: {
        maxFollowUpsPerQuestion: 2,
        challengeThreshold: 0.7,
        clarificationThreshold: 0.4,
      },
      evaluationCriteria: {
        weights: { architecture: 0.4, communication: 0.3 },
        rubric: 'Focus on tradeoffs and operational thinking.',
      },
      feedbackStyle: 'DIRECT',
    },
    isActive: true,
    createdAt: new Date('2026-06-01T09:00:00Z'),
    updatedAt: new Date('2026-06-10T09:00:00Z'),
  },
]

const meta = {
  title: 'Organisms/StartInterviewForm',
  component: StartInterviewForm,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    companyModes,
    defaultMode: 'STANDARD',
    notes,
    profile: profileFixture,
    backHref: '/interview',
    onSubmit: async () => {},
  },
} satisfies Meta<typeof StartInterviewForm>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {}

export const Company: Story = {
  args: {
    defaultMode: 'COMPANY',
  },
}
