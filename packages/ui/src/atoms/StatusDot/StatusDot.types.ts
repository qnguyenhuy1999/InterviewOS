export type StatusDotVariant = 'live' | 'idle' | 'away' | 'offline'

export interface StatusDotProps {
  variant: StatusDotVariant
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showLabel?: boolean
  pulse?: boolean
  className?: string
}
