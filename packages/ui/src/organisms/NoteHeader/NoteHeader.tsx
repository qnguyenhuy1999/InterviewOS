import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'

type NoteHeaderProps = {
  title: React.ReactNode
  summary?: React.ReactNode
  meta?: React.ReactNode
  eyebrow?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

function NoteHeader({ title, summary, meta, eyebrow, actions, className }: NoteHeaderProps) {
  return (
    <header
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface-elevated px-5 py-6 shadow-[0_32px_90px_-64px_color-mix(in_oklch,var(--foreground),transparent_50%)] md:px-8 md:py-8',
        className,
      )}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-border/70" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="max-w-4xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-foreground md:text-[2.5rem]">
              {title}
            </h1>
            {summary ? (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/76 md:text-base">
                {summary}
              </p>
            ) : null}
          </div>

          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>

        {meta ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  )
}

function NoteHeaderBadge({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Badge>) {
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
