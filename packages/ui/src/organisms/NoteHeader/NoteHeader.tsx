import { TechnicalNote } from '@interviewos/types'
import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'

type NoteHeaderProps = {
  title: React.ReactNode
  note?: TechnicalNote
  backAction?: React.ReactNode
  meta?: React.ReactNode
  eyebrow?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

function NoteHeader({
  title,
  note,
  backAction,
  meta,
  eyebrow,
  actions,
  className,
}: NoteHeaderProps) {
  const summary = note?.structuredContent?.purpose

  return (
    <header
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/70 bg-surface-elevated px-5 py-5 shadow-elevated md:px-8 md:py-7',
        className,
      )}
    >
      <div className="absolute top-0 h-px inset-x-8 bg-border/70" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          {backAction ? <div className="flex items-center">{backAction}</div> : null}

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:justify-end">
              {actions}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            {eyebrow ? (
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </div>
            ) : null}
            <h1
              className="text-balance font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-4xl"
              title={title?.toString()}
            >
              {title}
            </h1>
            {summary ? (
              <p className="text-pretty text-sm leading-7 text-muted-foreground" title={summary}>
                {summary}
              </p>
            ) : null}
          </div>
        </div>

        {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
    </header>
  )
}

function NoteHeaderBadge({ children, className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-md border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground whitespace-normal break-words',
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  )
}

export { NoteHeader, NoteHeaderBadge }
