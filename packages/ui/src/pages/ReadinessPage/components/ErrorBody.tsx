import { RotateCcwIcon } from 'lucide-react'

import { EmptyState, PageStateAction } from '../../../../components/ui/page'

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Readiness failed to load</span>}
      description={message}
      action={
        retryHref ? (
          <PageStateAction
            href={retryHref}
            label="Try again"
            variant="destructive"
            icon={<RotateCcwIcon className="size-4" />}
          />
        ) : undefined
      }
    />
  )
}

export { ErrorBody }
