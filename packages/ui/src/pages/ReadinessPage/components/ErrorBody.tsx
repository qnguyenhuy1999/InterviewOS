import { RotateCcwIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Readiness failed to load</span>}
      description={message}
      action={
        <Button variant="destructive">
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
      }
    />
  )
}

export { ErrorBody }
