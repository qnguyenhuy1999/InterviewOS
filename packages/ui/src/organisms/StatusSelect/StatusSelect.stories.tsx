import type { Meta, StoryObj } from '@storybook/react-vite'

import { StatusSelect } from './StatusSelect'

const meta = {
  title: 'Organisms/StatusSelect',
  component: StatusSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    value: 'IN_PROGRESS',
    options: ['NEW', 'IN_PROGRESS', 'DONE'],
    onUpdate: async () => {},
  },
} satisfies Meta<typeof StatusSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
