import type { Meta, StoryObj } from '@storybook/react-vite'

import { WaitingRoomLayout } from './WaitingRoomLayout'

const meta = {
  title: 'Layouts/WaitingRoomLayout',
  component: WaitingRoomLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    interviewerName: 'Sarah Chen',
    scheduledTime: 'Today at 2:00 PM',
  },
} satisfies Meta<typeof WaitingRoomLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCandidateName: Story = {
  args: {
    candidateName: 'Alex Kim',
    interviewerName: 'Sarah Chen',
    scheduledTime: 'Today at 2:00 PM',
  },
}

export const SoonStarting: Story = {
  args: {
    candidateName: 'Jordan Lee',
    interviewerName: 'Marcus Rivera',
    scheduledTime: 'In 2 minutes',
  },
}
