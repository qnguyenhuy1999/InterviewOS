import { TrendingUpIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { SectionCard } from '../../../../components/ui/page'
import { Progress } from '../../../../components/ui/progress'
import { READINESS_SCORE_MAX } from '../ReadinessPage.constants'
import type { ReadinessPageProps } from '../ReadinessPage.types'
import { getBestReadinessDimension, getReadinessComputedAtLabel } from '../ReadinessPage.utils'
import { DimensionRow } from './DimensionRow'
import { HistoryRow } from './HistoryRow'
import { ReadinessDeltaBadge } from './ReadinessDeltaBadge'
import { StatCard } from './StatCard'

function ReadinessBody({ data }: { data: NonNullable<ReadinessPageProps['data']> }) {
  const bestDimension = getBestReadinessDimension(data.latest.breakdown)
  const confidencePercent = Math.round(data.latest.confidenceLevel * 100)
  const learningProgressPercent = Math.round(data.latest.learningProgress * 100)
  const reviewCompletionPercent = Math.round(data.latest.reviewCompletion * 100)

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="gap-0 overflow-hidden py-0 xl:col-span-2">
          <CardHeader className="border-b bg-card px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current readiness
            </p>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex items-end gap-1.5">
                <CardTitle className="text-6xl font-semibold tracking-tight tabular-nums leading-none">
                  {data.latest.overallScore}
                </CardTitle>
                <p className="pb-1 text-base text-muted-foreground">/ {READINESS_SCORE_MAX}</p>
              </div>
              <ReadinessDeltaBadge delta={data.latest.improvementTrend} />
            </div>

            <p className="text-xs text-muted-foreground">
              {getReadinessComputedAtLabel(data.latest.computedAt)}
            </p>
          </CardHeader>

          <div className="px-5 pt-3.5">
            <Progress value={data.latest.overallScore} className="h-1.5" />
          </div>

          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            <StatCard
              label="Confidence"
              value={`${confidencePercent}%`}
              progress={confidencePercent}
              description="Backed by recent sessions and review data."
            />
            <StatCard
              label="Learning progress"
              value={`${learningProgressPercent}%`}
              progress={learningProgressPercent}
              description="Learning-path items completed so far."
            />
            <StatCard
              label="Review completion"
              value={`${reviewCompletionPercent}%`}
              progress={reviewCompletionPercent}
              description="Review items that crossed the mastery threshold."
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-0 py-0">
          <CardHeader className="border-b px-5 py-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <TrendingUpIcon className="size-3.5" />
              Strongest dimension
            </div>
            <CardTitle className="mt-1 text-2xl font-semibold tracking-tight leading-snug">
              {bestDimension.label}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-semibold tabular-nums tracking-tight text-success">
                {bestDimension.score}
              </span>
              <span className="text-base text-muted-foreground">/ {READINESS_SCORE_MAX}</span>
            </div>

            <div className="space-y-1.5">
              <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-success transition-all duration-700"
                  style={{ width: `${bestDimension.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Weight {Math.round(bestDimension.weight * 100)}% of overall score
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <SectionCard
        title="Dimension breakdown"
        description="Each dimension contributes to the overall readiness score based on its weight."
      >
        <div className="divide-y divide-border/50">
          {data.latest.breakdown.map((dimension) => (
            <div key={dimension.dimension} className="py-4 first:pt-0 last:pb-0">
              <DimensionRow dimension={dimension} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="History"
        description="Your readiness score after each practice session, review, or interview."
      >
        <div className="pt-1">
          {data.history.map((item, index) => (
            <HistoryRow key={item.id} item={item} isLast={index === data.history.length - 1} />
          ))}
        </div>
      </SectionCard>
    </>
  )
}

export { ReadinessBody }
