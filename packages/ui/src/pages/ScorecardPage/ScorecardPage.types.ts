import type { ScoreSection } from '../../organisms/ScoreCard'

export interface ScorecardPageProps {
  sections: ScoreSection[]
  onScoreChange: (sectionId: string, criteriaId: string, score: 1 | 2 | 3 | 4 | 5) => void
}
