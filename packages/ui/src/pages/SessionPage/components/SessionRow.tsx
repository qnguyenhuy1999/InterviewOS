import { Button } from '../../../../components/ui/button'
import { Spinner } from '../../../atoms/Spinner'
import type { SessionPageSession } from '../SessionPage.types'
import { SessionIcon } from './SessionIcon'
import { SessionMeta } from './SessionMeta'

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

export { SessionRow }
