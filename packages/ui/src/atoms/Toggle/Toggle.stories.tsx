import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Toggle } from './Toggle'

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { checked: false, onChange: () => {} },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { checked: false },
}

export const Checked: Story = {
  args: { checked: true },
}

export const WithLabel: Story = {
  args: { checked: true, label: 'Enable notifications' },
}

export const Disabled: Story = {
  args: { checked: false, disabled: true, label: 'Disabled toggle' },
}

export const Compact: Story = {
  args: { checked: true, compact: true, label: 'Compact' },
}

export const AllStates: Story = {
  render: () => {
    const [states, setStates] = useState({ a: false, b: true, c: false })
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Toggle
          checked={states.a}
          onChange={(v) => setStates((s) => ({ ...s, a: v }))}
          label="Off"
        />
        <Toggle
          checked={states.b}
          onChange={(v) => setStates((s) => ({ ...s, b: v }))}
          label="On"
        />
        <Toggle checked={false} onChange={() => {}} disabled label="Disabled off" />
        <Toggle checked={true} onChange={() => {}} disabled label="Disabled on" />
        <Toggle
          checked={states.c}
          onChange={(v) => setStates((s) => ({ ...s, c: v }))}
          compact
          label="Compact"
        />
      </div>
    )
  },
}
