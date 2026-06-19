import { EmptyState, PageStateAction } from '../../../../components/ui/page'

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load settings</span>}
      description={message}
      action={
        retryHref ? (
          <PageStateAction href={retryHref} label="Retry" variant="destructive" />
        ) : undefined
      }
    />
  )
}

export { ErrorBody }
