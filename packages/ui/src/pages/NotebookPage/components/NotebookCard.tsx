import { ArrowUpRightIcon, PencilLineIcon, SparklesIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { DifficultyBadge } from '../../../../components/ui/status'
import { cn } from '../../../../lib/utils'
import type { NotebookPageNote, NotebookPageView } from '../NotebookPage.types'
import {
  getDifficultyTone,
  getEnumLabel,
  getNotebookReadinessPercent,
  getNotebookSummary,
  getReadinessLabel,
  getRelativeUpdatedAtLabel,
} from '../NotebookPage.utils'
import { NotebookChip } from './NotebookChip'
import { NotebookProgress } from './NotebookProgress'

export function NotebookCard({
  note,
  view,
  noteHref,
  noteEditHref,
}: {
  note: NotebookPageNote
  view: NotebookPageView
  noteHref: string
  noteEditHref?: string
}) {
  const isListView = view === 'list'
  const topicLabel = note.topic?.trim() || getEnumLabel(note.type)
  const focusLabel =
    note.overrideStack.length > 0 ? note.overrideStack.slice(0, 2).join(' / ') : topicLabel
  const styleLabel = note.preferredOutputStyle?.trim() || 'Balanced'
  const updatedLabel = getRelativeUpdatedAtLabel(note.updatedAt)
  const progressValue = getNotebookReadinessPercent(note.status)
  const readinessLabel = getReadinessLabel(progressValue)

  const typeChipVariant =
    note.type === 'SYSTEM_DESIGN'
      ? 'accent'
      : note.type === 'BEHAVIORAL'
        ? 'status'
        : note.type === 'ALGORITHM'
          ? 'default'
          : 'muted'

  return (
    <Card
      className={cn(
        'group gap-0 overflow-hidden border border-border/60 bg-surface-elevated py-0 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-elevated',
        isListView && 'shadow-sm',
      )}
      size={isListView ? 'sm' : 'default'}
    >
      <CardHeader
        className={cn(
          'gap-3 border-b py-4',
          isListView && 'md:grid md:grid-cols-[minmax(0,1fr)_14rem] md:gap-5 md:py-5',
        )}
      >
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <NotebookChip variant="accent">{topicLabel}</NotebookChip>
            <NotebookChip variant={typeChipVariant}>{getEnumLabel(note.type)}</NotebookChip>
            <NotebookChip variant="muted">
              {note.questionCount} {note.questionCount === 1 ? 'question' : 'questions'}
            </NotebookChip>
          </div>

          <CardTitle className={cn('font-semibold', isListView ? 'text-xl' : 'mt-2 text-lg')}>
            <a
              href={noteHref}
              className="inline-flex items-start gap-2 underline-offset-4 hover:underline"
            >
              <span>{note.title}</span>
              <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          </CardTitle>

          <p
            className={cn(
              'line-clamp-2 text-xs leading-6 text-muted-foreground',
              !isListView && 'mt-2',
            )}
          >
            {getNotebookSummary(note)}
          </p>
        </div>

        <div className="flex items-start justify-between gap-3 md:flex-col md:items-stretch">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={getDifficultyTone(note.difficulty)} className="shrink-0" />
            <NotebookChip status={note.status}>{getEnumLabel(note.status)}</NotebookChip>
          </div>
          <div
            className={cn(
              'text-right text-xs font-semibold uppercase md:text-left',
              progressValue >= 85
                ? 'text-success'
                : progressValue >= 60
                  ? 'text-primary'
                  : progressValue >= 30
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted-foreground',
            )}
          >
            {readinessLabel}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          'space-y-4 py-4',
          !isListView && 'grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]',
        )}
      >
        <div className="space-y-3">
          <NotebookProgress status={note.status} progressLabel={`${progressValue}%`} />
          <div className="flex flex-wrap gap-2">
            <NotebookChip variant="default">Updated {updatedLabel}</NotebookChip>
            {focusLabel !== topicLabel && (
              <NotebookChip variant="default">Focus {focusLabel}</NotebookChip>
            )}
            <NotebookChip variant="default">Style {styleLabel}</NotebookChip>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-start">
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              title="Open practice view"
            >
              <a href={noteHref}>
                <SparklesIcon />
                <span className="sr-only">Open practice view</span>
              </a>
            </Button>
            {noteEditHref ? (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                title="Edit note"
              >
                <a href={noteEditHref}>
                  <PencilLineIcon />
                  <span className="sr-only">Edit note</span>
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
