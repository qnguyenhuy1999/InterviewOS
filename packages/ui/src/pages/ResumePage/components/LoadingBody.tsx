import { Card, CardAction, CardContent, CardHeader } from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import { Spinner } from '../../../atoms/Spinner'

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-muted/20 px-5 py-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-14" />
              </div>
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>

      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-36" />
                <Skeleton className="h-3 w-52" />
              </div>
              <CardAction>
                <Skeleton className="h-8 w-20 rounded-full" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2.5 py-4">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-14 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-48 items-center justify-center">
        <Spinner size="lg" />
      </Card>
    </div>
  )
}

export { LoadingBody }
