import type { Meta, StoryObj } from '@storybook/react-vite'
import { CandidateWaitingPage } from './CandidateWaitingPage'
import { candidateWaitingPageFixture } from './CandidateWaitingPage.fixtures'

const meta = {
  title: 'Pages/CandidateWaitingPage',
  component: CandidateWaitingPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: candidateWaitingPageFixture,
} satisfies Meta<typeof CandidateWaitingPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoCandidateName: Story = { args: { candidateName: undefined } }
export const SoonStarting: Story = {
  args: { scheduledTime: '2:28 PM', interviewerName: 'Sarah Chen' },
}
