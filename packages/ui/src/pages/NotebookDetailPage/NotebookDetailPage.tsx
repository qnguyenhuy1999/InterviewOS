import type {
  NoteGeneratedQuestion,
  TechnicalNoteDetailView,
  TechnicalNoteSummary,
} from '@interviewos/types'
import {
  BookOpenTextIcon,
  BrainCircuitIcon,
  FileQuestionIcon,
  LanguagesIcon,
  SparklesIcon,
} from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { EmptyState, PageHeader, SectionCard, StatCard } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { DifficultyBadge, StatusDot } from '../../../components/ui/status'
import { cn } from '../../../lib/utils'
import ConsoleLayout from '../../layouts/ConsoleLayout'
import {
  getDifficultyTone,
  getEnumLabel,
  getNotebookSummary,
  getRelativeUpdatedAtLabel,
  getStatusDot,
} from '../NotebookPage/NotebookPage.utils'
import { notebookDetailFixture } from './NotebookDetailPage.fixtures'
import type { NotebookDetailPageProps } from './NotebookDetailPage.types'
import {
  getNotebookDetailContentSections,
  getNotebookDetailInterviewTargets,
  getNotebookDetailNavigation,
  getNotebookDetailTopicLabel,
  getNotebookQuestionConceptSummary,
} from './NotebookDetailPage.utils'

