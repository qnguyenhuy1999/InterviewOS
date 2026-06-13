export type TimerVariant = 'countdown' | 'elapsed' | 'warning'
export type TimerState = 'running' | 'paused' | 'critical' | 'expired'

export interface TimerProps {
  variant: TimerVariant
  /** Total seconds for countdown, or elapsed seconds for elapsed */
  seconds: number
  /** Warning threshold in seconds (default: 300 = 5min) */
  warningThreshold?: number
  /** Critical threshold in seconds (default: 60 = 1min) */
  criticalThreshold?: number
  state?: TimerState
  compact?: boolean
  className?: string
}
