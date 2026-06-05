import type { ActiveAuthSession } from '@interviewos/types'

export type SessionPageSession = ActiveAuthSession

export type SessionPageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
  sessions?: SessionPageSession[]
  revokingSessionId?: string | null
  isLoggingOutEverywhere?: boolean
  onRevokeSession?: (sessionId: string) => void
  onLogoutEverywhere?: () => void
}

export type SessionPageFixture = {
  sessions: SessionPageSession[]
}
