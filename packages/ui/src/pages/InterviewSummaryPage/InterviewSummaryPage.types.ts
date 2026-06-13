import type { ScoreSection } from '../../organisms/ScoreCard'

export interface InterviewSummaryPageProps {
  sections: ScoreSection[]
  notes: string
  candidateName: string
  role: string
}
