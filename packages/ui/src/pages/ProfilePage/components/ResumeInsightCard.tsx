import { FileTextIcon } from 'lucide-react'

import { TagList } from '../../../molecules/TagList/TagList'
import type { ProfileResumeInsight } from '../ProfilePage.types'
import { InsightList } from './InsightList'

export function ResumeInsightCard({ insight }: { insight: ProfileResumeInsight }) {
  return (
    <div className="rounded-md border border-border/80 bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileTextIcon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{insight.fileName}</p>
          <p className="text-xs text-muted-foreground">{insight.uploadedLabel}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <InsightList title="Strengths" items={insight.strengths} tone="strengths" />
        <InsightList title="Gaps" items={insight.gaps} tone="gaps" />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Key skills</p>
          <TagList items={insight.keySkills} />
        </div>
        <InsightList
          title="Recommendations"
          items={insight.recommendations}
          tone="recommendations"
        />
      </div>
    </div>
  )
}
