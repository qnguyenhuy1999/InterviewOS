'use client'

import type { TechnicalNoteDetailView, TechnicalNoteSummary } from '@interviewos/types'
import {
  ArrowLeftIcon,
  BookOpenTextIcon,
  FileQuestionIcon,
  MenuIcon,
  SparklesIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Button } from '../../../components/ui/button'
import { EmptyState, PageBody } from '../../../components/ui/page'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet'
import { Skeleton } from '../../../components/ui/skeleton'
import { StatusDot } from '../../../components/ui/status'
import { BulletList } from '../../molecules/BulletList/BulletList'
import { DefinitionList } from '../../molecules/DefinitionList/DefinitionList'
import { NoteInterviewAnswer } from '../../molecules/NoteInterviewAnswer/NoteInterviewAnswer'
import { NoteSummaryCard } from '../../molecules/NoteSummaryCard/NoteSummaryCard'
import { NoteToc } from '../../molecules/NoteToc/NoteToc'
import { QuestionCard } from '../../molecules/QuestionCard/QuestionCard'
import { TagList } from '../../molecules/TagList/TagList'
import { NoteHeader, NoteHeaderBadge } from '../../organisms/NoteHeader/NoteHeader'
import { NoteMetaRail } from '../../organisms/NoteMetaRail/NoteMetaRail'
import { NoteSection } from '../../organisms/NoteSection/NoteSection'
import {
  getDifficultyTone,
  getEnumLabel,
  getRelativeUpdatedAtLabel,
  getStatusDot,
} from '../NotebookPage/NotebookPage.utils'
import { notebookDetailFixture } from './NotebookDetailPage.fixtures'
import type { NotebookDetailPageProps } from './NotebookDetailPage.types'
import {
  getNotebookDetailArticleSections,
  getNotebookDetailEstimatedReadingTimeLabel,
  getNotebookDetailInterviewAnswer,
  getNotebookDetailInterviewTargets,
  getNotebookDetailTopicLabel,
  getNotebookQuestionConceptSummary,
} from './NotebookDetailPage.utils'

function RelatedNoteRow({ note }: { note: TechnicalNoteSummary }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-surface-elevated px-4 py-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="min-w-0">
        <p className="text-pretty text-sm leading-6 font-medium text-foreground">{note.title}</p>
        <p className="mt-1 break-words text-sm text-muted-foreground">
          {note.topic?.trim() || 'Uncategorized'} · {getEnumLabel(note.type)}
        </p>
      </div>
      <div className="text-xs text-right shrink-0 text-muted-foreground">
        <div className="flex items-center justify-end gap-2">
          <StatusDot status={getStatusDot(note.status)} />
          <span>{getEnumLabel(note.status)}</span>
        </div>
        <p className="mt-1">{note.questionCount} questions</p>
      </div>
    </div>
  )
}

function ConceptGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-xl border border-border/70 bg-muted px-4 py-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Concept {index + 1}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{item}</p>
        </div>
      ))}
    </div>
  )
}

function MentalModelCard({ content }: { content: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-accent-soft px-5 py-5 shadow-elevated md:px-6">
      <p className="text-base leading-8 text-foreground">{content}</p>
    </div>
  )
}

function StudyContext({ data }: { data: TechnicalNoteDetailView }) {
  const interviewTargets = getNotebookDetailInterviewTargets(data.note)

  return (
    <div className="flex flex-col gap-7 md:gap-9">
      <NoteSection
        id="study-context"
        title="Interview targeting"
        description="The audience and constraints that shaped this note."
        tone="muted"
        className="order-2"
      >
        <div className="space-y-5">
          <DefinitionList items={interviewTargets} />

          {data.note.overrideGoals.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Goals
              </p>
              <TagList
                items={data.note.overrideGoals}
                className="mt-3"
                badgeClassName="rounded-full px-2.5 py-1"
              />
            </div>
          ) : null}

          {data.note.overrideStack.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Stack
              </p>
              <TagList
                items={data.note.overrideStack}
                className="mt-3"
                variant="outline"
                badgeClassName="rounded-full px-2.5 py-1"
              />
            </div>
          ) : null}
        </div>
      </NoteSection>

      <NoteSection
        id="source-note"
        title="Source note"
        description="The original raw capture before it was shaped into a study article."
        tone="muted"
        className="order-1"
      >
        <article className="prose prose-neutral max-w-none break-words prose-p:text-pretty prose-p:leading-7 prose-headings:text-balance dark:prose-invert">
          <ReactMarkdown>{data.note.rawInput}</ReactMarkdown>
        </article>
      </NoteSection>
    </div>
  )
}

