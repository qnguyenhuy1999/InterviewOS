import { ArrowDownIcon, ArrowUpIcon, GaugeIcon, MinusIcon, RotateCcwIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { cn } from '../../../lib/utils'
import { READINESS_SCORE_MAX } from './ReadinessPage.constants'
import { readinessPageFixture } from './ReadinessPage.fixtures'
import type {
  ReadinessDimension,
  ReadinessHistoryItem,
  ReadinessPageProps,
} from './ReadinessPage.types'
import {
  getBestReadinessDimension,
  getReadinessComputedAtLabel,
  getReadinessDeltaLabel,
  getReadinessHistoryDateLabel,
  getReadinessTrend,
  getReadinessTrendClassName,
} from './ReadinessPage.utils'

function ReadinessTrendIcon({ delta }: { delta: number }) {
  const trend = getReadinessTrend(delta)

  if (trend === 'UP') {
    return <ArrowUpIcon className="size-4" />
  }

  if (trend === 'DOWN') {
    return <ArrowDownIcon className="size-4" />
  }

  return <MinusIcon className="size-4" />
}

function ReadinessDeltaBadge({ delta }: { delta: number }) {
  return (
    <Badge variant="outline" className={getReadinessTrendClassName(getReadinessTrend(delta))}>
      <ReadinessTrendIcon delta={delta} />
      {getReadinessDeltaLabel(delta)}
    </Badge>
  )
}

function DimensionRow({ dimension }: { dimension: ReadinessDimension }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{dimension.label}</p>
          <p className="text-xs text-muted-foreground">
            Weight {Math.round(dimension.weight * 100)}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={getReadinessTrendClassName(dimension.trend)}>
            <ReadinessTrendIcon
              delta={dimension.trend === 'UP' ? 1 : dimension.trend === 'DOWN' ? -1 : 0}
            />
            {dimension.score}
          </span>
        </div>
      </div>
      <Progress value={dimension.score} className="h-2" />
    </div>
  )
}

function HistoryRow({ item }: { item: ReadinessHistoryItem }) {
  return (
    <div className="flex gap-2.5">
      <div className="relative flex w-5 shrink-0 justify-center">
        <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-border/80" />
        <span className="relative mt-2.5 inline-flex size-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20 transition-shadow duration-200" />
      </div>
      <article className="flex flex-1 items-center justify-between gap-3 rounded-md border border-border/60 bg-background px-3.5 py-3 transition-colors duration-150 hover:bg-muted/30">
        <div>
          <p className="text-xs text-muted-foreground">
            {getReadinessHistoryDateLabel(item.computedAt)}
          </p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
            {item.overallScore}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full p-1.5',
            getReadinessTrend(item.improvementTrend) === 'UP'
              ? 'text-success'
              : getReadinessTrend(item.improvementTrend) === 'DOWN'
                ? 'text-destructive'
                : 'text-muted-foreground',
          )}
        >
          <ReadinessTrendIcon delta={item.improvementTrend} />
          <span className="sr-only">{getReadinessDeltaLabel(item.improvementTrend)}</span>
        </span>
      </article>
    </div>
  )
}

function ReadinessBody({ data }: { data: NonNullable<ReadinessPageProps['data']> }) {
  const bestDimension = getBestReadinessDimension(data.latest.breakdown)
  const confidencePercent = Math.round(data.latest.confidenceLevel * 100)
  const learningProgressPercent = Math.round(data.latest.learningProgress * 100)
  const reviewCompletionPercent = Math.round(data.latest.reviewCompletion * 100)

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="gap-0 overflow-hidden py-0 xl:col-span-2">
          <CardHeader className="border-b bg-card py-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Current readiness
            </p>
            <div className="flex flex-wrap items-end gap-2.5">
              <div className="flex items-end gap-1.5">
                <CardTitle className="text-6xl font-semibold tracking-tight tabular-nums">
                  {data.latest.overallScore}
                </CardTitle>
                <p className="pb-1.5 text-lg text-muted-foreground">/ {READINESS_SCORE_MAX}</p>
              </div>
              <ReadinessDeltaBadge delta={data.latest.improvementTrend} />
            </div>
            <p className="text-xs text-muted-foreground md:text-sm">
              {getReadinessComputedAtLabel(data.latest.computedAt)}
            </p>
          </CardHeader>
          <CardContent className="grid gap-3.5 p-3.5 md:grid-cols-3">
            <div className="rounded-md border border-border/60 bg-background p-3.5 transition-colors duration-150 hover:bg-muted/20">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Confidence</p>
              <p className="mt-1.5 text-xl font-semibold tracking-tight">{confidencePercent}%</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Higher confidence means the score is backed by more recent sessions and review data.
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-background p-3.5 transition-colors duration-150 hover:bg-muted/20">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Learning progress
              </p>
              <p className="mt-1.5 text-xl font-semibold tracking-tight">
                {learningProgressPercent}%
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Based on how many learning-path items have been completed.
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-background p-3.5 transition-colors duration-150 hover:bg-muted/20">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Review completion
              </p>
              <p className="mt-1.5 text-xl font-semibold tracking-tight">
                {reviewCompletionPercent}%
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Measures how much of the review queue has crossed the mastery threshold.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 border-border/60 py-0">
          <CardHeader className="border-b py-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Best dimension</p>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {bestDimension.label}
            </CardTitle>
            <p className="text-base text-muted-foreground">
              {bestDimension.score} / {READINESS_SCORE_MAX}
            </p>
          </CardHeader>
          <CardContent className="p-3.5">
            <Progress value={bestDimension.score} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <SectionCard
        title="Dimension breakdown"
        description="Each dimension contributes to the overall readiness score."
      >
        <div className="space-y-4">
          {data.latest.breakdown.map((dimension) => (
            <DimensionRow key={dimension.dimension} dimension={dimension} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="History"
        description="Track how your readiness changes after practice, reviews, and interview sessions."
      >
        <div className="space-y-3">
          {data.history.map((item) => (
            <HistoryRow key={item.id} item={item} />
          ))}
        </div>
      </SectionCard>
    </>
  )
}

function LoadingBody() {
  return (
    <PageBody className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-64 rounded-md" />
        <Skeleton className="h-64 rounded-md xl:col-span-2" />
      </div>
      <Skeleton className="h-88 rounded-md" />
      <Skeleton className="h-88 rounded-md" />
    </PageBody>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <PageBody>
      <EmptyState
        className="min-h-128 border-destructive/20 bg-destructive/5"
        title={<span className="text-destructive">Failed to load readiness</span>}
        description={message}
        action={<Button variant="destructive">Retry</Button>}
      />
    </PageBody>
  )
}

function EmptyBody() {
  return (
    <PageBody>
      <EmptyState
        className="min-h-96"
        icon={GaugeIcon}
        title="No readiness snapshots yet"
        description="Complete review sessions and interviews to generate your first readiness baseline."
        action={<Button>Start practice</Button>}
      />
    </PageBody>
  )
}

function Root({
  data = readinessPageFixture,
  loading,
  empty,
  error,
  renderRecomputeAction,
}: ReadinessPageProps) {
  return (
    <>
      <PageHeader
        title={data.title}
        description={data.subtitle}
        actions={
          renderRecomputeAction ?? (
            <Button size="lg">
              <RotateCcwIcon className="size-4" />
              {data.recomputeLabel}
            </Button>
          )
        }
      />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody />
        ) : (
          <ReadinessBody data={data} />
        )}
      </PageBody>
      <Separator className="opacity-0" />
    </>
  )
}

const ReadinessPage = Object.assign(Root, {
  DimensionRow,
  HistoryRow,
})

export default ReadinessPage
