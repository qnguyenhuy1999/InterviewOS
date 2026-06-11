import type { Meta, StoryObj } from '@storybook/react-vite'

import { StartPracticeButton } from './StartPracticeButton'

const meta = {
  title: 'Organisms/StartPracticeButton',
  component: StartPracticeButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onStartPractice: async () => {},
  },
} satisfies Meta<typeof StartPracticeButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
