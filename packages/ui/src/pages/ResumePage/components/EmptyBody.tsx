import { UploadIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { resumePageFixture } from '../ResumePage.fixtures'
import type { ResumePageProps } from '../ResumePage.types'

function EmptyBody({
  data = resumePageFixture,
  emptyAction,
}: Pick<ResumePageProps, 'data' | 'emptyAction'>) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-background shadow-sm">
        <UploadIcon className="size-7 text-muted-foreground" />
      </div>
      <div className="max-w-sm">
        <p className="text-base font-semibold text-foreground">{data.emptyState.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {data.emptyState.description}
        </p>
      </div>
      {emptyAction ?? (
        <Button size="sm" className="rounded-full px-6">
          {data.emptyState.actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyBody }
