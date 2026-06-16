import { Card, CardContent, CardHeader } from '../../../../components/ui/card'
import type { NotebookPageView } from '../NotebookPage.types'

export function LoadingBody({ view = 'grid' }: { view?: NotebookPageView }) {
  const skeletonCount = 6

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:flex-wrap">
          <div className="h-10 rounded-xl border border-border bg-card md:min-w-72 md:flex-1" />
          <div className="h-10 w-full rounded-xl border border-border bg-card md:w-44" />
          <div className="h-10 w-full rounded-xl border border-border bg-card md:w-44" />
          <div className="h-10 w-full rounded-xl border border-border bg-card md:w-44" />
          <div className="h-10 w-full rounded-xl border border-border bg-card md:w-48" />
        </div>
        <div className="inline-flex h-10 w-20 shrink-0 self-end rounded-xl border border-border bg-card md:self-auto" />
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Card key={i} className="animate-pulse gap-0 border border-border/80 py-0">
              <CardHeader className="grid gap-4 border-b py-4 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-5 md:py-5">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-muted" />
                    <div className="h-6 w-24 rounded-full bg-muted" />
                    <div className="h-6 w-24 rounded-full bg-muted" />
                  </div>
                  <div className="h-6 w-3/5 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
                <div className="flex items-start justify-between gap-3 md:flex-col md:items-stretch">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-muted" />
                    <div className="h-6 w-24 rounded-full bg-muted" />
                  </div>
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-3 w-10 rounded bg-muted" />
                  </div>
                  <div className="h-1.5 rounded-full bg-muted" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-36 rounded-full bg-muted" />
                  <div className="h-6 w-32 rounded-full bg-muted" />
                  <div className="h-6 w-28 rounded-full bg-muted" />
                </div>
                <div className="flex gap-1.5">
                  <div className="size-7 rounded-full bg-muted" />
                  <div className="size-7 rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Card key={i} className="animate-pulse gap-0 border border-border/80 py-0">
              <CardHeader className="gap-3 border-b py-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-muted" />
                  <div className="h-6 w-24 rounded-full bg-muted" />
                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>
                <div className="h-5 w-4/5 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-3 w-10 rounded bg-muted" />
                  </div>
                  <div className="h-1.5 rounded-full bg-muted" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-36 rounded-full bg-muted" />
                  <div className="h-6 w-32 rounded-full bg-muted" />
                  <div className="h-6 w-28 rounded-full bg-muted" />
                </div>
                <div className="flex gap-1.5">
                  <div className="size-7 rounded-full bg-muted" />
                  <div className="size-7 rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