function DefinitionList({
  items,
}: {
  items: Array<{ label: string; value: string }>
}) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function BulletList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function RelatedNoteRow({
  note,
}: {
  note: TechnicalNoteSummary
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-background px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{note.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {note.topic?.trim() || 'Uncategorized'} | {getEnumLabel(note.type)}
        </p>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        <div className="flex items-center justify-end gap-2">
          <StatusDot status={getStatusDot(note.status)} />
          <span>{getEnumLabel(note.status)}</span>
        </div>
        <p className="mt-1">{note.questionCount} questions</p>
      </div>
    </div>
  )
}

function QuestionCard({
  question,
}: {
  question: NoteGeneratedQuestion
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{question.question}</p>
          <p className="mt-2 text-sm text-muted-foreground">{question.expectedAnswer}</p>
        </div>
        <DifficultyBadge difficulty={getDifficultyTone(question.difficulty)} className="shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="rounded-full px-2.5 py-1">
          {question.category}
        </Badge>
        <Badge variant="outline" className="rounded-full px-2.5 py-1">
          {question.sourceSection}
        </Badge>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Concepts: {getNotebookQuestionConceptSummary(question)}
      </p>
    </div>
  )
}

function StructuredContent({
  data,
}: {
  data: TechnicalNoteDetailView
}) {
  const sections = getNotebookDetailContentSections(data.note.structuredContent)

  if (!data.note.structuredContent) {
    return (
      <SectionCard
        title="Structured content"
        description="Generate an AI summary to transform raw notes into interview-ready material."
      >
        <EmptyState
          className="min-h-64 border-dashed bg-background/70"
          icon={SparklesIcon}
          title="No structured content yet"
          description="This note is still a draft. Generate a structured summary to unlock the knowledge map and question set."
          action={<Button>Generate structure</Button>}
        />
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="Knowledge map"
      description="The generated structure used to review this topic quickly before practice."
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border/70 bg-background px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Purpose
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {data.note.structuredContent.purpose}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-background px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Mental model
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {data.note.structuredContent.mentalModel}
          </p>
        </div>

        {data.note.structuredContent.quickReference.length > 0 ? (
          <div className="rounded-xl border border-border/70 bg-background px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Quick reference
            </p>
            <BulletList items={data.note.structuredContent.quickReference} className="mt-3" />
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <div key={section.key} className="rounded-xl border border-border/70 bg-background px-4 py-4">
              <p className="text-sm font-semibold text-foreground">{section.title}</p>
              <BulletList items={section.items} className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

function NotebookDetailBody({
  data,
}: {
  data: TechnicalNoteDetailView
}) {
  const topicLabel = getNotebookDetailTopicLabel(data.note)
  const interviewTargets = getNotebookDetailInterviewTargets(data.note)

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.note.title}
        description={getNotebookSummary(data.note)}
        actions={
          <>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {topicLabel}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {getEnumLabel(data.note.type)}
            </Badge>
            <Button size="sm">
              <FileQuestionIcon />
              Generate questions
            </Button>
          </>
        }
        className="rounded-2xl border bg-card"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Status"
          value={
            <span className="inline-flex items-center gap-2">
              <StatusDot status={getStatusDot(data.note.status)} className="size-2" />
              {getEnumLabel(data.note.status)}
            </span>
          }
          hint="Current note lifecycle"
          icon={BookOpenTextIcon}
        />
        <StatCard
          label="Questions"
          value={data.questionCount}
          hint={`${data.generatedQuestions.length} generated right now`}
          icon={FileQuestionIcon}
        />
        <StatCard
          label="Stack focus"
          value={data.note.overrideStack.length}
          hint={data.note.overrideStack.join(', ') || 'No stack overrides'}
          icon={BrainCircuitIcon}
        />
        <StatCard
          label="Updated"
          value={getRelativeUpdatedAtLabel(data.note.updatedAt)}
          hint="Last note change"
          icon={LanguagesIcon}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <StructuredContent data={data} />

          <SectionCard
            title="Raw input"
            description="The original note capture before AI structuring."
          >
            <p className="text-sm leading-6 text-foreground">{data.note.rawInput}</p>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Interview targeting"
            description="The audience and constraints used when shaping this note."
          >
            <div className="space-y-4">
              <DefinitionList items={interviewTargets} />

              {data.note.overrideGoals.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Goals
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.note.overrideGoals.map((goal) => (
                      <Badge key={goal} variant="secondary" className="rounded-full px-2.5 py-1">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {data.note.overrideStack.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Stack
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.note.overrideStack.map((item) => (
                      <Badge key={item} variant="outline" className="rounded-full px-2.5 py-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Generated questions"
            description="Practice prompts derived from the structured note."
            action={
              <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                {data.generatedQuestions.length}
              </Badge>
            }
          >
            {data.generatedQuestions.length > 0 ? (
              <div className="space-y-3">
                {data.generatedQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <EmptyState
                className="min-h-48 border-dashed bg-background/70"
                icon={FileQuestionIcon}
                title="No generated questions yet"
                description="Generate a question set when the note is ready for practice."
              />
            )}
          </SectionCard>

          <SectionCard
            title="Related notes"
            description="Nearby topics to review before or after this note."
          >
            {data.relatedNotes.length > 0 ? (
              <div className="space-y-3">
                {data.relatedNotes.map((note) => (
                  <RelatedNoteRow key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <EmptyState
                className="min-h-48 border-dashed bg-background/70"
                title="No related notes yet"
                description="As your notebook grows, linked topics can show up here."
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card px-4 py-5 md:px-8 md:py-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <Skeleton className="min-h-120 rounded-xl" />
        <Skeleton className="min-h-120 rounded-xl" />
      </div>
    </div>
  )
}

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96"
      icon={BookOpenTextIcon}
      title="No note selected"
      description="Choose a notebook entry to review the generated structure, questions, and interview targeting."
      action={<Button>Back to notebook</Button>}
    />
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load notebook detail</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root({
  data = notebookDetailFixture,
  loading,
  empty,
  error,
}: NotebookDetailPageProps) {
  return (
    <ConsoleLayout
      title="Notebook"
      navigation={getNotebookDetailNavigation()}
      headerActions={
        <Badge variant="secondary" className="hidden rounded-full px-3 py-1 text-xs md:inline-flex">
          {data.questionCount} questions ready
        </Badge>
      }
    >
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : empty ? (
        <EmptyBody />
      ) : (
        <NotebookDetailBody data={data} />
      )}
      <Separator className="mt-8 opacity-0" />
    </ConsoleLayout>
  )
}

const NotebookDetailPage = Object.assign(Root, {
  QuestionCard,
  RelatedNoteRow,
  StructuredContent,
})

export default NotebookDetailPage
