import { LanguagesIcon, MicIcon, NotebookTextIcon, SparklesIcon } from 'lucide-react'

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
    <Button asChild variant={variant} size="lg" className="justify-center">
      <a href={href}>
        {icon}
        {label}
      </a>
    </Button>
  )
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card className="gap-2 py-4" size="sm">
      <CardHeader className="gap-1">
        <CardDescription className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {metric.label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  )
}

function LoadingBody() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-md" />
        ))}
      </div>
      <Card className="min-h-64 items-center justify-center">
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
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
          <CardTitle className="text-xl font-semibold">Quick actions</CardTitle>
          <CardDescription>Start the learning loop with a real workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 py-4 md:grid-cols-2 xl:grid-cols-4">
          <ActionLinkButton
            href={actions.createNoteHref}
            label="Create note"
            icon={<NotebookTextIcon />}
            variant="default"
          />
          <ActionLinkButton
            href={actions.startInterviewHref}
            label="Start interview"
            icon={<MicIcon />}
          />
          <ActionLinkButton
            href={actions.reviewQueueHref}
            label="Review queue"
            icon={<SparklesIcon />}
          />
          <ActionLinkButton
            href={actions.englishNotesHref}
            label="English notes"
            icon={<LanguagesIcon />}
          />
        </CardContent>
      </Card>

      <EmptyState
        className="min-h-80"
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

const TREND_LABEL: Record<'UP' | 'DOWN' | 'STABLE', string> = {
  UP: 'Improving',
  DOWN: 'Dropping',
  STABLE: 'Stable',
}

function getDashboardMetrics(state: Extract<DashboardPageState, { kind: 'ready' }>): DashboardMetric[] {
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

function ReadyBody({
  state,
  actions,
}: {
  state: Extract<DashboardPageState, { kind: 'ready' }>
  actions: DashboardPageActions
}) {
  const metrics = getDashboardMetrics(state)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">Weak concepts to revisit</CardTitle>
              <CardDescription>
                Focus the topics that are still dragging recent interview performance.
              </CardDescription>
            </div>
            <CardAction>
              <Button asChild variant="link" size="sm" className="h-auto px-0">
                <a href={actions.reviewQueueHref}>Open review queue</a>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y">
            {state.progress.weakConceptTrends.length > 0 ? (
              state.progress.weakConceptTrends.map((concept) => (
                <div key={concept.concept} className="flex items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-base font-medium">{concept.concept}</p>
                    <p className="text-sm text-muted-foreground">
                      {concept.occurrenceCount} recent misses
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{concept.status.replaceAll('_', ' ')}</p>
                    <p className="text-muted-foreground">
                      {TREND_LABEL[concept.status === 'ACTIVE' ? 'DOWN' : concept.status === 'RESOLVED' ? 'UP' : 'STABLE']}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-sm text-muted-foreground">
                No weak concepts are currently tracked. Keep practicing to generate sharper signals.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="py-0">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-xl font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 py-4">
              <ActionLinkButton
                href={actions.createNoteHref}
                label="Create note"
                icon={<NotebookTextIcon />}
                variant="default"
              />
              <ActionLinkButton
                href={actions.startInterviewHref}
                label="Start interview"
                icon={<MicIcon />}
              />
              <ActionLinkButton
                href={actions.quickStartHref}
                label="Quick start"
                icon={<MicIcon />}
              />
              <ActionLinkButton
                href={actions.reviewQueueHref}
                label="Review queue"
                icon={<SparklesIcon />}
              />
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-xl font-semibold">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 py-4">
              <ActionLinkButton href={actions.allNotesHref} label="All notes" icon={<NotebookTextIcon />} />
              <ActionLinkButton href={actions.allSessionsHref} label="All sessions" icon={<MicIcon />} />
              <ActionLinkButton href={actions.englishNotesHref} label="English notes" icon={<LanguagesIcon />} />
              <ActionLinkButton href={actions.readinessHref} label="Readiness" icon={<SparklesIcon />} />
            </CardContent>
          </Card>
        </div>
      </div>

      {state.readiness ? (
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
                <a href={actions.readinessHref}>Open readiness</a>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3 py-4">
            {state.readiness.breakdown.map((item) => (
              <div key={item.dimension} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.score}</span>
                </div>
                <Progress value={Math.min(item.score, 100)} className="h-2" />
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Confidence: {Math.round(state.readiness.confidenceLevel * 100)}%
            </p>
          </CardContent>
        </Card>
      ) : null}
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
