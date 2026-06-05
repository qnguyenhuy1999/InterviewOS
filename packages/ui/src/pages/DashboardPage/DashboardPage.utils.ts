import { cn } from '../../../lib/utils'
import { DASHBOARD_SCORE_TONE } from './DashboardPage.constants'

export function getDashboardToneClass(tone: keyof typeof DASHBOARD_SCORE_TONE) {
  return cn(
    'inline-flex min-w-14 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
    DASHBOARD_SCORE_TONE[tone],
  )
}
