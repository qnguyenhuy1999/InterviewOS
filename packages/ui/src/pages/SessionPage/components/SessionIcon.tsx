import type { SessionPageSession } from '../SessionPage.types'
import { getSessionDevicePresentation } from '../SessionPage.utils'

function SessionIcon({ session }: { session: SessionPageSession }) {
  const { icon: Icon } = getSessionDevicePresentation(session)

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border">
      <Icon className="size-4.5" aria-hidden="true" />
    </div>
  )
}

export { SessionIcon }
