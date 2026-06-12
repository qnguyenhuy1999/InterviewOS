import { WeakConceptStatus } from '@interviewos/types'
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LanguagesIcon,
  MicIcon,
  NotebookTextIcon,
  SparklesIcon,
} from 'lucide-react'
import type * as React from 'react'

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
import { Spinner } from '../../../components/ui/spinner'
import type {
  DashboardMetric,
  DashboardPageActions,
  DashboardPageProps,
  DashboardPageState,
} from './DashboardPage.types'

type ReadyDashboardState = Extract<DashboardPageState, { kind: 'ready' }>
type WeakConceptTrend = ReadyDashboardState['progress']['weakConceptTrends'][number]

const TREND_LABEL: Record<'UP' | 'DOWN' | 'STABLE', string> = {
  UP: 'Improving',
  DOWN: 'Needs attention',
  STABLE: 'Steady',
}

const WEAK_CONCEPT_STATUS_TONE: Record<string, string> = {
  [WeakConceptStatus.ACTIVE]: 'border-destructive/30 bg-destructive/10 text-destructive',
  [WeakConceptStatus.IMPROVING]: 'border-warning/30 bg-warning-soft text-warning',
  [WeakConceptStatus.RESOLVED]: 'border-success/30 bg-success-soft text-success',
  [WeakConceptStatus.IGNORED]: 'border-border bg-muted text-muted-foreground',
}

function ActionLinkButton({
  href,
  label,
  icon,
  variant = 'outline',
}: {
  href: string
  label: string
  icon: React.ReactNode
  variant?: 'default' | 'outline'
}) {
  return (
    <Button asChild variant={variant} size="lg" className="w-full justify-start">
      <a href={href}>
        {icon}
        {label}
      </a>
    </Button>
  )
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card aria-label={`${metric.label}: ${metric.value}`} className="h-full gap-2 py-4" size="sm">
      <CardHeader className="gap-1">
        <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {metric.label}
        </CardDescription>
        <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
          {metric.value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  )
}

function LoadingBody() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-48 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-md" />
        ))}
      </div>
      <Card className="min-h-64 items-center justify-center gap-3">
        <Spinner className="size-7" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Preparing your progress overview...</p>
      </Card>
    </div>
  )
}

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
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

function EmptyBody({ actions }: { actions: DashboardPageActions }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="text-xl font-semibold">Start your first loop</CardTitle>
            <CardDescription>
              Pick one action to create the first signals for this dashboard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 py-4 md:grid-cols-2 xl:grid-cols-4">
          <ActionLinkButton
            href={actions.createNoteHref}
            label="Create note"
            icon={<NotebookTextIcon aria-hidden="true" />}
            variant="default"
          />
          <ActionLinkButton
            href={actions.startInterviewHref}
            label="Start interview"
            icon={<MicIcon aria-hidden="true" />}
          />
          <ActionLinkButton
            href={actions.reviewQueueHref}
            label="Review queue"
            icon={<SparklesIcon aria-hidden="true" />}
          />
          <ActionLinkButton
            href={actions.englishNotesHref}
            label="English notes"
            icon={<LanguagesIcon aria-hidden="true" />}
          />
        </CardContent>
      </Card>

      <EmptyState
        className="min-h-80"
        icon={CheckCircle2Icon}
        title="No dashboard activity yet"
        description="Create a note, start an interview, or open the review queue to generate your first progress signals."
        action={
          <Button asChild>
            <a href={actions.createNoteHref}>Create first note</a>
          </Button>
        }
      />
    </div>
  )
}

function formatWeakConceptStatus(status: WeakConceptTrend['status']) {
  return String(status)
    .toLowerCase()
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}

function getWeakConceptStatusClassName(status: WeakConceptTrend['status']) {
  return WEAK_CONCEPT_STATUS_TONE[status] ?? 'border-border bg-muted text-muted-foreground'
}

