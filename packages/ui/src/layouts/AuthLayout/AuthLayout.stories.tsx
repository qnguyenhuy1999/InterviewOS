import type { Meta, StoryObj } from '@storybook/react-vite'

import { AuthLayout } from './AuthLayout'
import type { AuthLayoutProps } from './AuthLayout.types'

const meta = {
  title: 'Layouts/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<Partial<AuthLayoutProps>>

export default meta
type Story = StoryObj<typeof meta>

const MockForm = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
        Email
      </label>
      <input
        type="email"
        placeholder="you@example.com"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-inset)',
          color: 'var(--color-text-primary)',
          fontSize: 14,
        }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
        Password
      </label>
      <input
        type="password"
        placeholder="••••••••"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-inset)',
          color: 'var(--color-text-primary)',
          fontSize: 14,
        }}
      />
    </div>
    <button
      type="button"
      style={{
        padding: '10px 16px',
        borderRadius: 6,
        border: 'none',
        background: 'var(--color-accent-teal)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 4,
      }}
    >
      Sign in
    </button>
  </div>
)

export const Default: Story = {
  render: () => (
    <AuthLayout brandName="InterviewOS" subtitle="Sign in to your account">
      <MockForm />
    </AuthLayout>
  ),
}

export const NoSubtitle: Story = {
  render: () => (
    <AuthLayout brandName="InterviewOS">
      <MockForm />
    </AuthLayout>
  ),
}

export const CustomBrand: Story = {
  render: () => (
    <AuthLayout brandName="TechHire" subtitle="Candidate portal">
      <MockForm />
    </AuthLayout>
  ),
}
