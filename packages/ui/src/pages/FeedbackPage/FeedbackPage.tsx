import { FeedbackFormPanel } from '../../organisms/FeedbackFormPanel'
import type { FeedbackPageProps } from './FeedbackPage.types'

export function FeedbackPage({ sections, onChange, onSubmit, isDraft }: FeedbackPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <FeedbackFormPanel
          sections={sections}
          onChange={onChange}
          onSubmit={onSubmit}
          isDraft={isDraft}
        />
      </div>
    </div>
  )
}

export default FeedbackPage
