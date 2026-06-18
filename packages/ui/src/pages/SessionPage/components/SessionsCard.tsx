import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import type { SessionPageSession } from '../SessionPage.types'
import { SessionRow } from './SessionRow'

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

export { SessionsCard }
