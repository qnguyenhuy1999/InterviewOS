import type { Meta, StoryObj } from '@storybook/react-vite'

import { Timer } from './Timer'

const meta = {
  title: 'Atoms/Timer',
  component: Timer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { variant: 'countdown', seconds: 900 },
  argTypes: {
    variant: { control: 'select', options: ['countdown', 'elapsed', 'warning'] },
    state: { control: 'select', options: ['running', 'paused', 'critical', 'expired'] },
    seconds: { control: 'number' },
    warningThreshold: { control: 'number' },
    criticalThreshold: { control: 'number' },
    compact: { control: 'boolean' },
  },
} satisfies Meta<typeof Timer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FifteenMinutes: Story = {
  args: { variant: 'countdown', seconds: 900, state: 'running' },
}

export const FiveMinuteWarning: Story = {
  args: { variant: 'countdown', seconds: 300, state: 'running' },
}

export const OneMinuteCritical: Story = {
  args: { variant: 'countdown', seconds: 60, state: 'critical' },
}

export const Expired: Story = {
  args: { variant: 'countdown', seconds: 0, state: 'expired' },
}

export const Elapsed: Story = {
  args: { variant: 'elapsed', seconds: 847 },
}

export const Warning: Story = {
  args: { variant: 'warning', seconds: 180 },
}

export const Paused: Story = {
  args: { variant: 'countdown', seconds: 540, state: 'paused' },
}

export const Compact: Story = {
  args: { variant: 'countdown', seconds: 300, compact: true },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">countdown</span>
        <Timer variant="countdown" seconds={900} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">elapsed</span>
        <Timer variant="elapsed" seconds={847} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground">warning</span>
        <Timer variant="warning" seconds={180} />
      </div>
    </div>
  ),
}
