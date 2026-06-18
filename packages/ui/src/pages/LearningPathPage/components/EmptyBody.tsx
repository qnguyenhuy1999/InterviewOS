import { CompassIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

export function EmptyBody({ reviewQueueHref }: { reviewQueueHref: string }) {
  return (
    <EmptyState
      className="min-h-96"
      icon={CompassIcon}
      title="No learning path items yet"
      description="Review activity, interview feedback, and weak concepts will generate your next steps here."
      action={
        <Button asChild>
          <a href={reviewQueueHref}>Go to review queue</a>
        </Button>
      }
    />
  )
}
