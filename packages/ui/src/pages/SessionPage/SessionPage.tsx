import { LogOutIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ReadyBody } from './components/ReadyBody'
import { SessionRow } from './components/SessionRow'
import { SessionsCard } from './components/SessionsCard'
import { sessionPageFixture } from './SessionPage.fixtures'
import type { SessionPageProps } from './SessionPage.types'
import { getSessionSummary } from './SessionPage.utils'

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
