import { TechnicalNote } from '@interviewos/types'
import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'
import { getNotebookSummary } from '../../pages/NotebookPage/NotebookPage.utils'

type NoteHeaderProps = {
  title: React.ReactNode
  note?: TechnicalNote
  meta?: React.ReactNode
  eyebrow?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

function NoteHeader({ title, note, meta, eyebrow, actions, className }: NoteHeaderProps) {
  const summary = note?.structuredContent?.purpose

  return (
    <header
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface-elevated px-5 py-6 shadow-[0_32px_90px_-64px_color-mix(in_oklch,var(--foreground),transparent_50%)] md:px-8 md:py-8',
        className,
      )}
    >
      <div className="absolute top-0 h-px inset-x-8 bg-border/70" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </div>
            ) : null}
            <h1
              className="max-w-4xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-foreground md:text-[2.5rem]"
              title={title?.toString()}
            >
              {title}
            </h1>
            {summary ? (
              <p
                className="max-w-3xl mt-4 text-sm leading-7 text-foreground/76 md:text-base"
                title={summary}
              >
                {getNotebookSummary(note)}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
          ) : null}
        </div>

        {meta ? <div className="flex flex-wrap items-center gap-2.5">{meta}</div> : null}
      </div>
    </header>
  )
}

function NoteHeaderBadge({ children, className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full border-white/70 bg-white/72 px-3 py-1 text-[11px] font-medium tracking-[0.01em] text-foreground/78 backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  )
}

export { NoteHeader, NoteHeaderBadge }
