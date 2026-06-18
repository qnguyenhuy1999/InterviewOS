import { Button } from '../../../../components/ui/button'
import type { LearningPathPageProps } from '../LearningPathPage.types'
import {
  formatLearningPathLabel,
  getLearningPathEstimatedTimeLabel,
} from '../LearningPathPage.utils'

type FocusCardProps = {
  focusItem: NonNullable<ReturnType<typeof import('../LearningPathPage.utils').getLearningPathFocusItem>>
  renderItemActions?: LearningPathPageProps['renderItemActions']
}

export function FocusCard({ focusItem, renderItemActions }: FocusCardProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-accent-soft p-5 md:col-span-2 xl:col-span-4">
      <p className="text-xs font-semibold uppercase text-primary/80">Today&apos;s focus</p>
      <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{focusItem.title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{focusItem.reason}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="rounded-md border border-primary/20 bg-background px-3 py-1 font-medium text-foreground">
          Priority {focusItem.priorityScore}
        </span>
        <span>{formatLearningPathLabel(focusItem.type)}</span>
        <span>Estimated time: {getLearningPathEstimatedTimeLabel(focusItem)}</span>
      </div>
      {renderItemActions ? <div className="mt-5">{renderItemActions(focusItem)}</div> : null}
    </div>
  )
}
