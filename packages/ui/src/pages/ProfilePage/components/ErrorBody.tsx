import { EmptyState, PageStateAction } from '../../../../components/ui/page'

export function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load profile</span>}
      description={message}
      action={
        retryHref ? (
          <PageStateAction href={retryHref} label="Retry" variant="destructive" />
        ) : undefined
      }
    />
  )
}
