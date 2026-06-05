import type { ExperienceLevel } from '../../fixtures'

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
