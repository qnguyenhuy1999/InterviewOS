import { GaugeIcon } from 'lucide-react'

import { EmptyState, PageStateAction } from '../../../../components/ui/page'

function EmptyBody({ startPracticeHref }: { startPracticeHref?: string }) {
  return (
    <EmptyState
      className="min-h-80"
      icon={GaugeIcon}
      title="No readiness snapshots yet"
      description="Complete a review session or interview to generate your first readiness baseline."
      action={
        startPracticeHref ? (
          <PageStateAction href={startPracticeHref} label="Start practice" />
        ) : undefined
      }
    />
  )
}

export { EmptyBody }
