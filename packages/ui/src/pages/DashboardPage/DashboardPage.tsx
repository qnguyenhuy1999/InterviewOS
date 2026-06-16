import { WeakConceptStatus } from '@interviewos/types'
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LanguagesIcon,
  MicIcon,
  MinusIcon,
  NotebookTextIcon,
  SparklesIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import type * as React from 'react'
import { useEffect, useState } from 'react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { EmptyState, PageBody } from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../atoms/Spinner'
import type {
  DashboardMetric,
  DashboardPageActions,
  DashboardPageProps,
  DashboardPageState,
} from './DashboardPage.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReadyDashboardState = Extract<DashboardPageState, { kind: 'ready' }>

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<
  string,
  {
    label: string
    trend: 'up' | 'down' | 'stable'
    badgeClass: string
  }
> = {
  [WeakConceptStatus.ACTIVE]: {
    label: 'Active',
    trend: 'down',
    badgeClass: 'border-destructive/30 bg-error-soft text-destructive',
  },
  [WeakConceptStatus.IMPROVING]: {
    label: 'Improving',
    trend: 'up',
    badgeClass: 'border-warning/30 bg-warning-soft text-warning',
  },
  [WeakConceptStatus.RESOLVED]: {
    label: 'Resolved',
    trend: 'up',
    badgeClass: 'border-success/30 bg-success-soft text-success',
  },
  [WeakConceptStatus.IGNORED]: {
    label: 'Ignored',
    trend: 'stable',
    badgeClass: 'border-border bg-muted text-muted-foreground',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPercent(value: number) {
  return `${Math.round(value > 1 ? value : value * 100)}%`
}

function missLabel(count: number) {
  return `${count} recent ${count === 1 ? 'miss' : 'misses'}`
}

function getDashboardMetrics(state: ReadyDashboardState): DashboardMetric[] {
  return [
    {
      label: 'Interview readiness',
      value: String(state.progress.interviewReadiness),
      hint: 'Completed interviews + latest readiness snapshot.',
    },
    {
      label: 'Technical mastery',
      value: String(state.progress.technicalMastery),
      hint: 'Weighted from reviewed notes and weak-concept status.',
    },
    {
      label: 'English score',
      value: String(state.progress.englishScore),
      hint: 'Spoken feedback captured during interview practice.',
    },
    {
      label: 'Review streak',
      value: String(state.progress.reviewStreak),
      hint: `${state.progress.dueReviews} items currently due.`,
    },
    {
      label: 'Questions practiced',
      value: String(state.progress.questionsPracticed),
      hint: 'Completed answers across your current history.',
    },
    {
      label: 'Notes mastered',
      value: String(state.progress.notesMastered),
      hint: 'Entries that have graduated past review.',
    },
  ]
}

// ─── ReadinessDial ────────────────────────────────────────────────────────────
// Signature element: animated SVG arc. Colours reference CSS custom properties
// already defined in the project token system.

function ReadinessDial({ score }: { score: number }) {
  const R = 54
  const CX = 70
  const CY = 70
  const circumference = 2 * Math.PI * R
  const arcLength = circumference * (270 / 360)
  const [filled, setFilled] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(Math.min(score, 100)))
    return () => cancelAnimationFrame(id)
  }, [score])

  const offset = arcLength - (filled / 100) * arcLength

  return (
    <div className="relative size-[140px]">
      <svg
        viewBox="0 0 140 140"
        width="140"
        height="140"
        className="overflow-visible"
        aria-label={`Readiness score: ${score}`}
        role="img"
      >
        <defs>
          {/* Uses --primary and --accent-strong from the project token system */}
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent-strong)" />
          </linearGradient>
        </defs>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={8}
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(135 ${CX} ${CY})`}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="url(#dialGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(135 ${CX} ${CY})`}
          className="transition-[stroke-dashoffset] duration-900 ease-in-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="font-mono text-[34px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
          {score}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          readiness
        </span>
      </div>
    </div>
  )
}

// ─── ActionItem ───────────────────────────────────────────────────────────────

