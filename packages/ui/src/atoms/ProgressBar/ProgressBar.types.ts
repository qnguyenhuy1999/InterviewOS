export type ProgressBarVariant = 'determinate' | 'indeterminate' | 'stepped'

export interface ProgressBarProps {
  variant?: ProgressBarVariant
  value?: number
  steps?: number
  completedSteps?: number
  label?: string
  showValue?: boolean
  className?: string
}
