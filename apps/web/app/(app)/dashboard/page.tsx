import Link from 'next/link'

import { EmptyState } from '@/components/empty-states/EmptyState'

export default function DashboardPage() {
  return (
    <EmptyState
      title="Your dashboard is ready"
      description="Start by adding notes, uploading your resume, or creating an interview session."
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
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
        </svg>
      }
      cta={
        <div className="flex gap-3">
          <Link
            href="/notebook/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            New note
          </Link>
          <Link
            href="/interview"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
          >
            Start interview
          </Link>
        </div>
      }
    />
  )
}
