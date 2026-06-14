import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout'
import InterviewStartPage from './InterviewStartPage'
import { interviewStartPageFixture } from './InterviewStartPage.fixtures'

const meta = {
  title: 'Pages/InterviewStartPage',
  component: InterviewStartPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: interviewStartPageFixture,
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interview">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof InterviewStartPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: {
    children: undefined,
    errorMessage: 'Unable to load the interview setup form.',
  },
}
