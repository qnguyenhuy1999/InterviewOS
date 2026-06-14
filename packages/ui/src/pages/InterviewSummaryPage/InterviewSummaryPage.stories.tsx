import type { Meta, StoryObj } from '@storybook/react-vite'

import { InterviewSummaryPage } from './InterviewSummaryPage'
import { interviewSummaryPageFixture } from './InterviewSummaryPage.fixtures'

const meta = {
  title: 'Pages/InterviewSummaryPage',
  component: InterviewSummaryPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: interviewSummaryPageFixture,
} satisfies Meta<typeof InterviewSummaryPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