function ActionItem({
  href,
  label,
  icon,
  primary = false,
}: {
  href: string
  label: string
  icon: React.ReactNode
  primary?: boolean
}) {
  const base =
    'flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
  const variant = primary
    ? 'border-primary/30 bg-accent-soft text-primary hover:bg-accent-soft/70'
    : 'border-border bg-muted text-foreground hover:bg-accent-soft hover:border-primary/30 hover:text-primary'

  return (
    <a href={href} className={`${base} ${variant}`}>
      <span className="size-4 shrink-0 opacity-70 [&>svg]:size-4">{icon}</span>
      {label}
    </a>
  )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card
      aria-label={`${metric.label}: ${metric.value}`}
      className="group relative overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-elevated"
      size="sm"
    >
      {/* Sliding top accent — inherits --primary from token system */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary via-accent-strong to-transparent transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />
      <CardHeader className="gap-1 pt-4">
        <CardDescription className="text-[11px] font-semibold uppercase tracking-widest">
          {metric.label}
        </CardDescription>
        <CardTitle className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
          {metric.value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-xs leading-5 text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  )
}

// ─── LoadingBody ──────────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-52 rounded-xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Card className="min-h-48 items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Preparing your progress overview…</p>
      </Card>
    </div>
  )
}

// ─── ErrorBody ────────────────────────────────────────────────────────────────

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      icon={AlertCircleIcon}
      title={<span className="text-destructive">Failed to load dashboard</span>}
      description={message}
      action={
        retryHref ? (
          <Button asChild variant="destructive">
            <a href={retryHref}>Retry</a>
          </Button>
        ) : undefined
      }
    />
  )
}

// ─── EmptyBody ────────────────────────────────────────────────────────────────

function EmptyBody({ actions }: { actions: DashboardPageActions }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="text-lg font-semibold">Start your first loop</CardTitle>
            <CardDescription>
              Pick one action to create the first signals for this dashboard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 py-4">
          <ActionItem
            href={actions.createNoteHref}
            label="Create note"
            icon={<NotebookTextIcon />}
            primary
          />
          <ActionItem
            href={actions.startInterviewHref}
            label="Start interview"
            icon={<MicIcon />}
          />
          <ActionItem href={actions.reviewQueueHref} label="Review queue" icon={<SparklesIcon />} />
          <ActionItem
            href={actions.englishNotesHref}
            label="English notes"
            icon={<LanguagesIcon />}
          />
        </CardContent>
      </Card>

      <EmptyState
        className="min-h-72"
        icon={CheckCircle2Icon}
        title="No activity yet"
        description="Create a note, run an interview, or open the review queue to generate your first progress signals."
        action={
          <Button asChild>
            <a href={actions.createNoteHref}>
              <NotebookTextIcon aria-hidden="true" />
              Create first note
            </a>
          </Button>
        }
      />
    </div>
  )
}

// ─── DashboardHero ────────────────────────────────────────────────────────────

