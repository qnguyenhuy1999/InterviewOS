import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteToc } from './NoteToc'

const meta = {
  title: 'Molecules/NoteToc',
  component: NoteToc,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    items: [
      { id: 'summary', label: 'Quick summary' },
      { id: 'concepts', label: 'Core concepts' },
      { id: 'mental-model', label: 'Mental model' },
      { id: 'pitfalls', label: 'Common pitfalls' },
      { id: 'interview-answer', label: 'Interview-ready answer' },
    ],
    activeId: 'mental-model',
  },
  decorators: [
    (Story) => (
      <div className="w-72 rounded-xl border border-border/70 bg-background p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoteToc>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstSectionActive: Story = {
  args: {
    activeId: 'summary',
  },
}
