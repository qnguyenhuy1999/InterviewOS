import type { InterviewEvaluation } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import InterviewReviewPage from './InterviewReviewPage'
import {
  interviewReviewFixtureEvaluation,
  interviewReviewFixtureSession,
  interviewReviewFixtureTurns,
} from './InterviewReviewPage.fixtures'
import type {
  InterviewReviewPageSession,
  InterviewReviewPageTurn,
} from './InterviewReviewPage.types'

const session: InterviewReviewPageSession = interviewReviewFixtureSession
const evaluation: InterviewEvaluation = interviewReviewFixtureEvaluation
const turns: InterviewReviewPageTurn[] = interviewReviewFixtureTurns

const meta = {
  title: 'Pages/InterviewReviewPage',
  component: InterviewReviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interviews">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof InterviewReviewPage>

export default meta
type Story = StoryObj<typeof meta>

export const WithEvaluation: Story = {
  args: {
    session,
    evaluation,
    turns,
  },
}

export const EvaluationPending: Story = {
  args: {
    session: {
      ...session,
      summary: null,
    },
    turns,
    evaluation: null,
  },
}

export const NoReplayTurns: Story = {
  args: {
    session,
    evaluation,
    turns: [],
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Error: Story = {
  args: {
    error: 'Unable to load this session review right now. Please try again.',
  },
}
