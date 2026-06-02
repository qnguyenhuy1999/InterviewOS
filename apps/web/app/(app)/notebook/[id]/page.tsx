export default function NoteDetailPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Note title</h2>
        <p className="text-sm text-muted-foreground">
          Created on January 1, 2026
        </p>
      </div>
      <div className="rounded-lg border border-border p-4 text-sm leading-relaxed text-foreground">
        <p>Note content will appear here.</p>
      </div>
    </div>
  )
}
