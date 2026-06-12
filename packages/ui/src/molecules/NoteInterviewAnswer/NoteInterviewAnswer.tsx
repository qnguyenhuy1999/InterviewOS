import { CopyCheckIcon, MessageSquareQuoteIcon } from 'lucide-react'

import { cn } from '../../../lib/utils'

type NoteInterviewAnswerProps = {
  answer: string
  className?: string
}

function NoteInterviewAnswer({ answer, className }: NoteInterviewAnswerProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border/70 bg-accent-soft px-5 py-5 shadow-elevated md:px-6 md:py-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <MessageSquareQuoteIcon className="size-3.5" />
          <span>Interview-ready answer</span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background px-2.5 py-1 text-xs text-muted-foreground">
          <CopyCheckIcon className="size-3.5" />
          <span>Easy to rehearse</span>
        </div>
      </div>
      <p className="mt-4 max-w-prose wrap-break-word text-pretty text-base leading-7 text-foreground">
        {answer}
      </p>
    </section>
  )
}

export { NoteInterviewAnswer }
