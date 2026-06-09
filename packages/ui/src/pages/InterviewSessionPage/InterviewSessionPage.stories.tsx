import { InterviewType, NoteStatus, QuestionDifficulty } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import InterviewSessionPage from './InterviewSessionPage'
import {
  interviewSessionFixtureSession,
  interviewSessionFixtureTurns,
} from './InterviewSessionPage.fixtures'
import type {
  InterviewSessionPageSession,
  InterviewSessionPageTurn,
} from './InterviewSessionPage.types'

const multiTurnTurns: InterviewSessionPageTurn[] = interviewSessionFixtureTurns

const multiTurnSession: InterviewSessionPageSession = {
  ...interviewSessionFixtureSession,
  questions: [],
}

const singleTurnPendingSession: InterviewSessionPageSession = {
  id: 'session-single-turn',
  type: InterviewType.TECHNICAL,
  mode: 'STANDARD',
  status: NoteStatus.NEEDS_PRACTICE,
  createdAt: new Date('2026-06-08T04:30:00Z'),
  updatedAt: new Date('2026-06-08T04:30:00Z'),
  version: 1,
  lastActivityAt: null,
  companyMode: null,
  note: {
    title: 'Explain the difference between debounce and throttle',
  },
  summary: null,
  readinessImpact: null,
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

const singleTurnFeedbackSession: InterviewSessionPageSession = {
  ...singleTurnPendingSession,
  status: NoteStatus.PUBLISHED,
  updatedAt: new Date('2026-06-08T05:05:00Z'),
  questions: [
    {
      ...singleTurnPendingSession.questions[0],
      answer: {
        rawAnswer:
          'I would debounce a search input so the request fires after the user pauses typing, and throttle events like scroll where regular sampling is acceptable.',
        overallScore: 81,
        technicalFeedback: {
          summary: 'Accurate distinction with a solid practical example.',
          strengths: ['Correctly differentiated delayed execution vs fixed interval execution'],
          improvements: ['Mention cancellation behavior and API cost tradeoffs'],
        },
        weakConcepts: ['Cancellation strategy'],
      },
    },
  ],
}

const meta = {
  title: 'Pages/InterviewSessionPage',
  component: InterviewSessionPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interviews">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof InterviewSessionPage>

export default meta
type Story = StoryObj<typeof meta>

export const MultiTurnPractice: Story = {
  args: {
    session: multiTurnSession,
    turns: multiTurnTurns,
  },
  render: (args) => (
    <InterviewSessionPage
      {...args}
      renderMultiTurnForm={({ turns, isComplete }) => (
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            {isComplete
              ? 'This session is locked because the interview is complete.'
              : `Compose the next reply after reviewing ${turns.length} recorded turns.`}
          </div>
          <textarea
            className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            defaultValue="I would compare token bucket and sliding window before choosing the simpler implementation."
          />
          <div className="flex justify-end">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Submit answer
            </button>
          </div>
        </div>
      )}
    />
  ),
}

export const CompanyModeComplete: Story = {
  args: {
    session: {
      ...multiTurnSession,
      id: 'session-company-mode',
      mode: 'COMPANY',
      status: NoteStatus.PUBLISHED,
      companyMode: { name: 'Stripe Staff Engineer Loop' },
      summary: {
        headline:
          'The panel pushed for concrete tradeoffs between operational simplicity and tenant isolation.',
      },
    },
    turns: [
      ...multiTurnTurns,
      {
        id: 'turn-4',
        role: 'CANDIDATE',
        content:
          'I would start with per-tenant buckets and promote noisy tenants to dedicated partitions once the fairness budget is exceeded.',
        turnNumber: 4,
        topicTags: ['multi-tenant', 'scaling'],
        decision: 'WRAP_UP',
      },
    ],
  },
  render: (args) => (
    <InterviewSessionPage
      {...args}
      renderMultiTurnForm={() => (
        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          The transcript is read-only after publication. Use the review link to inspect scoring and
          evidence.
        </div>
      )}
    />
  ),
}

export const SingleTurnAwaitingAnswer: Story = {
  args: {
    session: singleTurnPendingSession,
  },
  render: (args) => (
    <InterviewSessionPage
      {...args}
      renderAnswerForm={() => (
        <div className="space-y-4">
          <textarea
            className="min-h-32 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            placeholder="Explain how debounce changes request timing compared with throttle."
          />
          <div className="flex justify-end">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Submit practice answer
            </button>
          </div>
        </div>
      )}
    />
  ),
}

export const SingleTurnWithFeedback: Story = {
  args: {
    session: singleTurnFeedbackSession,
  },
}

export const MissingSession: Story = {
  args: {
    session: null,
  },
}
