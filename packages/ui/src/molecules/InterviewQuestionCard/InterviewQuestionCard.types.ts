export type QuestionCategory =
  | 'behavioral'
  | 'technical'
  | 'system-design'
  | 'cultural'
  | 'situational'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type InterviewQuestionCardVariant = 'compact' | 'expanded' | 'active'

export interface InterviewQuestionCardProps {
  question: string
  category: QuestionCategory
  difficulty: QuestionDifficulty
  timeEstimate?: number
  tags?: string[]
  isActive?: boolean
  variant?: InterviewQuestionCardVariant
  onSelect?: () => void
  className?: string
}
