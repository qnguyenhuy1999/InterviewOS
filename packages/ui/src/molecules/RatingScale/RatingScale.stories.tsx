import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { RatingScale } from './RatingScale'

const meta = {
  title: 'Molecules/RatingScale',
  component: RatingScale,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof RatingScale>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: null, variant: 'numeric' },
  render: () => {
    const [value, setValue] = React.useState<1 | 2 | 3 | 4 | 5 | null>(null)
    return <RatingScale value={value} onChange={setValue} />
  },
}

export const Selected3: Story = {
  args: { value: 3, variant: 'numeric' },
  render: () => {
    const [value, setValue] = React.useState<1 | 2 | 3 | 4 | 5 | null>(3)
    return <RatingScale value={value} onChange={setValue} />
  },
}

export const Labeled: Story = {
  args: { value: null, variant: 'labeled' },
  render: () => {
    const [value, setValue] = React.useState<1 | 2 | 3 | 4 | 5 | null>(null)
    return <RatingScale value={value} onChange={setValue} variant="labeled" />
  },
}

export const Compact: Story = {
  args: { value: null, variant: 'compact' },
  render: () => {
    const [value, setValue] = React.useState<1 | 2 | 3 | 4 | 5 | null>(null)
    return <RatingScale value={value} onChange={setValue} variant="compact" />
  },
}

export const Disabled: Story = {
  args: { value: 4, disabled: true },
}

export const WithLabels: Story = {
  args: { value: null, showLabels: true },
  render: () => {
    const [value, setValue] = React.useState<1 | 2 | 3 | 4 | 5 | null>(null)
    return <RatingScale value={value} onChange={setValue} showLabels />
  },
}

export const AllVariants: Story = {
  args: { value: 3 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 8 }}>numeric</p>
        <RatingScale value={3} onChange={() => {}} variant="numeric" />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 8 }}>labeled</p>
        <RatingScale value={3} onChange={() => {}} variant="labeled" />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 8 }}>compact</p>
        <RatingScale value={3} onChange={() => {}} variant="compact" />
      </div>
    </div>
  ),
}
