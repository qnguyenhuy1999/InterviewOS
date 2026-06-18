import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

type ErrorBodyProps = {
  message: string
  retryHref?: string
}

export function ErrorBody({ message, retryHref }: ErrorBodyProps) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load learning path</span>}
      description={message}
      action={
        retryHref ? (
          <Button asChild variant="destructive">
            <a href={retryHref}>Retry</a>
          </Button>
        ) : undefined
      }
    />
  )
}
