import { Badge } from '../../../../components/ui/badge'
import { REVIEW_ITEM_TYPE_LABEL } from '../ReviewPage.constants'
import type { ReviewPageReadyState } from '../ReviewPage.types'

function ReviewTypeBadge({ type }: { type: ReviewPageReadyState['data']['queue'][number]['type'] }) {
  return (
    <Badge
      variant="outline"
      className="rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest"
    >
      {REVIEW_ITEM_TYPE_LABEL[type]}
    </Badge>
  )
}

export { ReviewTypeBadge }
