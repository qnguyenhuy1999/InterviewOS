import { LaptopMinimalCheckIcon, ShieldCheckIcon, TimerResetIcon } from 'lucide-react'

import { StatCard } from '../../../../components/ui/page'
import type { SessionPageSession } from '../SessionPage.types'
import { getSessionDevicePresentation } from '../SessionPage.utils'

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

export { SessionHighlights }
