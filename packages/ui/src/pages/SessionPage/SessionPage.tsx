import { LaptopMinimalCheckIcon, LogOutIcon, ShieldCheckIcon, TimerResetIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader, StatCard } from '../../../components/ui/page'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { SESSION_PAGE_UNKNOWN_IP_LABEL } from './SessionPage.constants'
import { sessionPageFixture } from './SessionPage.fixtures'
import type { SessionPageProps, SessionPageSession } from './SessionPage.types'
import {
  formatSessionCreatedLabel,
  formatSessionLastSeenLabel,
  getSessionDevicePresentation,
  getSessionSummary,
} from './SessionPage.utils'

function SessionIcon({ session }: { session: SessionPageSession }) {
  const { icon: Icon } = getSessionDevicePresentation(session)

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
      <Icon className="size-5" />
    </div>
  )
}

function SessionMeta({ session }: { session: SessionPageSession }) {
  const { deviceLabel, browserLabel } = getSessionDevicePresentation(session)

  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-base font-medium text-foreground md:text-lg">
          {deviceLabel} · {browserLabel}
        </p>
        {session.isCurrent ? (
          <Badge variant="secondary" className="rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-700">
            This device
          </Badge>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        {session.ipAddress ?? SESSION_PAGE_UNKNOWN_IP_LABEL} · Last seen{' '}
        {formatSessionLastSeenLabel(session.lastSeenAt)} · Since {formatSessionCreatedLabel(session.createdAt)}
      </p>
    </div>
  )
}

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
    <div className="flex flex-col gap-4 rounded-2xl border border-transparent px-3 py-4 transition-colors hover:border-primary/15 hover:bg-primary/3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <SessionIcon session={session} />
        <SessionMeta session={session} />
      </div>
      {!session.isCurrent ? (
        <Button
          variant="outline"
          className="self-start rounded-xl md:self-center"
          disabled={isRevoking}
          onClick={() => onRevokeSession?.(session.id)}
        >
          {isRevoking ? 'Revoking...' : 'Revoke'}
        </Button>
      ) : null}
    </div>
  )
}

function SessionHighlights({ sessions }: { sessions: SessionPageSession[] }) {
  const currentSession = sessions.find((session) => session.isCurrent)
  const recentSessionCount = sessions.filter((session) => session.lastSeenAt === null).length
  const uniqueIpCount = new Set(sessions.map((session) => session.ipAddress ?? 'unknown')).size

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
        hint={currentSession ? getSessionDevicePresentation(currentSession).deviceLabel : 'No current session detected'}
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
        hint={uniqueIpCount > 1 ? 'Multiple networks detected across signed-in devices.' : 'All devices currently share one network.'}
        icon={ShieldCheckIcon}
      />
    </div>
  )
}

function SessionsCard({
  sessions,
  revokingSessionId,
  onRevokeSession,
}: {
  sessions: SessionPageSession[]
  revokingSessionId?: string | null
  onRevokeSession?: (sessionId: string) => void
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-xl font-semibold">Signed-in devices</CardTitle>
      </CardHeader>
      <CardContent className="divide-y py-0">
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

function LoadingBody() {
  return (
    <div className="space-y-6">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="size-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                </div>
              </div>
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="min-h-48 items-center justify-center">
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

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

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load active sessions</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

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
    <div className="space-y-6">
      <SessionHighlights sessions={sessions} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <SessionsCard
          sessions={sessions}
          revokingSessionId={revokingSessionId}
          onRevokeSession={onRevokeSession}
        />
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-xl font-semibold">Security tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-foreground">
              Review devices after interviews on shared computers or borrowed phones.
            </div>
            <p>Revoke any browser you do not recognize, especially if it has been inactive for several days.</p>
            <p>Use “Log out everywhere” after rotating credentials or changing your primary auth method.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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

  return (
    <>
      <PageHeader
        title="Active sessions"
        description="Devices currently signed in to your account."
        actions={
          <Button size="lg" variant="destructive" disabled={isLoggingOutEverywhere} onClick={onLogoutEverywhere}>
            <LogOutIcon />
            {isLoggingOutEverywhere ? 'Signing out...' : 'Log out everywhere'}
          </Button>
        }
      />
      <PageBody>
        {!loading && !error && !empty && summary.total > 0 ? (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {summary.total} active sessions
            </Badge>
            {summary.currentSessionLabel ? (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Current: {summary.currentSessionLabel}
              </Badge>
            ) : null}
          </div>
        ) : null}

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
