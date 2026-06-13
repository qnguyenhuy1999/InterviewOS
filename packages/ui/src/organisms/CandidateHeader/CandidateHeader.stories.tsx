import type { Meta, StoryObj } from '@storybook/react-vite'

import { CandidateHeader } from './CandidateHeader'

const meta: Meta<typeof CandidateHeader> = {
  title: 'Organisms/CandidateHeader',
  component: CandidateHeader,
}

export default meta
type Story = StoryObj<typeof CandidateHeader>

export const Live: Story = {
  args: {
    candidateName: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    company: 'Acme Corp',
    stage: 'Technical Round',
    status: 'live',
    elapsedSeconds: 1245,
  },
}

export const Paused: Story = {
  args: {
    candidateName: 'James Park',
    role: 'Product Manager',
    stage: 'Behavioral',
    status: 'paused',
    elapsedSeconds: 780,
  },
}

export const Ended: Story = {
  args: {
    candidateName: 'Maria Lopez',
    role: 'Data Scientist',
    company: 'TechStart',
    status: 'ended',
    elapsedSeconds: 3600,
  },
}

export const NoTimer: Story = {
  args: {
    candidateName: 'Alex Kim',
    role: 'Backend Engineer',
    status: 'live',
  },
}
