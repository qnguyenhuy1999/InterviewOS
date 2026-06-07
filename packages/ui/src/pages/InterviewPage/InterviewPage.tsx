import { FilterIcon, MicIcon, PlayIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { EmptyState, PageBody, PageHeader, StatCard } from '../../../components/ui/page'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { INTERVIEW_PAGE_ALL_TOPICS_VALUE, INTERVIEW_PAGE_TYPE_LABELS } from './InterviewPage.constants'
import { interviewPageFixture } from './InterviewPage.fixtures'
import type { InterviewPageProps, InterviewPageSession } from './InterviewPage.types'
import {
  filterInterviewSessions,
  formatInterviewDateLabel,
  formatInterviewDurationLabel,
  formatInterviewScore,
  getInterviewTopicLabel,
  getInterviewTopicOptions,
} from './InterviewPage.utils'

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

function SessionRow({ session }: { session: InterviewPageSession }) {
  const topicLabel = getInterviewTopicLabel(session)
  const typeLabel = INTERVIEW_PAGE_TYPE_LABELS[session.type]
  const dateLabel = formatInterviewDateLabel(session.startedAt)
  const durationLabel = formatInterviewDurationLabel(session.metrics.durationMinutes)

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
        {formatInterviewScore(session.metrics.overallScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(session.metrics.technicalScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(session.metrics.englishScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-sm text-muted-foreground md:table-cell">
        {durationLabel}
      </TableCell>
      <TableCell className="px-5 py-5 text-right">
        <Button variant="link" size="sm" className="h-auto px-0 font-medium text-foreground">
          Review
        </Button>
      </TableCell>
    </TableRow>
  )
}

function SessionsTable({ sessions }: { sessions: InterviewPageSession[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 px-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Topic
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground md:table-cell">
              Date
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground md:table-cell">
              Score
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground lg:table-cell">
              Tech
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground lg:table-cell">
              English
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground md:table-cell">
              Duration
            </TableHead>
            <TableHead className="h-12 px-5 text-right text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
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
          sessions.reduce((total, session) => total + (session.metrics.overallScore ?? 0), 0) /
            totalSessions,
        )
  const bestSession = sessions.reduce<InterviewPageSession | null>(
    (best, session) =>
      best === null ||
      (session.metrics.overallScore ?? 0) > (best.metrics.overallScore ?? 0)
        ? session
        : best,
    null,
  )
  const totalMinutes = sessions.reduce((total, session) => total + session.metrics.durationMinutes, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Sessions run" value={totalSessions} hint="Completed practice rounds in this history." icon={MicIcon} />
      <StatCard label="Average score" value={averageScore} hint="Overall score across the visible sessions." icon={PlayIcon} />
      <StatCard
        label="Best round"
        value={bestSession ? bestSession.metrics.overallScore : 'N/A'}
        hint={bestSession ? getInterviewTopicLabel(bestSession) : 'No scored sessions yet.'}
        icon={FilterIcon}
      />
      <StatCard label="Practice time" value={`${totalMinutes} min`} hint="Total time spent in interview mode." icon={MicIcon} />
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
          <Spinner className="size-7" />
        </div>
      </div>
    </div>
  )
}

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title="No interview sessions yet"
      description="Start a focused practice round to generate session feedback and score history."
      action={<Button>Start first interview</Button>}
    />
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load interview sessions</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function ReadyBody({
  sessions,
  selectedTopic,
  onTopicChange,
}: {
  sessions: InterviewPageSession[]
  selectedTopic: string
  onTopicChange?: (topic: string) => void
}) {
  const visibleSessions = filterInterviewSessions(sessions, selectedTopic)

  return (
    <div className="space-y-6">
      <InterviewHighlights sessions={visibleSessions.length > 0 ? visibleSessions : sessions} />
      <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.28)]">
        <TopicFilter
          sessions={sessions}
          selectedTopic={selectedTopic}
          onTopicChange={onTopicChange}
        />
      </div>
      {visibleSessions.length === 0 ? <EmptyBody /> : <SessionsTable sessions={visibleSessions} />}
    </div>
  )
}

function Root({
  loading,
  empty,
  error,
  sessions = interviewPageFixture.sessions,
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
            <Button variant="outline" size="lg">
              <MicIcon />
              New interview
            </Button>
            <Button size="lg">
              <PlayIcon />
              Quick start
            </Button>
          </>
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
          <ReadyBody
            sessions={sessions}
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
