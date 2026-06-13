import type { Meta, StoryObj } from '@storybook/react-vite'
import { InterviewSetupPage } from './InterviewSetupPage'
import { interviewSetupPageFixture } from './InterviewSetupPage.fixtures'

const meta = {
  title: 'Pages/InterviewSetupPage',
  component: InterviewSetupPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: interviewSetupPageFixture,
} satisfies Meta<typeof InterviewSetupPage>

export default meta
type Story = StoryObj<typeof meta>

export const RoleConfig: Story = {}
export const QuestionBank: Story = { args: { currentStep: 'question-bank' } }
export const ScoringRubric: Story = { args: { currentStep: 'scoring-rubric' } }
export const ReviewAndStart: Story = { args: { currentStep: 'review-start' } }
