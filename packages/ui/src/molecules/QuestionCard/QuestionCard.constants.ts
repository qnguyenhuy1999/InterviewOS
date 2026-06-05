import type { QuestionDifficulty } from '@interviewos/types'

export const difficultyVariant: Record<
  QuestionDifficulty,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  EASY: 'secondary',
  MEDIUM: 'outline',
  HARD: 'default',
  EXPERT: 'destructive',
}
