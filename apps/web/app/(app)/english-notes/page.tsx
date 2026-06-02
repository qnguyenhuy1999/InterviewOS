import { EmptyState } from '@/components/empty-states/EmptyState'

export default function EnglishNotesPage() {
  return (
    <EmptyState
      title="No English notes yet"
      description="Your English corrections and vocabulary will appear here after interview sessions."
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
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      }
    />
  )
}
