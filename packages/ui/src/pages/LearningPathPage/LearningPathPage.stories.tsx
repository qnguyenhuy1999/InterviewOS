import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import LearningPathPage from './LearningPathPage'

const meta = {
  title: 'Pages/LearningPathPage',
  component: LearningPathPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    state: {
      kind: 'ready',
      items: [
        {
          id: '1',
          userId: 'user-123',
          type: 'review',
          title: 'Review "Dynamic programming"',
          reason: 'Low mastery score in recent review',
          actionPath: '/review/1',
          status: 'PENDING',
          priorityScore: 0.9,
          availableAt: new Date(),
          snoozedUntil: null,
          startedAt: null,
          completedAt: null,
          skippedAt: null,
          sourceReviewItemId: 'review-item-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user-123',
          type: 'interview-feedback',
          title: 'Review feedback from "Google interview on 2024-05-01"',
          reason: 'Recent interview feedback indicates weakness in "Graph algorithms"',
          actionPath: '/interview-feedback/1',
          status: 'PENDING',
          priorityScore: 0.8,
          availableAt: new Date(),
          snoozedUntil: null,
          startedAt: null,
          completedAt: null,
          skippedAt: null,
          sourceReviewItemId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    reviewQueueHref: '/review-queue',
    focusModeHref: '/focus-mode',
    retryHref: '/learning-path',
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interviews">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof LearningPathPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { state: { kind: 'loading' } },
}

export const EmptyState: Story = {
  args: { state: { kind: 'empty' } },
}

export const Error: Story = {
  args: {
    state: { kind: 'error', message: 'Failed to load learning path items. Please try again.' },
  },
}
