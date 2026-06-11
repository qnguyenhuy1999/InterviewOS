import type { Meta, StoryObj } from '@storybook/react-vite'

import { WeakConceptStatusActions } from './WeakConceptStatusActions'

const meta = {
  title: 'Organisms/WeakConceptStatusActions',
  component: WeakConceptStatusActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onUpdateStatus: async () => {},
  },
} satisfies Meta<typeof WeakConceptStatusActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
