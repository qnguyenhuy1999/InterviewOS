import { WeakConceptStatus } from '@interviewos/types'
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import { Badge } from '../../../../components/ui/badge'
import { STATUS_META, TREND_COLOR, TREND_LABEL } from '../DashboardPage.constants'
import { ReadyDashboardState, StatusTrend } from '../DashboardPage.types'
import { missLabel } from '../DashboardPage.utils'

function TrendIcon({ trend }: { trend: StatusTrend }) {
  if (trend === 'up') return <TrendingUpIcon className="size-3" />
  if (trend === 'down') return <TrendingDownIcon className="size-3" />
  return <MinusIcon className="size-3" />
}

type WeakConceptListProps = {
  concepts: ReadyDashboardState['progress']['weakConceptTrends']
}

export function WeakConceptList({ concepts }: WeakConceptListProps) {
  if (concepts.length === 0) {
    return (
      <p className="px-5 py-5 text-sm text-muted-foreground">
        No weak concepts tracked. Keep practicing to generate sharper signals.
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {concepts.map((concept) => {
        const meta = STATUS_META[concept.status] ?? STATUS_META[WeakConceptStatus.IGNORED]

        return (
          <div
            key={concept.concept}
            className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-100 hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{concept.concept}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {missLabel(concept.occurrenceCount)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge variant="outline" className={meta.badgeClass}>
                {meta.label}
              </Badge>
              <span className={`flex items-center gap-1 text-xs ${TREND_COLOR[meta.trend]}`}>
                <TrendIcon trend={meta.trend} />
                {TREND_LABEL[meta.trend]}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
