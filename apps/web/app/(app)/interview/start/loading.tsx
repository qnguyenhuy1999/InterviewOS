export default function InterviewStartLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-12 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
        </div>
        <div className="mt-6 h-40 rounded bg-muted" />
        <div className="mt-6 h-10 w-40 rounded bg-muted" />
      </div>
    </div>
  )
}