function PracticeQuestions({
  data,
  renderQuestionActions,
}: {
  data: TechnicalNoteDetailView
  renderQuestionActions?: NotebookDetailPageProps['renderQuestionActions']
}) {
  return (
    <NoteSection
      id="practice-questions"
      title="Practice questions"
      description="Drill the note once the mental model is clear."
      tone="muted"
    >
      {data.generatedQuestions.length > 0 ? (
        <div className="space-y-3">
          {data.generatedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              title={question.question}
              description={question.expectedAnswer}
              difficulty={getDifficultyTone(question.difficulty)}
              badges={[question.category, question.sourceSection]}
              footer={`Concepts: ${getNotebookQuestionConceptSummary(question)}`}
              action={renderQuestionActions ? renderQuestionActions(question.id) : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="border-dashed min-h-48 bg-background"
          icon={FileQuestionIcon}
          title="No generated questions yet"
          description="Generate a question set when the note is ready for rehearsal."
        />
      )}
    </NoteSection>
  )
}

function RelatedNotes({ data }: { data: TechnicalNoteDetailView }) {
  return (
    <NoteSection
      id="related-notes"
      title="Related notes"
      description="Nearby topics worth reviewing before or after this one."
      tone="muted"
    >
      {data.relatedNotes.length > 0 ? (
        <div className="space-y-3">
          {data.relatedNotes.map((note) => (
            <RelatedNoteRow key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="border-dashed min-h-48 bg-background"
          title="No related notes yet"
          description="As your notebook grows, supporting topics will show up here."
        />
      )}
    </NoteSection>
  )
}

function StructuredContentEmpty() {
  return (
    <NoteSection
      id="summary"
      title="Quick summary"
      description="Generate structure first to turn this raw note into a guided study article."
      tone="muted"
    >
      <EmptyState
        className="border-dashed min-h-72 bg-background"
        icon={SparklesIcon}
        title="No structured content yet"
        description="This note is still a draft. Generate the AI structure to unlock article sections, interview answer, and practice prompts."
        action={<Button>Generate structure</Button>}
      />
    </NoteSection>
  )
}

function NotebookDetailBody({
  data,
  backAction,
  renderHeaderActions,
  renderQuestionActions,
}: {
  data: TechnicalNoteDetailView
  backAction?: NotebookDetailPageProps['backAction']
  renderHeaderActions?: NotebookDetailPageProps['renderHeaderActions']
  renderQuestionActions?: NotebookDetailPageProps['renderQuestionActions']
}) {
  const articleRef = useRef<HTMLElement | null>(null)
  const topicLabel = getNotebookDetailTopicLabel(data.note)
  const readingTime = getNotebookDetailEstimatedReadingTimeLabel(data)
  const articleSections = getNotebookDetailArticleSections(data.note)
  const interviewAnswer = getNotebookDetailInterviewAnswer(data)
  const [activeSection, setActiveSection] = useState(articleSections[0]?.id ?? 'summary')
  const [progress, setProgress] = useState(0)

  const tocItems = useMemo(() => {
    const items = articleSections.map((section) => ({
      id: section.id,
      label: section.title,
    }))

    if (data.generatedQuestions.length > 0 || data.questionCount > 0) {
      items.push({ id: 'practice-questions', label: 'Practice questions' })
    }

    if (data.relatedNotes.length > 0) {
      items.push({ id: 'related-notes', label: 'Related notes' })
    }

    items.push({ id: 'study-context', label: 'Study context' })

    return items
  }, [
    articleSections,
    data.generatedQuestions.length,
    data.questionCount,
    data.relatedNotes.length,
  ])

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current || tocItems.length === 0) {
        return
      }

      const articleRect = articleRef.current.getBoundingClientRect()
      const scrollRange = Math.max(articleRef.current.offsetHeight - window.innerHeight * 0.55, 1)
      const nextProgress = ((window.innerHeight * 0.18 - articleRect.top) / scrollRange) * 100

      setProgress(Math.max(0, Math.min(100, nextProgress)))

      let currentId = tocItems[0]?.id

      for (const item of tocItems) {
        const sectionElement = document.getElementById(item.id)

        if (!sectionElement) {
          continue
        }

        if (sectionElement.getBoundingClientRect().top <= 160) {
          currentId = item.id
        } else {
          break
        }
      }

      if (currentId) {
        setActiveSection(currentId)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [tocItems])

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-7 md:space-y-9">
      <NoteHeader
        title={data.note.title}
        note={data.note}
        backAction={backAction}
        eyebrow={
          <>
            <span>Notebook detail</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>{getRelativeUpdatedAtLabel(data.note.updatedAt)}</span>
          </>
        }
        meta={
          <>
            <NoteHeaderBadge>{topicLabel}</NoteHeaderBadge>
            <NoteHeaderBadge>{getEnumLabel(data.note.type)}</NoteHeaderBadge>
            <NoteHeaderBadge>
              <span className="inline-flex items-center gap-2">
                <StatusDot status={getStatusDot(data.note.status)} className="size-2" />
                {getEnumLabel(data.note.status)}
              </span>
            </NoteHeaderBadge>
            <NoteHeaderBadge>{readingTime}</NoteHeaderBadge>
            <NoteHeaderBadge>{data.questionCount} questions</NoteHeaderBadge>
          </>
        }
        actions={
          renderHeaderActions ? (
            renderHeaderActions(data.note)
          ) : (
            <Button size="sm" className="px-4 rounded-full">
              <FileQuestionIcon />
              Generate questions
            </Button>
          )
        }
      />

      <div className="grid gap-7 xl:grid-cols-4 xl:items-start">
        <article ref={articleRef} className="min-w-0 space-y-7 md:space-y-8 xl:col-span-3">
          {data.note.structuredContent ? (
            <>
              <div className="sticky top-2 z-10 -mx-1 rounded-xl px-1 py-2 backdrop-blur-sm xl:hidden">
                <div className="rounded-xl border border-border/70 bg-background px-3 py-2 shadow-elevated">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {Math.round(progress)}% completed
                    </p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <MenuIcon />
                          On this page
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-xl">
                        <SheetHeader>
                          <SheetTitle>On this page</SheetTitle>
                          <SheetDescription>
                            Jump between sections while you study.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="px-4 pb-6">
                          <NoteToc
                            items={tocItems}
                            activeId={activeSection}
                            onNavigate={handleNavigate}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              <NoteSummaryCard
                summary={data.note.structuredContent.summary ?? data.note.structuredContent.purpose}
                quickReference={data.note.structuredContent.quickReference}
              />

              {articleSections.map((section) => {
                if (section.key === 'summary') {
                  return null
                }

                if (section.key === 'coreConcepts' && section.items) {
                  return (
                    <NoteSection
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      description={section.description}
                    >
                      <ConceptGrid items={section.items} />
                    </NoteSection>
                  )
                }

                if (section.key === 'mentalModel' && section.content) {
                  return (
                    <NoteSection
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      description={section.description}
                    >
                      <MentalModelCard content={section.content} />
                    </NoteSection>
                  )
                }

                if (section.key === 'interviewAnswer') {
                  return (
                    <div
                      key={section.id}
                      id={section.id}
                      data-note-section
                      className="scroll-mt-24"
                    >
                      <NoteInterviewAnswer answer={interviewAnswer} />
                    </div>
                  )
                }

                return (
                  <NoteSection
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    description={section.description}
                    collapsible={section.collapsible}
                    tone={
                      section.key === 'commonPitfalls'
                        ? 'warning'
                        : section.key === 'seniorInterviewSignals'
                          ? 'accent'
                          : 'default'
                    }
                  >
                    {section.content ? (
                      <p className="text-sm leading-7 text-foreground">{section.content}</p>
                    ) : (
                      <BulletList items={section.items ?? []} className="text-sm leading-7" />
                    )}
                  </NoteSection>
                )
              })}

              <PracticeQuestions data={data} renderQuestionActions={renderQuestionActions} />
              <RelatedNotes data={data} />
              <StudyContext data={data} />
            </>
          ) : (
            <>
              <StructuredContentEmpty />
              <StudyContext data={data} />
            </>
          )}
        </article>

        <NoteMetaRail
          progress={progress}
          activeSection={activeSection}
          tocItems={tocItems}
          onNavigate={handleNavigate}
          readingTime={readingTime}
          questionCount={data.questionCount}
          topicLabel={topicLabel}
          mobileTocAction={
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <MenuIcon />
                  Open TOC
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>On this page</SheetTitle>
                  <SheetDescription>Jump to any section in the article.</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <NoteToc items={tocItems} activeId={activeSection} onNavigate={handleNavigate} />
                </div>
              </SheetContent>
            </Sheet>
          }
        />
      </div>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-surface-elevated px-6 py-7">
        <Skeleton className="w-32 h-4 rounded-full" />
        <Skeleton className="w-full h-12 max-w-3xl mt-5 rounded-2xl" />
        <Skeleton className="w-full h-5 max-w-2xl mt-4 rounded-full" />
        <div className="flex flex-wrap gap-2 mt-5">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="h-8 rounded-full w-28" />
          <Skeleton className="w-32 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl xl:col-span-3" />
      </div>
    </div>
  )
}

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96 rounded-xl"
      icon={BookOpenTextIcon}
      title="No note selected"
      description="Choose a notebook entry to open the learning article, practice questions, and study context."
      action={<Button className="rounded-lg px-4">Back to notebook</Button>}
    />
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 rounded-xl border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load notebook detail</span>}
      description={message}
      action={
        <Button variant="destructive" className="rounded-lg px-4">
          Retry
        </Button>
      }
    />
  )
}

function Root({
  data = notebookDetailFixture,
  loading,
  empty,
  error,
  backAction = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rounded-lg px-3 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeftIcon />
      Back to notebook
    </Button>
  ),
  renderHeaderActions,
  renderQuestionActions,
}: NotebookDetailPageProps) {
  return (
    <PageBody className="bg-surface-elevated pb-10 md:pb-12">
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : empty ? (
        <EmptyBody />
      ) : (
        <NotebookDetailBody
          data={data}
          backAction={backAction}
          renderHeaderActions={renderHeaderActions}
          renderQuestionActions={renderQuestionActions}
        />
      )}
    </PageBody>
  )
}

const NotebookDetailPage = Object.assign(Root, {
  QuestionCard,
  RelatedNoteRow,
})

export default NotebookDetailPage
