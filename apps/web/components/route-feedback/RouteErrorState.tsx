'use client'

type RouteErrorStateProps = {
  title: string
  message?: string
  reset: () => void
  backHref?: string
  backLabel?: string
}

export function RouteErrorState({
  title,
  message = 'Something went wrong while loading this page.',
  reset,
  backHref,
  backLabel = 'Back',
}: RouteErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-foreground">
      <p className="font-medium text-destructive">{title}</p>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-destructive px-4 py-2 font-medium text-destructive-foreground"
        >
          Try again
        </button>
        {backHref ? (
          <a href={backHref} className="rounded-lg border border-border px-4 py-2 font-medium">
            {backLabel}
          </a>
        ) : null}
      </div>
    </div>
  )
}
