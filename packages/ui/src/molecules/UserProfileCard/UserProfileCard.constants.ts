import type { ExperienceLevel } from '@interviewos/types'

export const levelVariant: Record<
  ExperienceLevel,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  JUNIOR: 'outline',
  MID: 'secondary',
  SENIOR: 'default',
  STAFF: 'default',
  PRINCIPAL: 'default',
}
