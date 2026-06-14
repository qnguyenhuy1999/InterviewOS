import type { Meta, StoryObj } from '@storybook/react-vite'

import { LiveInterviewPage } from './LiveInterviewPage'
import { liveInterviewPageFixture } from './LiveInterviewPage.fixtures'

const meta = {
  title: 'Pages/LiveInterviewPage',
  component: LiveInterviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: liveInterviewPageFixture,
} satisfies Meta<typeof LiveInterviewPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoCompany: Story = { args: { company: undefined } }
