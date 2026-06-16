import { LaptopMinimalCheckIcon, LogOutIcon, ShieldCheckIcon, TimerResetIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader, StatCard } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../atoms/Spinner'
import { SESSION_PAGE_UNKNOWN_IP_LABEL } from './SessionPage.constants'
import { sessionPageFixture } from './SessionPage.fixtures'
import type { SessionPageProps, SessionPageSession } from './SessionPage.types'
import {
  formatSessionCreatedLabel,
  formatSessionLastSeenLabel,
  getSessionDevicePresentation,
  getSessionSummary,
} from './SessionPage.utils'

// ─── SessionIcon ──────────────────────────────────────────────────────────────

function SessionIcon({ session }: { session: SessionPageSession }) {
  const { icon: Icon } = getSessionDevicePresentation(session)

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border">
      <Icon className="size-4.5" aria-hidden="true" />
    </div>
  )
}

// ─── SessionMeta ──────────────────────────────────────────────────────────────

function SessionMeta({ session }: { session: SessionPageSession }) {
  const { deviceLabel, browserLabel } = getSessionDevicePresentation(session)

  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold text-foreground">
          {deviceLabel}
          <span className="mx-1.5 font-normal text-muted-foreground">·</span>
          {browserLabel}
        </p>
        {session.isCurrent && (
          <Badge
            variant="secondary"
            className="rounded-full border border-success/30 bg-success-soft px-2.5 py-0.5 text-[11px] font-semibold text-success"
          >
            This device
          </Badge>
        )}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {session.ipAddress ?? SESSION_PAGE_UNKNOWN_IP_LABEL}
        <span className="mx-1.5">·</span>
        Last seen {formatSessionLastSeenLabel(session.lastSeenAt)}
        <span className="mx-1.5">·</span>
        Since {formatSessionCreatedLabel(session.createdAt)}
      </p>
    </div>
  )
}

// ─── SessionRow ───────────────────────────────────────────────────────────────

function SessionRow({
  session,
  revokingSessionId,
  onRevokeSession,
}: {
  session: SessionPageSession
  revokingSessionId?: string | null
  onRevokeSession?: (sessionId: string) => void
}) {
  const isRevoking = revokingSessionId === session.id

  return (
    <div className="flex flex-col gap-3 px-5 py-4 transition-colors duration-100 hover:bg-muted/40 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <SessionIcon session={session} />
        <SessionMeta session={session} />
      </div>

      {!session.isCurrent && (
        <Button
          variant="outline"
          size="sm"
          className="self-start shrink-0 md:self-center"
          disabled={isRevoking}
          onClick={() => onRevokeSession?.(session.id)}
        >
          {isRevoking ? (
            <>
              <Spinner size="sm" />
              Revoking…
            </>
          ) : (
            'Revoke'
          )}
        </Button>
      )}
    </div>
  )
}

// ─── SessionHighlights ────────────────────────────────────────────────────────

function SessionHighlights({ sessions }: { sessions: SessionPageSession[] }) {
  const currentSession = sessions.find((s) => s.isCurrent)
  const recentSessionCount = sessions.filter((s) => s.lastSeenAt === null).length
  const uniqueIpCount = new Set(sessions.map((s) => s.ipAddress ?? 'unknown')).size

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Active devices"
        value={sessions.length}
        hint="Browsers or devices currently signed in."
        icon={LaptopMinimalCheckIcon}
      />
      <StatCard
        label="Current device"
        value={currentSession ? '1' : '0'}
        hint={
          currentSession
            ? getSessionDevicePresentation(currentSession).deviceLabel
            : 'No current session detected'
        }
        icon={ShieldCheckIcon}
      />
      <StatCard
        label="Recent activity"
        value={recentSessionCount}
        hint="Devices seen very recently or active now."
        icon={TimerResetIcon}
      />
      <StatCard
        label="IPs in use"
        value={uniqueIpCount}
        hint={
          uniqueIpCount > 1
            ? 'Multiple networks detected across signed-in devices.'
            : 'All devices currently share one network.'
        }
        icon={ShieldCheckIcon}
      />
    </div>
  )
}

// ─── SessionsCard ─────────────────────────────────────────────────────────────

