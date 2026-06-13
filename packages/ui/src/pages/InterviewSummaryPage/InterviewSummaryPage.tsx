import { ReviewLayout } from '../../layouts/ReviewLayout'
import { ScoreCard } from '../../organisms/ScoreCard'
import type { InterviewSummaryPageProps } from './InterviewSummaryPage.types'

export function InterviewSummaryPage({
  sections,
  notes,
  candidateName,
  role,
}: InterviewSummaryPageProps) {
  return (
    <ReviewLayout
      topBar={
        <div className="flex items-center gap-3 px-4 py-2">
          <div>
            <span className="text-sm font-semibold">{candidateName}</span>
            <span className="ml-2 text-xs text-gray-500">{role}</span>
          </div>
        </div>
      }
      videoPanel={
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Recording
        </div>
      }
      transcriptPanel={
        <ScoreCard sections={sections} onChange={() => {}} className="h-full overflow-auto" />
      }
      sidePanel={
        <div className="flex h-full flex-col gap-3 p-4">
          <h3 className="text-sm font-semibold">Interview Notes</h3>
          <textarea
            className="flex-1 resize-none rounded-md border p-3 text-sm"
            defaultValue={notes}
            readOnly
          />
        </div>
      }
    />
  )
}

export default InterviewSummaryPage
