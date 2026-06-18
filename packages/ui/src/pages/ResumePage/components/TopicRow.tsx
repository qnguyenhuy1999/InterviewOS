import { ArrowRightIcon, ZapIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import type { ResumeSuggestedTopic } from '../ResumePage.types'

function TopicRow({ item }: { item: ResumeSuggestedTopic }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ZapIcon className="size-3.5" />
        </div>
        <p className="text-sm font-medium leading-snug">{item.title}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-xs opacity-0 transition-opacity group-hover:opacity-100"
      >
        {item.actionLabel}
        <ArrowRightIcon className="size-3" />
      </Button>
    </div>
  )
}

export { TopicRow }
