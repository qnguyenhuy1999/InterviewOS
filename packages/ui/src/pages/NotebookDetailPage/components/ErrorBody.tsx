import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 rounded-xl border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load notebook detail</span>}
      description={message}
      action={
        <Button variant="destructive" className="rounded-lg px-4">
          Retry
        </Button>
      }
    />
  )
}

export { ErrorBody }
