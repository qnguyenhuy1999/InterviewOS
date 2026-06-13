export type ChipVariant = 'filter' | 'skill' | 'topic'

export interface ChipProps {
  label: string
  variant?: ChipVariant
  onRemove?: () => void
  disabled?: boolean
  className?: string
}
