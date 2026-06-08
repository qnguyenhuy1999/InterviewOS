import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import DashboardPage from './DashboardPage'

const meta = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    actions: {
      allNotesHref: '#',
      allSessionsHref: '#',
      createNoteHref: '#',
      englishNotesHref: '#',
      quickStartHref: '#',
      readinessHref: '#',
      reviewQueueHref: '#',
      startInterviewHref: '#',
    },
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Dashboard">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {
  args: {
    state: {
      kind: 'ready',
      progress: {
        interviewReadiness: 75,
        technicalMastery: 80,
        englishScore: 85,
        reviewStreak: 5,
        questionsPracticed: 120,
        notesMastered: 30,
        dueReviews: 10,
        weakConceptTrends: [
          { concept: 'Dynamic Programming', occurrenceCount: 5, status: 'RESOLVED' },
          { concept: 'System Design', occurrenceCount: 3, status: 'IN_PROGRESS' },
          { concept: 'Behavioral Questions', occurrenceCount: 2, status: 'NOT_STARTED' },
        ],
      },
      readiness: {
        overallScore: 75,
        confidenceLevel: 80,
        improvementTrend: 10,
        breakdown: [
          {
            dimension: 'Coding',
            label: 'Coding',
            score: 80,
            weight: 0.5,
            trend: 'UP',
          },
          {
            dimension: 'System Design',
            label: 'System Design',
            score: 70,
            weight: 0.3,
            trend: 'STABLE',
          },
          {
            dimension: 'Behavioral',
            label: 'Behavioral',
            score: 75,
            weight: 0.2,
            trend: 'DOWN',
          },
        ],
      },
    },
  },
}

export const Loading: Story = {
  args: { state: { kind: 'loading' } },
}

export const EmptyStateView: Story = {
  args: { state: { kind: 'empty' } },
}

export const Error: Story = {
  args: {
    state: {
      kind: 'error',
      message: 'Unable to connect to the server. Please check your connection and try again.',
    },
  },
}
