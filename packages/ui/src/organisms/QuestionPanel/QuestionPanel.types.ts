import type {
  QuestionCategory,
  QuestionDifficulty,
} from '../../molecules/InterviewQuestionCard/InterviewQuestionCard.types'

export interface PanelQuestion {
  id: string
  question: string
  category: QuestionCategory
  difficulty: QuestionDifficulty
  timeEstimate?: number
  isActive?: boolean
}

export interface QuestionPanelProps {
  questions: PanelQuestion[]
  activeId?: string
  onSelect: (id: string) => void
  className?: string
}
