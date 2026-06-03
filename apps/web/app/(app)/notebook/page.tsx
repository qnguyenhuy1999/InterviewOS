import type { TechnicalNote } from '@interviewos/types'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-states/EmptyState'
import { apiClient } from '@/lib/api-client'
import { formatDate } from '@/lib/format'

export default async function NotebookPage() {
  const notes = await apiClient<TechnicalNote[]>('/notes').catch(() => [])

  if (notes.length === 0) {
    return (
      <EmptyState
        title="No notes yet"
        description="Create your first note to start building your interview knowledge base."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
          </svg>
        }
        cta={
          <Link
            href="/notebook/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create note
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-medium">Smart Technical Notebook</h2>
          <p className="text-sm text-muted-foreground">
            Capture rough notes, generate structured content, and practice from the result.
          </p>
        </div>
        <Link
          href="/notebook/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New note
        </Link>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notebook/${note.id}`}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-heading text-base font-medium">{note.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {note.type.replaceAll('_', ' ')} · {note.status} · Updated{' '}
                  {formatDate(note.updatedAt)}
                </p>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {(note.structuredContent ? 'AI generated' : 'Draft') as string}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
