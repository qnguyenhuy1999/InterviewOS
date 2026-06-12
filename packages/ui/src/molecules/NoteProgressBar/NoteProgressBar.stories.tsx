import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteProgressBar } from './NoteProgressBar'

const meta = {
  title: 'Molecules/NoteProgressBar',
  component: NoteProgressBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    value: 62,
    label: 'Reading progress',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoteProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Complete: Story = {
  args: {
    value: 100,
  },
}
