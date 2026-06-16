import { EnglishNoteStatus } from '@interviewos/types'
import { BookTextIcon, CheckCircle2Icon, LanguagesIcon, UploadIcon } from 'lucide-react'
import type React from 'react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  EmptyState,
  PageBody,
  PageHeader,
  SectionCard,
  StatCard,
} from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Skeleton } from '../../../components/ui/skeleton'
import { ENGLISH_NOTES_STATUS_LABEL } from './EnglishNotesPage.constants'
import type { EnglishNotesPageProps } from './EnglishNotesPage.types'
import {
  getEnglishMasteryPercentage,
  getEnglishRelativeDateLabel,
  getEnglishStatusClassName,
  getEnglishTopicGroups,
} from './EnglishNotesPage.utils'

// ─── EnglishNoteRow ───────────────────────────────────────────────────────────

function EnglishNoteRow({
  originalSentence,
  correctedSentence,
  naturalVersion,
  explanation,
  status,
  createdAt,
  renderActions,
}: Extract<EnglishNotesPageProps['state'], { kind: 'ready' }>['notes'][number] & {
  renderActions?: React.ReactNode
}) {
  return (
    <article className="group rounded-lg border border-border/70 bg-card transition-shadow duration-150 hover:shadow-elevated">
      <div className="space-y-4 p-4">
        {/* Sentence trio */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Original
            </p>
            <p className="text-sm font-medium leading-6 text-foreground">{originalSentence}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Corrected
            </p>
            <p className="text-sm leading-6 text-foreground">{correctedSentence}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Natural version
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{naturalVersion}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Explanation + meta row */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">{explanation}</p>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs text-muted-foreground/70">
              {getEnglishRelativeDateLabel(createdAt)}
            </span>
            {renderActions ?? (
              <Badge variant="outline" className={getEnglishStatusClassName(status)}>
                {ENGLISH_NOTES_STATUS_LABEL[status]}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── TopicCoverageCard ────────────────────────────────────────────────────────

function TopicCoverageCard({ topic }: { topic: ReturnType<typeof getEnglishTopicGroups>[number] }) {
  // Map mastery % to a semantic colour token
  const progressColour =
    topic.masteryPercentage >= 75
      ? 'text-success'
      : topic.masteryPercentage >= 40
        ? 'text-warning'
        : 'text-destructive'

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4 transition-shadow duration-150 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-semibold text-foreground">{topic.name}</p>
          <p className="text-xs text-muted-foreground">
            {topic.total} notes · {topic.mastered} mastered · {topic.needsPractice} urgent
          </p>
        </div>
        <span className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${progressColour}`}>
          {topic.masteryPercentage}%
        </span>
      </div>
      <Progress value={topic.masteryPercentage} className="mt-3 h-1.5" />
    </div>
  )
}

// ─── TopicSection ─────────────────────────────────────────────────────────────

function TopicSection({
  topic,
  renderNoteActions,
}: {
  topic: ReturnType<typeof getEnglishTopicGroups>[number]
  renderNoteActions?: EnglishNotesPageProps['renderNoteActions']
}) {
  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{topic.name}</p>
          <p className="text-xs text-muted-foreground">{topic.total} corrections</p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 font-mono tabular-nums">
          {topic.masteryPercentage}% mastery
        </Badge>
      </div>

      {/* Notes */}
      <div className="space-y-3">
        {topic.notes.map((note) => (
          <EnglishNoteRow
            key={note.id}
            {...note}
            renderActions={renderNoteActions ? renderNoteActions(note) : undefined}
          />
        ))}
      </div>
    </section>
  )
}

// ─── EnglishNotesBody ─────────────────────────────────────────────────────────

function EnglishNotesBody({
  notes,
  renderNoteActions,
}: {
  notes: Extract<EnglishNotesPageProps['state'], { kind: 'ready' }>['notes']
  renderNoteActions?: EnglishNotesPageProps['renderNoteActions']
}) {
  const topicGroups = getEnglishTopicGroups(notes)
  const masteryPercentage = getEnglishMasteryPercentage(notes)
  const masteredCount = notes.filter((n) => n.status === EnglishNoteStatus.MASTERED).length

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total notes" value={notes.length} icon={BookTextIcon} />
        <StatCard label="Grammar topics" value={topicGroups.length} icon={LanguagesIcon} />
        <StatCard label="Mastered" value={masteredCount} icon={CheckCircle2Icon} />
        <StatCard
          label="Mastery rate"
          value={`${masteryPercentage}%`}
          hint="Across all captured corrections"
        />
      </div>

      {/* Topic coverage */}
      <SectionCard
        title="Topic coverage"
        description="Grouped by grammar topic so repeated patterns stand out quickly."
      >
        <div className="grid gap-3 xl:grid-cols-2">
          {topicGroups.map((topic) => (
            <TopicCoverageCard key={topic.name} topic={topic} />
          ))}
        </div>
      </SectionCard>

      {/* Corrections */}
      <SectionCard
        title="Corrections"
        description="Review the exact sentence, the corrected version, and the more natural phrasing."
        action={
          <Button variant="outline" size="sm">
            <UploadIcon aria-hidden="true" />
            Export notes
          </Button>
        }
      >
        <div className="space-y-8">
          {topicGroups.map((topic) => (
            <TopicSection key={topic.name} topic={topic} renderNoteActions={renderNoteActions} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── LoadingBody ──────────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// ─── ErrorBody ────────────────────────────────────────────────────────────────

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load English notes</span>}
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

function EmptyBody({ startPracticeHref }: { startPracticeHref: string }) {
  return (
    <EmptyState
      className="min-h-96"
      icon={LanguagesIcon}
      title="No English corrections yet"
      description="Complete an interview session to start collecting targeted English feedback."
      action={
        <Button asChild>
          <a href={startPracticeHref}>Start practice</a>
        </Button>
      }
    />
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({ state, actions, renderNoteActions }: EnglishNotesPageProps) {
  return (
    <>
      <PageHeader
        title="English notes"
        description="Track spoken-English corrections, study by topic, and close repeated communication gaps."
        actions={
          <Button asChild variant="outline" size="lg">
            <a href={actions.reviewLatestHref}>Review latest</a>
          </Button>
        }
      />

      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={actions.retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody startPracticeHref={actions.startPracticeHref} />
        ) : (
          <EnglishNotesBody notes={state.notes} renderNoteActions={renderNoteActions} />
        )}
      </PageBody>
    </>
  )
}

const EnglishNotesPage = Object.assign(Root, { EnglishNoteRow })
export default EnglishNotesPage
