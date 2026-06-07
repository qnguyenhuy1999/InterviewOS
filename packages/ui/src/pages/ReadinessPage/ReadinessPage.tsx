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
import type { ReadinessDimension, ReadinessHistoryItem, ReadinessPageProps } from './ReadinessPage.types'
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
    <div className="space-y-2">
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
      <Progress value={dimension.score} className="h-2.5" />
    </div>
  )
}

function HistoryRow({ item }: { item: ReadinessHistoryItem }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
      <div className="relative flex justify-center">
        <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-border/80" />
        <span className="relative mt-3 inline-flex size-3 rounded-full border-2 border-background bg-primary" />
      </div>
      <article className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background px-4 py-4">
        <div>
          <p className="text-sm text-muted-foreground">{getReadinessHistoryDateLabel(item.computedAt)}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{item.overallScore}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full p-2',
            getReadinessTrend(item.improvementTrend) === 'UP'
              ? 'text-emerald-600'
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

  return (
    <PageBody className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b bg-gradient-to-br from-background via-background to-primary/5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Current readiness
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex items-end gap-2">
                <CardTitle className="text-6xl font-semibold tracking-tight">
                  {data.latest.overallScore}
                </CardTitle>
                <p className="pb-2 text-xl text-muted-foreground">/ {READINESS_SCORE_MAX}</p>
              </div>
              <ReadinessDeltaBadge delta={data.latest.improvementTrend} />
            </div>
            <p className="text-sm text-muted-foreground">
              {getReadinessComputedAtLabel(data.latest.computedAt)}
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Confidence
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {Math.round(data.latest.confidenceLevel * 100)}%
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Learning progress
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {data.latest.learningProgress}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Review completion
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {data.latest.reviewCompletion}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Best dimension
            </p>
            <CardTitle className="text-4xl font-semibold tracking-tight">
              {bestDimension.label}
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              {bestDimension.score} / {READINESS_SCORE_MAX}
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <Progress value={bestDimension.score} className="h-2.5" />
          </CardContent>
        </Card>
      </div>

      <SectionCard
        title="Dimension breakdown"
        description="Each dimension contributes to the overall readiness score."
      >
        <div className="space-y-5">
          {data.latest.breakdown.map((dimension) => (
            <DimensionRow key={dimension.dimension} dimension={dimension} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="History"
        description="Track how your readiness changes after practice, reviews, and interview sessions."
      >
        <div className="space-y-4">
          {data.history.map((item) => (
            <HistoryRow key={item.id} item={item} />
          ))}
        </div>
      </SectionCard>
    </PageBody>
  )
}

function LoadingBody() {
  return (
    <PageBody className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
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

function Root({ data = readinessPageFixture, loading, empty, error }: ReadinessPageProps) {
  return (
    <>
      <PageHeader
        title={data.title}
        description={data.subtitle}
        actions={
          <Button size="lg">
            <RotateCcwIcon className="size-4" />
            {data.recomputeLabel}
          </Button>
        }
      />
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : empty ? (
        <EmptyBody />
      ) : (
        <ReadinessBody data={data} />
      )}
      <Separator className="opacity-0" />
    </>
  )
}

const ReadinessPage = Object.assign(Root, {
  DimensionRow,
  HistoryRow,
})

export default ReadinessPage
