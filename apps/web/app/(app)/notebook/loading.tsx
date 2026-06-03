export default function NotebookLoading() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-xl border border-border bg-muted/40"
        />
      ))}
    </div>
  )
}
