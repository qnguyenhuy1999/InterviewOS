import { Skeleton } from '../../../../components/ui/skeleton'
import { Spinner } from '../../../atoms/Spinner'

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-11 w-56 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
        <div className="border-b px-5 py-4">
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex min-h-72 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    </div>
  )
}

export { LoadingBody }
