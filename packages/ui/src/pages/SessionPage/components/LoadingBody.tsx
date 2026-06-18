import { Card, CardContent, CardHeader } from '../../../../components/ui/card'
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

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="col-span-2 gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-4">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="min-h-40 items-center justify-center">
          <Spinner size="lg" />
        </Card>
      </div>
    </div>
  )
}

export { LoadingBody }
