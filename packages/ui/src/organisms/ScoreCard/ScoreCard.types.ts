export interface ScoreCriteria {
  id: string
  label: string
  score: 1 | 2 | 3 | 4 | 5 | null
  notes?: string
}

export interface ScoreSection {
  id: string
  title: string
  criteria: ScoreCriteria[]
}

export interface ScoreCardProps {
  sections: ScoreSection[]
  onChange: (sectionId: string, criteriaId: string, score: 1 | 2 | 3 | 4 | 5) => void
  className?: string
}