function SessionsCard({
  sessions,
  revokingSessionId,
  onRevokeSession,
  className,
}: {
  sessions: SessionPageSession[]
  revokingSessionId?: string | null
  onRevokeSession?: (sessionId: string) => void
  className?: string
}) {
  return (
    <Card className={`gap-0 overflow-hidden py-0 ${className ?? ''}`}>
      <CardHeader className="border-b py-4">
        <CardTitle className="font-heading text-lg font-semibold">Signed-in devices</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border p-0">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            revokingSessionId={revokingSessionId}
            onRevokeSession={onRevokeSession}
          />
        ))}
      </CardContent>
    </Card>
  )
}

// ─── SecurityTipsCard ─────────────────────────────────────────────────────────

const SECURITY_TIPS = [
  {
    title: 'After shared computers',
    body: 'Review devices after interviews on shared or borrowed machines — they may stay signed in longer than expected.',
  },
  {
    title: 'Unfamiliar browsers',
    body: 'Revoke any device you do not recognise, especially if it has been inactive for several days.',
  },
  {
    title: 'After credential changes',
    body: 'Use "Log out everywhere" after rotating credentials or changing your primary auth method.',
  },
]

function SecurityTipsCard() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="font-heading text-lg font-semibold">Security tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {SECURITY_TIPS.map((tip, i) => (
          <div key={tip.title}>
            <div className="space-y-1 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{tip.body}</p>
            </div>
            {i < SECURITY_TIPS.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── LoadingBody ──────────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="col-span-2 gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-4">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="min-h-40 items-center justify-center">
          <Spinner size="lg" />
        </Card>
      </div>
    </div>
  )
}

// ─── EmptyBody ────────────────────────────────────────────────────────────────

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title="No active sessions"
      description="New devices and browsers will appear here after they sign in to your account."
      action={<Button>Back to dashboard</Button>}
    />
  )
}

// ─── ErrorBody ────────────────────────────────────────────────────────────────

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load active sessions</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

// ─── ReadyBody ────────────────────────────────────────────────────────────────

function ReadyBody({
  sessions,
  revokingSessionId,
  onRevokeSession,
}: {
  sessions: SessionPageSession[]
  revokingSessionId?: string | null
  onRevokeSession?: (sessionId: string) => void
}) {
  return (
    <div className="space-y-5">
      <SessionHighlights sessions={sessions} />

      <div className="grid gap-5 xl:grid-cols-3">
        <SessionsCard
          sessions={sessions}
          revokingSessionId={revokingSessionId}
          onRevokeSession={onRevokeSession}
          className="xl:col-span-2"
        />
        <SecurityTipsCard />
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  loading,
  empty,
  error,
  sessions = sessionPageFixture.sessions,
  revokingSessionId,
  isLoggingOutEverywhere,
  onRevokeSession,
  onLogoutEverywhere,
}: SessionPageProps) {
  const summary = getSessionSummary(sessions)
  const showSummaryBadges = !loading && !error && !empty && summary.total > 0

  return (
    <>
      <PageHeader
        title="Active sessions"
        description="Devices currently signed in to your account."
        actions={
          <Button
            size="lg"
            variant="destructive"
            disabled={isLoggingOutEverywhere}
            onClick={onLogoutEverywhere}
          >
            <LogOutIcon aria-hidden="true" />
            {isLoggingOutEverywhere ? 'Signing out…' : 'Log out everywhere'}
          </Button>
        }
      />

      <PageBody>
        {showSummaryBadges && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {summary.total} active {summary.total === 1 ? 'session' : 'sessions'}
            </Badge>
            {summary.currentSessionLabel && (
              <Badge
                variant="outline"
                className="rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-primary"
              >
                Current: {summary.currentSessionLabel}
              </Badge>
            )}
          </div>
        )}

        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty || sessions.length === 0 ? (
          <EmptyBody />
        ) : (
          <ReadyBody
            sessions={sessions}
            revokingSessionId={revokingSessionId}
            onRevokeSession={onRevokeSession}
          />
        )}
      </PageBody>
    </>
  )
}

const SessionPage = Object.assign(Root, {
  SessionRow,
  SessionsCard,
})

export default SessionPage
