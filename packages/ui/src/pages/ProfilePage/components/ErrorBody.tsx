import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

export function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load profile</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}
