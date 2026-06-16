import { Progress } from '../../../../components/ui/progress'
import type { NotebookPageNote } from '../NotebookPage.types'
import { getNotebookReadinessPercent, getReadinessTierClass } from '../NotebookPage.utils'

export function NotebookProgress({
  status,
  progressLabel,
}: {
  status: NotebookPageNote['status']
  progressLabel: string
}) {
  const percent = getNotebookReadinessPercent(status)
  const indicatorClass = getReadinessTierClass(percent)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase text-muted-foreground">
        <span>Readiness</span>
        <span>{progressLabel}</span>
      </div>
      <Progress value={percent} indicatorClassName={indicatorClass} className="h-1.5" />
    </div>
  )
}
