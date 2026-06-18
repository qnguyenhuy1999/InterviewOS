import { PageBody } from '../../../../components/ui/page'
import { Skeleton } from '../../../../components/ui/skeleton'

function LoadingBody() {
  return (
    <PageBody className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-lg xl:col-span-2" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
      <Skeleton className="h-80 rounded-lg" />
      <Skeleton className="h-80 rounded-lg" />
    </PageBody>
  )
}

export { LoadingBody }
