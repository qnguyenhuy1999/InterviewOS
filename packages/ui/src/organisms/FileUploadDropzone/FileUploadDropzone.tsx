import { UploadIcon } from 'lucide-react'
import type * as React from 'react'

import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'

type FileUploadDropzoneProps = {
  title: React.ReactNode
  description: React.ReactNode
  supportingText?: React.ReactNode
  actionLabel: React.ReactNode
  actionVariant?: React.ComponentProps<typeof Button>['variant']
  actionSize?: React.ComponentProps<typeof Button>['size']
  className?: string
  contentClassName?: string
  onActionClick?: () => void
}

function FileUploadDropzone({
  title,
  description,
  supportingText,
  actionLabel,
  actionVariant = 'outline',
  actionSize = 'default',
  className,
  contentClassName,
  onActionClick,
}: FileUploadDropzoneProps) {
  return (
    <Card
      className={
        className ??
        'overflow-hidden border border-dashed border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary),white_94%)_0%,white_100%)] py-0 shadow-[0_20px_60px_-34px_color-mix(in_oklch,var(--primary),transparent_62%)]'
      }
    >
      <CardContent
        className={
          contentClassName ??
          'relative flex min-h-[18rem] flex-col items-center justify-center gap-5 px-6 py-8 text-center sm:min-h-[20rem] sm:px-8'
        }
      >
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary),white_68%)_0%,transparent_72%)] opacity-70"
          aria-hidden="true"
        />
        <div className="relative flex size-18 items-center justify-center rounded-[1.75rem] border border-primary/10 bg-white/80 text-primary shadow-sm">
          <UploadIcon className="size-7" />
        </div>
        <div className="relative space-y-3">
          <p className="text-balance font-heading text-2xl font-semibold tracking-tight sm:text-[2rem]">
            {title}
          </p>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
          {supportingText ? (
            <p className="inline-flex rounded-full border border-primary/10 bg-white/80 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
              {supportingText}
            </p>
          ) : null}
        </div>
        <Button
          variant={actionVariant}
          size={actionSize}
          className="shadow-sm"
          onClick={onActionClick}
        >
          <UploadIcon />
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export { FileUploadDropzone }
