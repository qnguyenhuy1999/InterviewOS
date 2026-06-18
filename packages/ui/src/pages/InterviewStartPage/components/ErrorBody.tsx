import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function ErrorBody({ message, backHref }: { message: string; backHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load interview setup</span>}
      description={message}
      action={
        backHref ? (
          <Button asChild variant="outline">
            <a href={backHref}>Back to sessions</a>
          </Button>
        ) : undefined
      }
    />
  )
}

export { ErrorBody }
