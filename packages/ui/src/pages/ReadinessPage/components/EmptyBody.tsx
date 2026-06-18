import { GaugeIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      icon={GaugeIcon}
      title="No readiness snapshots yet"
      description="Complete a review session or interview to generate your first readiness baseline."
      action={<Button>Start practice</Button>}
    />
  )
}

export { EmptyBody }