function getWeakConceptTrendLabel(status: WeakConceptTrend['status']) {
  if (status === WeakConceptStatus.ACTIVE) return TREND_LABEL.DOWN
  if (status === WeakConceptStatus.RESOLVED) return TREND_LABEL.UP

  return TREND_LABEL.STABLE
}

function getMissCountLabel(count: number) {
  return `${count} recent ${count === 1 ? 'miss' : 'misses'}`
}

function formatPercentScore(value: number) {
  return `${Math.round(value > 1 ? value : value * 100)}%`
}

function getDashboardMetrics(state: ReadyDashboardState): DashboardMetric[] {
  return [
    {
      label: 'Interview readiness',
      value: String(state.progress.interviewReadiness),
      hint: 'Based on completed interviews and your latest readiness snapshot.',
    },
    {
      label: 'Technical mastery',
      value: String(state.progress.technicalMastery),
      hint: 'Weighted from reviewed notes and weak-concept status.',
    },
    {
      label: 'English score',
      value: String(state.progress.englishScore),
      hint: 'Based on spoken feedback captured during interview practice.',
    },
    {
      label: 'Review streak',
      value: String(state.progress.reviewStreak),
      hint: `${state.progress.dueReviews} review items currently due.`,
    },
    {
      label: 'Questions practiced',
      value: String(state.progress.questionsPracticed),
      hint: 'Completed interview answers across your current history.',
    },
    {
      label: 'Notes mastered',
      value: String(state.progress.notesMastered),
      hint: 'Notebook entries that have graduated past review.',
    },
  ]
}

