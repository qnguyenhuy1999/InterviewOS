import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultiTurnForm } from './MultiTurnForm'

const meta = {
  title: 'Organisms/MultiTurnForm',
  component: MultiTurnForm,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    initialTurns: [
      {
        id: 'turn-1',
        role: 'INTERVIEWER',
        content: 'Walk me through how you would design a rate limiter.',
        turnNumber: 1,
      },
      {
        id: 'turn-2',
        role: 'CANDIDATE',
        content:
          'I would start with the traffic pattern and decide whether token bucket or sliding window fits better.',
        turnNumber: 2,
      },
    ],
    isComplete: false,
    reviewHref: '/interview/session/1/review',
    onSubmitAnswer: async (answer) => ({
      candidateTurn: {
        id: 'turn-3',
        role: 'CANDIDATE',
        content: answer,
        turnNumber: 3,
      },
      interviewerTurn: {
        id: 'turn-4',
        role: 'INTERVIEWER',
        content: 'How would you handle distributed coordination?',
        turnNumber: 4,
      },
      decision: 'CONTINUE',
      isComplete: false,
    }),
    onEndSession: async () => {},
  },
} satisfies Meta<typeof MultiTurnForm>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {}

export const Complete: Story = {
  args: {
    isComplete: true,
  },
}
