import { UploadCloudIcon } from 'lucide-react'

import { resumePageFixture } from '../ResumePage.fixtures'
import type { ResumePageProps } from '../ResumePage.types'

function UploadPrompt({
  data = resumePageFixture,
  action,
}: {
  data?: ResumePageProps['data']
  action?: ResumePageProps['uploadAction']
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center transition-all hover:border-primary/40 hover:bg-muted/40">
      <div className="pointer-events-none absolute inset-0 bg-primary/[0.04]" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm">
          <UploadCloudIcon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{data.upload.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.upload.description}</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {data.upload.supportedFormatsLabel}
          </p>
        </div>
        {action}
      </div>
    </div>
  )
}

export { UploadPrompt }
