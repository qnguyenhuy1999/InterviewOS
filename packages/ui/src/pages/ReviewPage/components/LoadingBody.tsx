import { Card, CardContent, CardHeader } from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import { Spinner } from '../../../atoms/Spinner'

function LoadingBody() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <CardHeader className="gap-4 border-b py-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 py-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, j) => (
                <Skeleton key={j} className="h-8 w-full rounded-md" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-56 items-center justify-center">
        <Spinner size="lg" />
      </Card>
    </div>
  )
}

export { LoadingBody }
