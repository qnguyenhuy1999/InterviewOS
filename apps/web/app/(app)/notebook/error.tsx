'use client'

export default function NotebookError() {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      Something went wrong while loading notebook data.
    </div>
  )
}
