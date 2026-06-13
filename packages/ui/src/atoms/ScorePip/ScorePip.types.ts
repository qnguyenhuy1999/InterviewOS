export type ScorePipState = 'filled' | 'empty' | 'partial'

export interface ScorePipProps {
  value: 1 | 2 | 3 | 4 | 5
  state?: ScorePipState
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
