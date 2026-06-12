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
        'overflow-hidden rounded-[1.75rem] border border-border/70 bg-accent-soft px-5 py-5 shadow-[0_24px_80px_-56px_color-mix(in_oklch,var(--foreground),transparent_60%)] md:px-6 md:py-6',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <SparklesIcon className="size-3.5" />
        <span>{title}</span>
      </div>
      <p className="mt-4 max-w-[66ch] break-words text-pretty text-[1rem] leading-7 text-foreground md:text-[1.05rem]">
        {summary}
      </p>

      {quickReference.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {quickReference.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm leading-6 text-foreground/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm break-words text-pretty"
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
