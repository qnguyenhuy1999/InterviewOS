import type { SessionPageSession } from '../SessionPage.types'
import { SecurityTipsCard } from './SecurityTipsCard'
import { SessionHighlights } from './SessionHighlights'
import { SessionsCard } from './SessionsCard'

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

export { ReadyBody }
