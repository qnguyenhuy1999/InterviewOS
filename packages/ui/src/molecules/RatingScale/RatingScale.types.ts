export interface RatingScaleProps {
  value: 1 | 2 | 3 | 4 | 5 | null
  labels?: [string, string, string, string, string]
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
  disabled?: boolean
  showLabels?: boolean
  variant?: 'numeric' | 'labeled' | 'compact'
  className?: string
}
