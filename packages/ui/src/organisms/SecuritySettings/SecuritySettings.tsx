'use client'

import type { ActiveAuthSession, AuthenticatedUser } from '@interviewos/types'
import { formatDate } from '@interviewos/utils'
import { useState } from 'react'

type ActionState = {
  message: string | null
  error: string | null
  pendingKey: string | null
}

interface SecuritySettingsProps {
  currentUser: AuthenticatedUser
  sessions: ActiveAuthSession[]
  onResendVerification: (email: string) => Promise<void>
  onLogoutAll: () => Promise<void>
  onRevokeSession: (sessionId: string) => Promise<void>
}

export function SecuritySettings({
  currentUser,
  sessions,
  onResendVerification,
  onLogoutAll,
  onRevokeSession,
}: SecuritySettingsProps) {
  const [state, setState] = useState<ActionState>({
    message: null,
    error: null,
    pendingKey: null,
  })

  async function runAction(
    pendingKey: string,
    request: () => Promise<void>,
    successMessage: string,
  ) {
    setState({ message: null, error: null, pendingKey })

    try {
      await request()
      setState({ message: successMessage, error: null, pendingKey: null })
    } catch (error) {
      setState({
        message: null,
        error: error instanceof Error ? error.message : 'Security action failed.',
        pendingKey: null,
      })
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage email verification and revoke active sessions.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Email verification</p>
            <p className="text-sm text-muted-foreground">
              {currentUser.emailVerifiedAt
                ? `Verified on ${formatDate(currentUser.emailVerifiedAt)}`
                : 'Your email is not verified yet.'}
            </p>
          </div>
          {!currentUser.emailVerifiedAt ? (
            <button
              type="button"
              disabled={state.pendingKey === 'resend-verification'}
              onClick={() => {
                void runAction(
                  'resend-verification',
                  () => onResendVerification(currentUser.email),
                  'Verification email sent if the account is eligible.',
                )
              }}
              className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
            >
              {state.pendingKey === 'resend-verification' ? 'Sending...' : 'Resend verification'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Active sessions</p>
            <p className="text-sm text-muted-foreground">
              Opaque session cookies are backed by revocable database records.
            </p>
          </div>
          <button
            type="button"
            disabled={state.pendingKey === 'logout-all'}
            onClick={() => {
              void runAction(
                'logout-all',
                () => onLogoutAll(),
                'All sessions signed out.',
              )
            }}
            className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
          >
            {state.pendingKey === 'logout-all' ? 'Signing out...' : 'Logout all sessions'}
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border px-3 py-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {session.userAgent ?? 'Unknown device'}
                  </p>
                  {session.isCurrent ? (
                    <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs text-primary">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.ipAddress ?? 'Unknown IP'} · Last seen{' '}
                  {session.lastSeenAt ? formatDate(session.lastSeenAt) : 'just now'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {formatDate(session.createdAt)} · Expires {formatDate(session.expiresAt)}
                </p>
              </div>
              {!session.isCurrent ? (
                <button
                  type="button"
                  disabled={state.pendingKey === session.id}
                  onClick={() => {
                    void runAction(
                      session.id,
                      () => onRevokeSession(session.id),
                      'Session revoked.',
                    )
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
                >
                  {state.pendingKey === session.id ? 'Revoking...' : 'Revoke'}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {state.message ? (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </div>
      ) : null}
      {state.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}
    </section>
  )
}