function DashboardHero({
  state,
  actions,
}: {
  state: ReadyDashboardState
  actions: DashboardPageActions
}) {
  const focusConcept = state.progress.weakConceptTrends[0]
  const readinessScore = state.readiness?.overallScore ?? state.progress.interviewReadiness
  const confidence = state.readiness?.confidenceLevel

  const focusDescription = focusConcept
    ? `${focusConcept.concept} is your highest-priority gap right now — ${missLabel(focusConcept.occurrenceCount)}.`
    : state.progress.dueReviews > 0
      ? `${state.progress.dueReviews} review ${state.progress.dueReviews === 1 ? 'item is' : 'items are'} due. Clear the queue to keep readiness moving.`
      : 'No urgent gaps flagged. Keep the loop moving with a short practice session.'

  return (
    <Card className="relative overflow-hidden bg-surface-elevated py-0">
      {/* Subtle gradient tint using existing accent tokens */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/4 via-transparent to-accent-soft/30"
        aria-hidden="true"
      />
      <div className="relative grid lg:grid-cols-[1fr_auto]">
        {/* Main content */}
        <div className="flex flex-col gap-5 p-6 lg:p-7">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Today's focus
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-[26px]">
              Close the highest-impact gap next
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {focusDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <a href={actions.startInterviewHref}>
                <MicIcon aria-hidden="true" />
                Start interview
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={actions.reviewQueueHref}>
                <SparklesIcon aria-hidden="true" />
                Review queue
              </a>
            </Button>
          </div>
        </div>

        {/* Readiness dial panel */}
        <div className="flex flex-col items-center justify-center gap-4 border-t p-6 lg:min-w-[220px] lg:border-t-0 lg:border-l lg:p-7">
          <ReadinessDial score={readinessScore} />
          <div className="text-center">
            {confidence != null && (
              <p className="text-xs text-muted-foreground">
                {formatPercent(confidence)} confidence
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">
              {state.progress.reviewStreak}d streak · {state.progress.dueReviews} due
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── WeakConceptList ──────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUpIcon className="size-3" />
  if (trend === 'down') return <TrendingDownIcon className="size-3" />
  return <MinusIcon className="size-3" />
}

const TREND_LABEL = { up: 'Improving', down: 'Needs attention', stable: 'Steady' } as const
const TREND_COLOR = {
  up: 'text-success',
  down: 'text-destructive',
  stable: 'text-muted-foreground',
} as const

function WeakConceptList({
  concepts,
}: {
  concepts: ReadyDashboardState['progress']['weakConceptTrends']
}) {
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
              <span className={`flex items-center gap-1 text-[11px] ${TREND_COLOR[meta.trend]}`}>
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

// ─── ReadinessSnapshot ────────────────────────────────────────────────────────

function ReadinessSnapshot({
  state,
  actions,
}: {
  state: ReadyDashboardState
  actions: DashboardPageActions
}) {
  if (!state.readiness) return null

  return (
    <Card className="py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="text-lg font-semibold">Readiness snapshot</CardTitle>
          <CardDescription>
            A roll-up of the areas feeding your overall interview readiness.
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="link" size="sm" className="h-auto px-0">
            <a href={actions.readinessHref}>
              Open readiness
              <ArrowRightIcon aria-hidden="true" />
            </a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6 py-5 md:grid-cols-[160px_1fr]">
        {/* Overall score */}
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Overall
          </p>
          <p className="font-mono text-5xl font-semibold tracking-tight tabular-nums text-foreground">
            {state.readiness.overallScore}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPercent(state.readiness.confidenceLevel)} confidence
          </p>
        </div>

        {/* Dimension breakdown */}
        <div className="flex flex-col gap-4">
          {state.readiness.breakdown.map((item) => (
            <div key={item.dimension} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {item.score}
                </span>
              </div>
              <Progress value={Math.min(item.score, 100)} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ReadyBody ────────────────────────────────────────────────────────────────

function ReadyBody({
  state,
  actions,
}: {
  state: ReadyDashboardState
  actions: DashboardPageActions
}) {
  const metrics = getDashboardMetrics(state)

  return (
    <div className="flex flex-col gap-5">
      <DashboardHero state={state} actions={actions} />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid items-start gap-4 xl:grid-cols-[1fr_272px]">
        {/* Weak concepts */}
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-lg font-semibold">Weak concepts to revisit</CardTitle>
              <CardDescription>Topics still dragging recent interview performance.</CardDescription>
            </div>
            <CardAction>
              <Button asChild variant="link" size="sm" className="h-auto px-0">
                <a href={actions.reviewQueueHref}>
                  Review queue
                  <ArrowRightIcon aria-hidden="true" />
                </a>
              </Button>
            </CardAction>
          </CardHeader>
          <WeakConceptList concepts={state.progress.weakConceptTrends} />
        </Card>

        {/* Actions sidebar */}
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-lg font-semibold">Quick actions</CardTitle>
              <CardDescription>High-frequency workflows.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-1.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Practice
              </p>
              <ActionItem
                href={actions.createNoteHref}
                label="Create note"
                icon={<NotebookTextIcon />}
                primary
              />
              <ActionItem
                href={actions.startInterviewHref}
                label="Start interview"
                icon={<MicIcon />}
              />
              <ActionItem href={actions.quickStartHref} label="Quick start" icon={<MicIcon />} />
              <ActionItem
                href={actions.reviewQueueHref}
                label="Review queue"
                icon={<SparklesIcon />}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Browse
              </p>
              <ActionItem
                href={actions.allNotesHref}
                label="All notes"
                icon={<NotebookTextIcon />}
              />
              <ActionItem href={actions.allSessionsHref} label="All sessions" icon={<MicIcon />} />
              <ActionItem
                href={actions.englishNotesHref}
                label="English notes"
                icon={<LanguagesIcon />}
              />
              <ActionItem href={actions.readinessHref} label="Readiness" icon={<SparklesIcon />} />
            </div>
          </CardContent>
        </Card>
      </div>

      <ReadinessSnapshot state={state} actions={actions} />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({ state, actions }: DashboardPageProps) {
  return (
    <PageBody>
      {state.kind === 'loading' ? (
        <LoadingBody />
      ) : state.kind === 'error' ? (
        <ErrorBody message={state.message} retryHref={actions.retryHref} />
      ) : state.kind === 'empty' ? (
        <EmptyBody actions={actions} />
      ) : (
        <ReadyBody state={state} actions={actions} />
      )}
      <Separator className="mt-8 opacity-0" />
    </PageBody>
  )
}

const DashboardPage = Object.assign(Root, { MetricCard })
export default DashboardPage
