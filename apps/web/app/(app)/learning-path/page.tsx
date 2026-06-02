import { EmptyState } from '@/components/empty-states/EmptyState'

export default function LearningPathPage() {
  return (
    <EmptyState
      title="Your learning path is ready"
      description="Complete your first interview session to receive personalized recommendations."
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      }
    />
  )
}
