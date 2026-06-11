import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReviewRatingActions } from './ReviewRatingActions'

const meta = {
  title: 'Organisms/ReviewRatingActions',
  component: ReviewRatingActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onRate: async () => {},
  },
} satisfies Meta<typeof ReviewRatingActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
