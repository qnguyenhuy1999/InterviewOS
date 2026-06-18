import type React from 'react'

import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import type { ReviewPageProps, ReviewPageReadyState } from '../ReviewPage.types'
import { ReviewRatingBadge } from './ReviewRatingBadge'
import { ReviewTypeBadge } from './ReviewTypeBadge'

function ReviewQueueCard({
  item,
  renderRatingActions,
}: {
  item: ReviewPageReadyState['data']['queue'][number]
  renderRatingActions?: React.ReactNode
}) {
  return (
    <Card className="group gap-0 border border-border/70 py-0 transition-shadow duration-150 hover:shadow-elevated">
      <CardHeader className="gap-4 border-b py-4">
        <div className="flex items-center justify-between gap-3">
          <ReviewTypeBadge type={item.type} />
          <ReviewRatingBadge rating={item.lastRating} />
        </div>

        <CardTitle className="font-heading text-lg font-semibold leading-snug tracking-tight">
          {item.title}
        </CardTitle>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Mastery</span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {item.masteryPercent}%
            </span>
          </div>
          <Progress value={item.masteryPercent} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Next: {item.nextReviewLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Weakness</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-destructive">
              {item.weaknessScore}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2 py-3 sm:grid-cols-4">
        {renderRatingActions ??
          item.availableRatings.map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="sm"
              className="justify-center text-xs font-semibold uppercase tracking-widest"
            >
              {rating}
            </Button>
          ))}
      </CardContent>
    </Card>
  )
}

export { ReviewQueueCard }
