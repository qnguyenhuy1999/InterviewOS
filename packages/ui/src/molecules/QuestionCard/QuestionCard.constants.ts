import type { QuestionDifficulty } from '../../fixtures'

export const difficultyVariant: Record<
  QuestionDifficulty,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  EASY: 'secondary',
  MEDIUM: 'outline',
  HARD: 'default',
  EXPERT: 'destructive',
}
