import { Progress } from '../../../../components/ui/progress'
import { formatLearningPathLabel } from '../LearningPathPage.utils'

type CoverageCardProps = {
  summary: ReturnType<typeof import('../LearningPathPage.utils').getLearningPathTypeSummaries>[number]
}

export function CoverageCard({ summary }: CoverageCardProps) {
  const typeProgress =
    summary.total === 0 ? 0 : Math.round((summary.completed / summary.total) * 100)

  return (
    <div className="rounded-md border border-border/80 bg-muted p-4">
      <p className="text-sm font-semibold">{formatLearningPathLabel(summary.type)}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {summary.completed}/{summary.total}
      </p>
      <Progress value={typeProgress} className="mt-3 h-2" />
      <p className="mt-2 text-xs text-muted-foreground">{typeProgress}% completed</p>
    </div>
  )
}
