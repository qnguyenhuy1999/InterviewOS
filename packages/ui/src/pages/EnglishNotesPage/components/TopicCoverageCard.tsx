import { Progress } from '../../../../components/ui/progress'
import type { EnglishTopicGroup } from '../EnglishNotesPage.utils'

export function TopicCoverageCard({ topic }: { topic: EnglishTopicGroup }) {
  const progressColour =
    topic.masteryPercentage >= 75
      ? 'text-success'
      : topic.masteryPercentage >= 40
        ? 'text-warning'
        : 'text-destructive'

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4 transition-shadow duration-150 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-semibold text-foreground">{topic.name}</p>
          <p className="text-xs text-muted-foreground">
            {topic.total} notes · {topic.mastered} mastered · {topic.needsPractice} urgent
          </p>
        </div>
        <span className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${progressColour}`}>
          {topic.masteryPercentage}%
        </span>
      </div>
      <Progress value={topic.masteryPercentage} className="mt-3 h-1.5" />
    </div>
  )
}
