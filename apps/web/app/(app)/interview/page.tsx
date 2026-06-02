import Link from 'next/link'

import { EmptyState } from '@/components/empty-states/EmptyState'

export default function InterviewPage() {
  return (
    <EmptyState
      title="No interview sessions yet"
      description="Start your first practice session to receive technical and English feedback."
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
      cta={
        <Link
          href="/interview/session/1"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Start practice session
        </Link>
      }
    />
  )
}
