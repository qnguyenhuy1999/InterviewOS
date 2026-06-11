import type { Meta, StoryObj } from '@storybook/react-vite'

import { LearningPathActions } from './LearningPathActions'

const meta = {
  title: 'Organisms/LearningPathActions',
  component: LearningPathActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onAction: async () => {},
  },
} satisfies Meta<typeof LearningPathActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
