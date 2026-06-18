import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load settings</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

export { ErrorBody }
