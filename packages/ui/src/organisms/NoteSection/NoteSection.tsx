import { ChevronDownIcon } from 'lucide-react'
import type * as React from 'react'

import { Button } from '../../../components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible'
import { cn } from '../../../lib/utils'

type NoteSectionProps = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  tone?: 'default' | 'warning' | 'accent' | 'muted'
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

const toneClassName = {
  default: 'bg-transparent',
  warning:
    'rounded-[1.5rem] border border-warning/25 bg-warning-soft p-5 md:p-6',
  accent:
    'rounded-[1.5rem] border border-primary/12 bg-accent-soft p-5 md:p-6',
  muted:
    'rounded-[1.5rem] border border-border/70 bg-muted/50 p-5 md:p-6',
} as const

function NoteSection({
  id,
  title,
  description,
  tone = 'default',
  collapsible,
  defaultOpen = !collapsible,
  children,
  className,
}: NoteSectionProps) {
  const sectionBody = <div className="mt-5">{children}</div>

  return (
    <section id={id} data-note-section className={cn('scroll-mt-24', toneClassName[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.45rem] leading-tight font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {collapsible ? (
          <div className="hidden sm:block">
            <Button type="button" variant="outline" size="sm" disabled className="pointer-events-none opacity-70">
              Advanced
            </Button>
          </div>
        ) : null}
      </div>

      {collapsible ? (
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4 inline-flex rounded-full px-0 text-muted-foreground hover:bg-transparent hover:text-foreground [&[data-state=open]_svg]:rotate-180"
            >
              <ChevronDownIcon className="size-4 transition-transform duration-200" />
              <span>Show details</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            {sectionBody}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        sectionBody
      )}
    </section>
  )
}

export { NoteSection }
