import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteInterviewAnswer } from './NoteInterviewAnswer'

const meta = {
  title: 'Molecules/NoteInterviewAnswer',
  component: NoteInterviewAnswer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    answer:
      'React Fiber lets React break rendering into interruptible units of work, so the UI can stay responsive while updates are prioritized. In interviews, I would connect that scheduling model to reconciliation, render versus commit, and why stable keys preserve component identity.',
  },
} satisfies Meta<typeof NoteInterviewAnswer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Concise: Story = {
  args: {
    answer:
      'Keys preserve sibling identity during reconciliation. Stable keys protect state retention, while unstable keys create unnecessary remounts and confusing UI behavior.',
  },
}
