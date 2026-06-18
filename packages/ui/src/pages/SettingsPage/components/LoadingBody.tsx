import { Card } from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import { Spinner } from '../../../atoms/Spinner'

function LoadingBody() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-4 xl:items-start">
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-lg" />
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <Card className="min-h-96 items-center justify-center xl:col-span-3">
          <Spinner size="lg" />
        </Card>
      </div>
    </div>
  )
}

export { LoadingBody }
