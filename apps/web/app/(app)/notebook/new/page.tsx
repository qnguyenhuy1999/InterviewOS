export default function NewNotePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">New note</h2>
        <p className="text-sm text-muted-foreground">
          Create a note for your interview preparation
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Note title"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            rows={12}
            placeholder="Write your note here..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Save note
        </button>
      </div>
    </div>
  )
}
