import type { Meta, StoryObj } from '@storybook/react-vite'

import { FeedbackPage } from './FeedbackPage'
import { feedbackPageFixture } from './FeedbackPage.fixtures'

const meta = {
  title: 'Pages/FeedbackPage',
  component: FeedbackPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: feedbackPageFixture,
} satisfies Meta<typeof FeedbackPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NotDraft: Story = { args: { isDraft: false } }
