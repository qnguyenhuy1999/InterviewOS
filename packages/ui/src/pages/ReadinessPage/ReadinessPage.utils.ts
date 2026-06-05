import type { ScoreBreakdown } from '@interviewos/types'
import { format, isToday } from 'date-fns'

import { cn } from '../../../lib/utils'
import { READINESS_TREND_TONE } from './ReadinessPage.constants'

export function getReadinessTrend(delta: number): ScoreBreakdown['trend'] {
  if (delta > 0) {
    return 'UP'
  }

  if (delta < 0) {
    return 'DOWN'
  }

  return 'STABLE'
}

export function getReadinessTrendClassName(trend: ScoreBreakdown['trend']) {
  return cn(
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
    READINESS_TREND_TONE[trend],
  )
}

export function getReadinessDeltaLabel(delta: number) {
  if (delta > 0) {
    return `+${delta} pts`
  }

  if (delta < 0) {
    return `${delta} pts`
  }

  return 'No change'
}

export function getReadinessComputedAtLabel(computedAt: Date) {
  if (isToday(computedAt)) {
    return `Computed today, ${format(computedAt, 'HH:mm')}`
  }

  return `Computed ${format(computedAt, 'MMM d, HH:mm')}`
}

export function getReadinessHistoryDateLabel(computedAt: Date) {
  return format(computedAt, 'MMM d')
}

export function getBestReadinessDimension(breakdown: ScoreBreakdown[]) {
  return breakdown.reduce((best, item) => (item.score > best.score ? item : best), breakdown[0])
}
