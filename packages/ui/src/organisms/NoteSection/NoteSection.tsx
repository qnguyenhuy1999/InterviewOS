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
  default:
    'rounded-xl border border-border/70 bg-background px-5 py-5 shadow-elevated md:px-6 md:py-6',
  warning:
    'rounded-xl border border-warning/30 bg-warning-soft px-5 py-5 md:px-6 md:py-6',
  accent:
    'rounded-xl border border-primary/20 bg-accent-soft px-5 py-5 md:px-6 md:py-6',
  muted:
    'rounded-xl border border-border/70 bg-muted px-5 py-5 md:px-6 md:py-6',
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
  const sectionBody = <div className="mt-5 min-w-0">{children}</div>

  return (
    <section
      id={id}
      data-note-section
      className={cn('scroll-mt-24 min-w-0 overflow-hidden', toneClassName[tone], className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h2 className="font-heading text-xl leading-tight font-semibold tracking-tight text-foreground md:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-prose text-pretty text-sm leading-6 text-muted-foreground">
              {description}
            </p>
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
