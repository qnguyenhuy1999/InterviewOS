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
        'overflow-hidden border border-dashed border-primary/20 bg-accent-soft py-0 shadow-elevated'
      }
    >
      <CardContent
        className={
          contentClassName ??
          'relative flex min-h-64 flex-col items-center justify-center gap-4 px-5 py-6 text-center sm:min-h-72 sm:px-6'
        }
      >
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-b-xl bg-primary opacity-10"
          aria-hidden="true"
        />
        <div className="relative flex size-14 items-center justify-center rounded-lg border border-primary/20 bg-background text-primary shadow-sm">
          <UploadIcon className="size-5" />
        </div>
        <div className="relative space-y-2">
          <p className="text-balance font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </p>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
          {supportingText ? (
            <p className="inline-flex rounded-md border border-primary/20 bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground shadow-sm">
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
