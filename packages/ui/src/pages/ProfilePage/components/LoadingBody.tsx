import { Skeleton } from '../../../../components/ui/skeleton'

export function LoadingBody() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-36 rounded-md" />
      <Skeleton className="h-72 rounded-md" />
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-96 rounded-md" />
        <Skeleton className="h-96 rounded-md" />
      </div>
    </div>
  )
}
