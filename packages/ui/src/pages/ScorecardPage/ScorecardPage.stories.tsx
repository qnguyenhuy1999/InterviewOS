import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScorecardPage } from './ScorecardPage'
import { scorecardPageFixture } from './ScorecardPage.fixtures'

const meta = {
  title: 'Pages/ScorecardPage',
  component: ScorecardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: scorecardPageFixture,
} satisfies Meta<typeof ScorecardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
