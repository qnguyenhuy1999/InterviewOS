import { cn } from '../../../../lib/utils'
import { READINESS_SCORE_MAX } from '../ReadinessPage.constants'
import type { ReadinessDimension } from '../ReadinessPage.types'
import { getReadinessTrendClassName } from '../ReadinessPage.utils'
import { ReadinessTrendIcon } from './ReadinessTrendIcon'

function DimensionRow({ dimension }: { dimension: ReadinessDimension }) {
  const delta = dimension.trend === 'UP' ? 1 : dimension.trend === 'DOWN' ? -1 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-snug">{dimension.label}</p>
          <p className="text-[11px] text-muted-foreground">
            {Math.round(dimension.weight * 100)}% weight
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold tabular-nums',
              getReadinessTrendClassName(dimension.trend),
            )}
          >
            <ReadinessTrendIcon delta={delta} />
            {dimension.score}
          </span>
          <span className="text-xs text-muted-foreground">/ {READINESS_SCORE_MAX}</span>
        </div>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
            dimension.score >= 80
              ? 'bg-success'
              : dimension.score >= 50
                ? 'bg-primary'
                : 'bg-destructive/70',
          )}
          style={{ width: `${dimension.score}%` }}
        />
      </div>
    </div>
  )
}

export { DimensionRow }
