import { ChevronRightIcon, FileTextIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import type { ResumeCurrentFile } from '../ResumePage.types'

function CurrentResumeRow({ item }: { item: ResumeCurrentFile }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3.5 transition-colors hover:border-border hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground shadow-sm">
          <FileTextIcon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-snug">{item.fileName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.metadataLabel}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto shrink-0 gap-1 px-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {item.actionLabel}
        <ChevronRightIcon className="size-3.5" />
      </Button>
    </div>
  )
}

export { CurrentResumeRow }
