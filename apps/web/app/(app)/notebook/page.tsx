import Link from 'next/link'

import { EmptyState } from '@/components/empty-states/EmptyState'

export default function NotebookPage() {
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
