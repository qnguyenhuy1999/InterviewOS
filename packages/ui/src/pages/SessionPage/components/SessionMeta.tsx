import { Badge } from '../../../../components/ui/badge'
import { SESSION_PAGE_UNKNOWN_IP_LABEL } from '../SessionPage.constants'
import type { SessionPageSession } from '../SessionPage.types'
import {
  formatSessionCreatedLabel,
  formatSessionLastSeenLabel,
  getSessionDevicePresentation,
} from '../SessionPage.utils'

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

export { SessionMeta }
