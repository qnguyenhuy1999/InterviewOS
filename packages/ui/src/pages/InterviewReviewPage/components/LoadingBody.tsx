import { Skeleton } from '../../../../components/ui/skeleton'

function LoadingBody() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-md" />
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-96 rounded-md xl:col-span-2" />
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-md" />
          <Skeleton className="h-56 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-64 rounded-md" />
    </div>
  )
}

export { LoadingBody }
