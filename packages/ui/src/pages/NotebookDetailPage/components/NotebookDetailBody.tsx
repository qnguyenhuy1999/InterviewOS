import type { TechnicalNoteDetailView } from '@interviewos/types'
import { FileQuestionIcon, MenuIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '../../../../components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../../components/ui/sheet'
import { StatusDot } from '../../../../components/ui/status'
import { BulletList } from '../../../molecules/BulletList/BulletList'
import { NoteInterviewAnswer } from '../../../molecules/NoteInterviewAnswer/NoteInterviewAnswer'
import { NoteSummaryCard } from '../../../molecules/NoteSummaryCard/NoteSummaryCard'
import { NoteToc } from '../../../molecules/NoteToc/NoteToc'
import { NoteHeader, NoteHeaderBadge } from '../../../organisms/NoteHeader/NoteHeader'
import { NoteMetaRail } from '../../../organisms/NoteMetaRail/NoteMetaRail'
import { NoteSection } from '../../../organisms/NoteSection/NoteSection'
import {
  getEnumLabel,
  getRelativeUpdatedAtLabel,
  getStatusDot,
} from '../../NotebookPage/NotebookPage.utils'
import type { NotebookDetailPageProps } from '../NotebookDetailPage.types'
import {
  getNotebookDetailArticleSections,
  getNotebookDetailEstimatedReadingTimeLabel,
  getNotebookDetailInterviewAnswer,
  getNotebookDetailTopicLabel,
} from '../NotebookDetailPage.utils'
import { ConceptGrid } from './ConceptGrid'
import { MentalModelCard } from './MentalModelCard'
import { PracticeQuestions } from './PracticeQuestions'
import { RelatedNotes } from './RelatedNotes'
import { StructuredContentEmpty } from './StructuredContentEmpty'
import { StudyContext } from './StudyContext'

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

export { NotebookDetailBody }
