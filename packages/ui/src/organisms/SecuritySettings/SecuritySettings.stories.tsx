import type { ActiveAuthSession, AuthenticatedUser } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SecuritySettings } from './SecuritySettings'

const currentUser: AuthenticatedUser = {
  id: 'user-1',
  sessionId: 'session-current',
  email: 'jane@example.com',
  name: 'Jane Doe',
  emailVerifiedAt: null,
}

const sessions: ActiveAuthSession[] = [
  {
    id: 'session-current',
    userAgent: 'Chrome on macOS',
    ipAddress: '192.168.1.10',
    expiresAt: new Date('2026-06-20T09:00:00Z'),
    lastSeenAt: new Date('2026-06-11T08:45:00Z'),
    createdAt: new Date('2026-06-01T09:00:00Z'),
    isCurrent: true,
  },
  {
    id: 'session-2',
    userAgent: 'Safari on iPhone',
    ipAddress: '10.0.0.25',
    expiresAt: new Date('2026-06-18T09:00:00Z'),
    lastSeenAt: new Date('2026-06-10T22:10:00Z'),
    createdAt: new Date('2026-05-28T12:00:00Z'),
    isCurrent: false,
  },
]

const meta = {
  title: 'Organisms/SecuritySettings',
  component: SecuritySettings,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    currentUser,
    sessions,
    onResendVerification: async () => {},
    onLogoutAll: async () => {},
    onRevokeSession: async () => {},
  },
} satisfies Meta<typeof SecuritySettings>

export default meta
type Story = StoryObj<typeof meta>

export const Unverified: Story = {}

export const Verified: Story = {
  args: {
    currentUser: {
      ...currentUser,
      emailVerifiedAt: new Date('2026-06-05T09:00:00Z'),
    },
  },
}
