import type { Meta, StoryObj } from '@storybook/react-vite'

import { SetupLayout } from './SetupLayout'
import type { SetupLayoutProps, SetupStep } from './SetupLayout.types'

const meta = {
  title: 'Layouts/SetupLayout',
  component: SetupLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<Partial<SetupLayoutProps>>

export default meta
type Story = StoryObj<typeof meta>

const steps: SetupStep[] = [
  { id: 'profile', label: 'Your profile', status: 'completed' },
  { id: 'role', label: 'Target role', status: 'current' },
  { id: 'experience', label: 'Experience', status: 'pending' },
  { id: 'schedule', label: 'Schedule', status: 'pending' },
  { id: 'confirm', label: 'Confirm', status: 'pending' },
]

const MockContent = ({ title }: { title: string }) => (
  <div style={{ maxWidth: 560 }}>
    <h2
      style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}
    >
      {title}
    </h2>
    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
      Fill in the details below to continue setup.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {['Field one', 'Field two', 'Field three'].map((f) => (
        <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {f}
          </label>
          <input
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--color-border-interview)',
              background: 'var(--color-surface-inset)',
              fontSize: 14,
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      ))}
    </div>
  </div>
)

const MockFooter = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
    <button
      type="button"
      style={{
        padding: '8px 20px',
        borderRadius: 6,
        border: '1px solid var(--color-border-interview)',
        background: 'transparent',
        fontSize: 14,
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
      }}
    >
      Back
    </button>
    <button
      type="button"
      style={{
        padding: '8px 20px',
        borderRadius: 6,
        border: 'none',
        background: 'var(--color-accent-teal)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      Continue
    </button>
  </div>
)

export const Default: Story = {
  render: () => (
    <SetupLayout steps={steps} currentStep="role" footer={<MockFooter />}>
      <MockContent title="Target role" />
    </SetupLayout>
  ),
}

export const FirstStep: Story = {
  render: () => (
    <SetupLayout
      steps={steps.map((s) => ({ ...s, status: s.id === 'profile' ? 'current' : 'pending' }))}
      currentStep="profile"
      footer={<MockFooter />}
    >
      <MockContent title="Your profile" />
    </SetupLayout>
  ),
}

export const LastStep: Story = {
  render: () => (
    <SetupLayout
      steps={steps.map((s) => ({ ...s, status: s.id === 'confirm' ? 'current' : 'completed' }))}
      currentStep="confirm"
      footer={<MockFooter />}
    >
      <MockContent title="Confirm & start" />
    </SetupLayout>
  ),
}

export const NoFooter: Story = {
  render: () => (
    <SetupLayout steps={steps} currentStep="role">
      <MockContent title="Target role (no footer)" />
    </SetupLayout>
  ),
}
