import { GaugeIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState, PageBody } from '../../../../components/ui/page'

function EmptyBody() {
  return (
    <PageBody>
      <EmptyState
        className="min-h-96"
        icon={GaugeIcon}
        title="No readiness snapshots yet"
        description="Complete a review session or interview to generate your first readiness baseline."
        action={<Button>Start practice</Button>}
      />
    </PageBody>
  )
}

export { EmptyBody }
