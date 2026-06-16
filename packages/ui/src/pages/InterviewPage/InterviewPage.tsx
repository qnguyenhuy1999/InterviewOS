'use client'

import { FilterIcon, MicIcon, PlayIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { EmptyState, PageBody, PageHeader, StatCard } from '../../../components/ui/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { Spinner } from '../../atoms/Spinner'
import {
  INTERVIEW_PAGE_ALL_TOPICS_VALUE,
  INTERVIEW_PAGE_TYPE_LABELS,
} from './InterviewPage.constants'
import type {
  InterviewPageActions,
  InterviewPageProps,
  InterviewPageSession,
} from './InterviewPage.types'
import {
  filterInterviewSessions,
  formatInterviewDateLabel,
  formatInterviewDurationLabel,
  formatInterviewScore,
  getInterviewTopicLabel,
  getInterviewTopicOptions,
} from './InterviewPage.utils'

function getSessionMetrics(session: InterviewPageSession) {
  return (
    session.metrics ?? {
      overallScore: null,
      technicalScore: null,
      englishScore: null,
      durationMinutes: 0,
    }
  )
}

function TopicFilter({
  sessions,
  selectedTopic,
  onTopicChange,
}: {
  sessions: InterviewPageSession[]
  selectedTopic: string
  onTopicChange?: (topic: string) => void
}) {
  const topicOptions = getInterviewTopicOptions(sessions)

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        <FilterIcon className="size-4" />
      </div>
      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="h-11 min-w-56 rounded-xl bg-card px-4 text-left">
          <SelectValue placeholder="All topics" />
        </SelectTrigger>
        <SelectContent>
          {topicOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function SessionRow({
  session,
  reviewHref,
}: {
  session: InterviewPageSession
  reviewHref: string
}) {
  const topicLabel = getInterviewTopicLabel(session)
  const typeLabel = INTERVIEW_PAGE_TYPE_LABELS[session.type]
  const dateLabel = formatInterviewDateLabel(session.startedAt)
  const metrics = getSessionMetrics(session)
  const durationLabel = formatInterviewDurationLabel(metrics.durationMinutes)

  return (
    <TableRow>
      <TableCell className="px-5 py-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground md:text-base">{topicLabel}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:hidden">
            <span>{dateLabel}</span>
            <span>{typeLabel}</span>
            <span>{durationLabel}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-sm text-muted-foreground md:table-cell">
        {dateLabel}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm font-semibold md:table-cell">
        {formatInterviewScore(metrics.overallScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(metrics.technicalScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(metrics.englishScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-sm text-muted-foreground md:table-cell">
        {durationLabel}
      </TableCell>
      <TableCell className="px-5 py-5 text-right">
        <Button
          asChild
          variant="link"
          size="sm"
          className="h-auto px-0 font-medium text-foreground"
        >
          <a href={reviewHref}>Review</a>
        </Button>
      </TableCell>
    </TableRow>
  )
}

function SessionsTable({
  sessions,
  actions,
}: {
  sessions: InterviewPageSession[]
  actions: InterviewPageActions
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Topic
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Date
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Score
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground lg:table-cell">
              Tech
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground lg:table-cell">
              English
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Duration
            </TableHead>
            <TableHead className="h-12 px-5 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              reviewHref={`${actions.reviewHref}/${session.id}/review`}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function InterviewHighlights({ sessions }: { sessions: InterviewPageSession[] }) {
  const totalSessions = sessions.length
  const averageScore =
    totalSessions === 0
      ? 0
      : Math.round(
          sessions.reduce(
            (total, session) => total + (getSessionMetrics(session).overallScore ?? 0),
            0,
          ) / totalSessions,
        )
  const bestSession = sessions.reduce<InterviewPageSession | null>(
    (best, session) =>
      best === null ||
      (getSessionMetrics(session).overallScore ?? 0) > (getSessionMetrics(best).overallScore ?? 0)
        ? session
        : best,
    null,
  )
  const totalMinutes = sessions.reduce(
    (total, session) => total + getSessionMetrics(session).durationMinutes,
    0,
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Sessions run"
        value={totalSessions}
        hint="Completed practice rounds in this history."
        icon={MicIcon}
      />
      <StatCard
        label="Average score"
        value={averageScore}
        hint="Overall score across the visible sessions."
        icon={PlayIcon}
      />
      <StatCard
        label="Best round"
        value={bestSession ? getSessionMetrics(bestSession).overallScore : 'N/A'}
        hint={bestSession ? getInterviewTopicLabel(bestSession) : 'No scored sessions yet.'}
        icon={FilterIcon}
      />
      <StatCard
        label="Practice time"
        value={`${totalMinutes} min`}
        hint="Total time spent in interview mode."
        icon={MicIcon}
      />
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-11 w-56 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
        <div className="border-b px-5 py-4">
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex min-h-72 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    </div>
  )
}

function EmptyBody({ actions }: { actions: InterviewPageActions }) {
  return (
    <EmptyState
      className="min-h-80"
      title="No interview sessions yet"
      description="Start a focused practice round to generate session feedback and score history."
      action={
        <Button asChild>
          <a href={actions.startInterviewHref}>Start first interview</a>
        </Button>
      }
    />
  )
}

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load interview sessions</span>}
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

function ReadyBody({
  state,
  actions,
  selectedTopic,
  onTopicChange,
}: {
  state: Extract<InterviewPageProps['state'], { kind: 'ready' }>
  actions: InterviewPageActions
  selectedTopic: string
  onTopicChange?: (topic: string) => void
}) {
  const { sessions } = state
  const visibleSessions = filterInterviewSessions(sessions, selectedTopic)

  return (
    <div className="space-y-6">
      <InterviewHighlights sessions={visibleSessions.length > 0 ? visibleSessions : sessions} />
      {onTopicChange ? (
        <div className="rounded-md border border-border/80 bg-card p-4 shadow-sm">
          <TopicFilter
            sessions={sessions}
            selectedTopic={selectedTopic}
            onTopicChange={onTopicChange}
          />
        </div>
      ) : null}
      {visibleSessions.length === 0 ? (
        <EmptyState
          className="min-h-72"
          title="No sessions match this topic"
          description="Clear the filter or start a new interview to build more history."
          action={
            <Button asChild>
              <a href={actions.startInterviewHref}>Start interview</a>
            </Button>
          }
        />
      ) : (
        <SessionsTable sessions={visibleSessions} actions={actions} />
      )}
    </div>
  )
}

function Root({
  state,
  actions,
  selectedTopic = INTERVIEW_PAGE_ALL_TOPICS_VALUE,
  onTopicChange,
}: InterviewPageProps) {
  return (
    <>
      <PageHeader
        title="Interview sessions"
        description="Run a focused practice round and review your feedback afterwards."
        actions={
          <>
            <Button asChild variant="outline" size="lg">
              <a href={actions.startInterviewHref}>
                <MicIcon />
                New interview
              </a>
            </Button>
            <Button asChild size="lg">
              <a href={actions.quickStartHref}>
                <PlayIcon />
                Quick start
              </a>
            </Button>
          </>
        }
      />
      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={actions.retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody actions={actions} />
        ) : (
          <ReadyBody
            state={state}
            actions={actions}
            selectedTopic={selectedTopic}
            onTopicChange={onTopicChange}
          />
        )}
      </PageBody>
    </>
  )
}

const InterviewPage = Object.assign(Root, {
  SessionRow,
  SessionsTable,
  TopicFilter,
})

export default InterviewPage
