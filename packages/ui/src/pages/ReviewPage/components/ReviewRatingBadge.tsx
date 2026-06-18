import type { ReviewRating } from '@interviewos/types'

import { getReviewRatingClassName, getReviewRatingLabel } from '../ReviewPage.utils'

function ReviewRatingBadge({ rating }: { rating: ReviewRating | null }) {
  const label = getReviewRatingLabel(rating)
  return (
    <span className={`${getReviewRatingClassName(label)} font-mono text-xs tabular-nums`}>
      {label}
    </span>
  )
}

export { ReviewRatingBadge }
