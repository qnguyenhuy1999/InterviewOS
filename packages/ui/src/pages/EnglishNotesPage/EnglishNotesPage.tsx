import { EnglishNoteStatus } from '@interviewos/types'
import { BookTextIcon, CheckCircle2Icon, LanguagesIcon } from 'lucide-react'
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
import { englishNotesFixture } from './EnglishNotesPage.fixtures'
import type { EnglishNotesPageProps } from './EnglishNotesPage.types'
import {
  getEnglishMasteryPercentage,
  getEnglishRelativeDateLabel,
  getEnglishStatusClassName,
  getEnglishTopicGroups,
} from './EnglishNotesPage.utils'

function EnglishNoteRow({
  originalSentence,
  correctedSentence,
  naturalVersion,
  explanation,
  status,
  createdAt,
  renderActions,
}: NonNullable<EnglishNotesPageProps['notes']>[number] & {
  renderActions?: React.ReactNode
}) {
  return (
    <article className="rounded-md border border-border/80 bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Original
            </p>
            <p className="mt-1 text-sm font-medium">{originalSentence}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Corrected
            </p>
            <p className="mt-1 text-sm">{correctedSentence}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Natural version
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{naturalVersion}</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{explanation}</p>
        </div>
        {renderActions ?? (
          <Badge variant="outline" className={getEnglishStatusClassName(status)}>
            {ENGLISH_NOTES_STATUS_LABEL[status]}
          </Badge>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{getEnglishRelativeDateLabel(createdAt)}</p>
    </article>
  )
}

function EnglishNotesBody({
  notes,
  renderNoteActions,
}: {
  notes: NonNullable<EnglishNotesPageProps['notes']>
  renderNoteActions?: EnglishNotesPageProps['renderNoteActions']
}) {
  const topicGroups = getEnglishTopicGroups(notes)
  const masteryPercentage = getEnglishMasteryPercentage(notes)
  const masteredCount = notes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length

  return (
    <div className="space-y-6">
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

      <SectionCard
        title="Topic coverage"
        description="Grouped by grammar topic so repeated patterns stand out quickly."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {topicGroups.map((topic) => (
            <div key={topic.name} className="rounded-md border border-border/80 bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold">{topic.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.total} notes, {topic.mastered} mastered, {topic.needsPractice} urgent
                  </p>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {topic.masteryPercentage}%
                </span>
              </div>
              <Progress value={topic.masteryPercentage} className="mt-3 h-2" />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Corrections"
        description="Review the exact sentence, the corrected version, and the more natural phrasing."
        action={
          <Button variant="outline" size="sm">
            Export notes
          </Button>
        }
      >
        <div className="space-y-4">
          {topicGroups.map((topic) => (
            <section key={topic.name} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.total} corrections</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {topic.masteryPercentage}% mastery
                </Badge>
              </div>
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
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-md" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-md" />
        ))}
      </div>
    </div>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load English notes</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96"
      icon={LanguagesIcon}
      title="No English corrections yet"
      description="Complete an interview session to start collecting targeted English feedback."
      action={<Button>Start practice</Button>}
    />
  )
}

function Root({
  notes = englishNotesFixture.notes,
  loading,
  empty,
  error,
  renderNoteActions,
}: EnglishNotesPageProps) {
  return (
    <>
      <PageHeader
        title="English notes"
        description="Track spoken-English corrections, study by topic, and close repeated communication gaps."
        actions={
          <Button variant="outline" size="lg">
            Review latest
          </Button>
        }
      />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty || notes.length === 0 ? (
          <EmptyBody />
        ) : (
          <EnglishNotesBody notes={notes} renderNoteActions={renderNoteActions} />
        )}
      </PageBody>
    </>
  )
}

const EnglishNotesPage = Object.assign(Root, {
  EnglishNoteRow,
})

export default EnglishNotesPage
