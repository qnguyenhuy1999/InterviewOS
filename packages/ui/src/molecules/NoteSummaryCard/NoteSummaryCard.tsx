import { SparklesIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../../lib/utils'

type NoteSummaryCardProps = {
  title?: React.ReactNode
  summary: React.ReactNode
  quickReference?: string[]
  className?: string
}

function NoteSummaryCard({
  title = 'Quick summary',
  summary,
  quickReference = [],
  className,
}: NoteSummaryCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-border/70 bg-accent-soft px-5 py-5 shadow-elevated md:px-6 md:py-6',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <SparklesIcon className="size-3.5" />
        <span>{title}</span>
      </div>
      <p className="mt-4 max-w-prose break-words text-pretty text-base leading-7 text-foreground md:text-lg">
        {summary}
      </p>

      {quickReference.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {quickReference.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-border/70 bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm break-words text-pretty"
            >
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export { NoteSummaryCard }
