import { Skeleton } from '../../../../components/ui/skeleton'

function LoadingBody() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-surface-elevated px-6 py-7">
        <Skeleton className="w-32 h-4 rounded-full" />
        <Skeleton className="w-full h-12 max-w-3xl mt-5 rounded-2xl" />
        <Skeleton className="w-full h-5 max-w-2xl mt-4 rounded-full" />
        <div className="flex flex-wrap gap-2 mt-5">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="h-8 rounded-full w-28" />
          <Skeleton className="w-32 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl xl:col-span-3" />
      </div>
    </div>
  )
}

export { LoadingBody }
