import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: { variant: 'determinate', value: 60 },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {}

export const Indeterminate: Story = {
  args: { variant: 'indeterminate' },
}

export const Stepped: Story = {
  args: { variant: 'stepped', steps: 5, completedSteps: 3 },
}

export const WithLabel: Story = {
  args: { label: 'Uploading…', value: 45, showValue: true },
}

export const FullProgress: Story = {
  args: { value: 100, label: 'Complete', showValue: true },
}

export const ZeroProgress: Story = {
  args: { value: 0, label: 'Not started', showValue: true },
}