function DashboardHero({
  state,
  actions,
}: {
  state: ReadyDashboardState
  actions: DashboardPageActions
}) {
  const focusConcept = state.progress.weakConceptTrends[0]
  const readinessScore = state.readiness?.overallScore ?? state.progress.interviewReadiness
  const focusDescription = focusConcept
    ? `${focusConcept.concept} is the clearest area to revisit next, with ${getMissCountLabel(
        focusConcept.occurrenceCount,
      )}.`
    : state.progress.dueReviews > 0
      ? `${state.progress.dueReviews} review ${
          state.progress.dueReviews === 1 ? 'item is' : 'items are'
        } due. Clear the queue to keep your readiness moving.`
      : 'No urgent weak concepts are flagged. Keep the loop moving with a short interview practice session.'

  return (
    <Card className="bg-surface-elevated py-0">
      <CardContent className="grid gap-5 py-5 lg:grid-cols-3 lg:items-center">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Today&apos;s focus
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              Close the highest-impact gap next
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {focusDescription}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" className="justify-start">
              <a href={actions.startInterviewHref}>
                <MicIcon aria-hidden="true" />
                Start interview
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="justify-start">
              <a href={actions.reviewQueueHref}>
                <SparklesIcon aria-hidden="true" />
                Open review queue
              </a>
            </Button>
          </div>
        </div>
        <div className="space-y-3 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Readiness
              </p>
              <p className="font-heading text-4xl font-semibold tracking-tight">{readinessScore}</p>
            </div>
            {state.readiness ? (
              <p className="pb-1 text-right text-xs text-muted-foreground">
                {formatPercentScore(state.readiness.confidenceLevel)} confidence
              </p>
            ) : null}
          </div>
          <Progress value={Math.min(readinessScore, 100)} className="h-2" />
          <p className="text-xs leading-5 text-muted-foreground">
            {state.progress.dueReviews} due reviews and {state.progress.reviewStreak} days in the
            current review streak.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function WeakConceptList({
  concepts,
}: {
  concepts: ReadyDashboardState['progress']['weakConceptTrends']
}) {
  if (concepts.length === 0) {
    return (
      <div className="px-3.5 py-5 text-sm leading-6 text-muted-foreground">
        No weak concepts are currently tracked. Keep practicing to generate sharper signals.
      </div>
    )
  }

  return concepts.map((concept) => (
    <div
      key={concept.concept}
      className="flex flex-col gap-3 px-3.5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 space-y-1">
        <p className="font-medium">{concept.concept}</p>
        <p className="text-sm text-muted-foreground">{getMissCountLabel(concept.occurrenceCount)}</p>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
        <Badge variant="outline" className={getWeakConceptStatusClassName(concept.status)}>
          {formatWeakConceptStatus(concept.status)}
        </Badge>
        <p className="text-xs text-muted-foreground">{getWeakConceptTrendLabel(concept.status)}</p>
      </div>
    </div>
  ))
}

function ActionGroupCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card className="py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 py-4">{children}</CardContent>
    </Card>
  )
}

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
          <CardTitle className="text-xl font-semibold">Readiness snapshot</CardTitle>
          <CardDescription>
            A current roll-up of the areas feeding your overall interview readiness.
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
      <CardContent className="grid gap-5 py-4 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Overall
          </p>
          <p className="font-heading text-4xl font-semibold tracking-tight">
            {state.readiness.overallScore}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Confidence: {formatPercentScore(state.readiness.confidenceLevel)}
          </p>
        </div>
        <div className="space-y-3 md:col-span-2">
          {state.readiness.breakdown.map((item) => (
            <div key={item.dimension} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.score}</span>
              </div>
              <Progress value={Math.min(item.score, 100)} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ReadyBody({
  state,
  actions,
}: {
  state: ReadyDashboardState
  actions: DashboardPageActions
}) {
  const metrics = getDashboardMetrics(state)

  return (
    <div className="flex flex-col gap-6">
      <DashboardHero state={state} actions={actions} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <Card className="py-0 xl:col-span-2">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">Weak concepts to revisit</CardTitle>
              <CardDescription>
                Focus the topics that are still dragging recent interview performance.
              </CardDescription>
            </div>
            <CardAction>
              <Button asChild variant="link" size="sm" className="h-auto px-0">
                <a href={actions.reviewQueueHref}>
                  Open review queue
                  <ArrowRightIcon aria-hidden="true" />
                </a>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y p-0">
            <WeakConceptList concepts={state.progress.weakConceptTrends} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ActionGroupCard title="Quick actions" description="High-frequency workflows.">
            <ActionLinkButton
              href={actions.createNoteHref}
              label="Create note"
              icon={<NotebookTextIcon aria-hidden="true" />}
              variant="default"
            />
            <ActionLinkButton
              href={actions.startInterviewHref}
              label="Start interview"
              icon={<MicIcon aria-hidden="true" />}
            />
            <ActionLinkButton
              href={actions.quickStartHref}
              label="Quick start"
              icon={<MicIcon aria-hidden="true" />}
            />
            <ActionLinkButton
              href={actions.reviewQueueHref}
              label="Review queue"
              icon={<SparklesIcon aria-hidden="true" />}
            />
          </ActionGroupCard>

          <ActionGroupCard title="Navigation" description="Browse the source material.">
            <ActionLinkButton
              href={actions.allNotesHref}
              label="All notes"
              icon={<NotebookTextIcon aria-hidden="true" />}
            />
            <ActionLinkButton
              href={actions.allSessionsHref}
              label="All sessions"
              icon={<MicIcon aria-hidden="true" />}
            />
            <ActionLinkButton
              href={actions.englishNotesHref}
              label="English notes"
              icon={<LanguagesIcon aria-hidden="true" />}
            />
            <ActionLinkButton
              href={actions.readinessHref}
              label="Readiness"
              icon={<SparklesIcon aria-hidden="true" />}
            />
          </ActionGroupCard>
        </div>
      </div>

      <ReadinessSnapshot state={state} actions={actions} />
    </div>
  )
}

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

const DashboardPage = Object.assign(Root, {
  MetricCard,
})

export default DashboardPage
