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
        'rounded-[1.6rem] border border-border/70 bg-accent-soft px-5 py-5 shadow-[0_22px_64px_-48px_color-mix(in_oklch,var(--primary),transparent_25%)] md:px-6 md:py-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <MessageSquareQuoteIcon className="size-3.5" />
          <span>Interview-ready answer</span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-white/80 px-2.5 py-1 text-xs text-muted-foreground">
          <CopyCheckIcon className="size-3.5" />
          <span>Easy to rehearse</span>
        </div>
      </div>
      <p className="mt-4 max-w-[66ch] break-words text-pretty text-[0.98rem] leading-7 text-foreground md:text-[1.02rem]">
        {answer}
      </p>
    </section>
  )
}

export { NoteInterviewAnswer }
