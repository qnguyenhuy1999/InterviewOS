import { ReviewLayout } from '../../layouts/ReviewLayout'
import { ScoreCard } from '../../organisms/ScoreCard'
import type { ScorecardPageProps } from './ScorecardPage.types'

export function ScorecardPage({ sections, onScoreChange }: ScorecardPageProps) {
  return (
    <ReviewLayout
      topBar={
        <div className="flex items-center gap-3 px-4 py-2">
          <h1 className="text-sm font-semibold">Interview Scorecard</h1>
        </div>
      }
      videoPanel={
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Video Playback
        </div>
      }
      transcriptPanel={
        <ScoreCard sections={sections} onChange={onScoreChange} className="h-full overflow-auto" />
      }
      sidePanel={
        <div className="flex h-full items-center justify-center text-sm text-gray-400">Notes</div>
      }
    />
  )
}

export default ScorecardPage
