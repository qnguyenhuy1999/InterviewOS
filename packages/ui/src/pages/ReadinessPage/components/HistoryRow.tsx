import { cn } from '../../../../lib/utils'
import { READINESS_SCORE_MAX } from '../ReadinessPage.constants'
import type { ReadinessHistoryItem } from '../ReadinessPage.types'
import {
  getReadinessDeltaLabel,
  getReadinessHistoryDateLabel,
  getReadinessTrend,
} from '../ReadinessPage.utils'
import { ReadinessTrendIcon } from './ReadinessTrendIcon'

function HistoryRow({ item, isLast }: { item: ReadinessHistoryItem; isLast?: boolean }) {
  const trend = getReadinessTrend(item.improvementTrend)

  return (
    <div className="flex gap-3">
      <div className="relative flex w-5 shrink-0 flex-col items-center">
        {!isLast && (
          <span className="absolute top-5 bottom-0 left-1/2 -translate-x-1/2 border-l border-border/60" />
        )}
        <span
          className={cn(
            'relative mt-2.5 inline-flex size-3 rounded-full border-2 border-background ring-2',
            trend === 'UP'
              ? 'bg-success ring-success/25'
              : trend === 'DOWN'
                ? 'bg-destructive ring-destructive/25'
                : 'bg-primary ring-primary/20',
          )}
        />
      </div>

      <article className="mb-3 flex flex-1 items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 transition-colors duration-150 hover:bg-muted/30">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {getReadinessHistoryDateLabel(item.computedAt)}
          </p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
            {item.overallScore}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / {READINESS_SCORE_MAX}
            </span>
          </p>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            trend === 'UP'
              ? 'bg-success/10 text-success'
              : trend === 'DOWN'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground',
          )}
        >
          <ReadinessTrendIcon delta={item.improvementTrend} />
          <span>{getReadinessDeltaLabel(item.improvementTrend)}</span>
        </span>
      </article>
    </div>
  )
}

export { HistoryRow }
