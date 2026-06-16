import {
  ArrowDownIcon,
  ArrowUpIcon,
  GaugeIcon,
  MinusIcon,
  RotateCcwIcon,
  TrendingUpIcon,
} from 'lucide-react'

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

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function ReadinessTrendIcon({ delta }: { delta: number }) {
  const trend = getReadinessTrend(delta)

  if (trend === 'UP') return <ArrowUpIcon className="size-4" />
  if (trend === 'DOWN') return <ArrowDownIcon className="size-4" />
  return <MinusIcon className="size-4" />
}

function ReadinessDeltaBadge({ delta }: { delta: number }) {
  const trend = getReadinessTrend(delta)
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 px-2.5 py-1 text-xs font-medium', getReadinessTrendClassName(trend))}
    >
      <ReadinessTrendIcon delta={delta} />
      {getReadinessDeltaLabel(delta)}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Stat card – used in the 3-column metrics strip
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string
  value: string
  description: string
  /** 0–100 for the optional progress bar; omit to hide it */
  progress?: number
}

function StatCard({ label, value, description, progress }: StatCardProps) {
  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-4 transition-colors duration-150 hover:bg-muted/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {progress !== undefined && <Progress value={progress} className="h-1.5" />}
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dimension row
// ---------------------------------------------------------------------------

function DimensionRow({ dimension }: { dimension: ReadinessDimension }) {
  // Derive a numeric delta from the typed trend so we avoid the 1 / -1 hack
  const delta = dimension.trend === 'UP' ? 1 : dimension.trend === 'DOWN' ? -1 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-snug">{dimension.label}</p>
          <p className="text-[11px] text-muted-foreground">
            {Math.round(dimension.weight * 100)}% weight
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold tabular-nums',
              getReadinessTrendClassName(dimension.trend),
            )}
          >
            <ReadinessTrendIcon delta={delta} />
            {dimension.score}
          </span>
          <span className="text-xs text-muted-foreground">/ {READINESS_SCORE_MAX}</span>
        </div>
      </div>

      {/* Segmented progress: filled portion tinted by performance */}
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
            dimension.score >= 80
              ? 'bg-success'
              : dimension.score >= 50
                ? 'bg-primary'
                : 'bg-destructive/70',
          )}
          style={{ width: `${dimension.score}%` }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// History row
// ---------------------------------------------------------------------------

function HistoryRow({ item, isLast }: { item: ReadinessHistoryItem; isLast?: boolean }) {
  const trend = getReadinessTrend(item.improvementTrend)

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
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

      {/* Card */}
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

// ---------------------------------------------------------------------------
// Main readiness body
// ---------------------------------------------------------------------------

function ReadinessBody({ data }: { data: NonNullable<ReadinessPageProps['data']> }) {
  const bestDimension = getBestReadinessDimension(data.latest.breakdown)
  const confidencePercent = Math.round(data.latest.confidenceLevel * 100)
  const learningProgressPercent = Math.round(data.latest.learningProgress * 100)
  const reviewCompletionPercent = Math.round(data.latest.reviewCompletion * 100)

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Top row: score hero + best dimension                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Score hero — spans 2 cols */}
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

          {/* Overall score bar */}
          <div className="px-5 pt-3.5">
            <Progress value={data.latest.overallScore} className="h-1.5" />
          </div>

          {/* 3 stat cards */}
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

        {/* Best dimension — 1 col */}
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
            {/* Score ring-style display */}
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

      {/* ------------------------------------------------------------------ */}
      {/* Dimension breakdown                                                  */}
      {/* ------------------------------------------------------------------ */}
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

      {/* ------------------------------------------------------------------ */}
      {/* History timeline                                                     */}
      {/* ------------------------------------------------------------------ */}
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

// ---------------------------------------------------------------------------
// Loading / error / empty states
// ---------------------------------------------------------------------------

function LoadingBody() {
  return (
    <PageBody className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Hero card (2 cols) */}
        <Skeleton className="h-72 rounded-lg xl:col-span-2" />
        {/* Best dimension (1 col) */}
        <Skeleton className="h-72 rounded-lg" />
      </div>
      <Skeleton className="h-80 rounded-lg" />
      <Skeleton className="h-80 rounded-lg" />
    </PageBody>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <PageBody>
      <EmptyState
        className="min-h-96 border-destructive/20 bg-destructive/5"
        title={<span className="text-destructive">Readiness failed to load</span>}
        description={message}
        action={
          <Button variant="destructive">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
        }
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
        description="Complete a review session or interview to generate your first readiness baseline."
        action={<Button>Start practice</Button>}
      />
    </PageBody>
  )
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

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
