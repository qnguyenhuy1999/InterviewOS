import type { InterviewType } from '../../fixtures'

export const typeVariant: Record<
  InterviewType,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  TECHNICAL: 'default',
  BEHAVIORAL: 'secondary',
  SYSTEM_DESIGN: 'outline',
  MIXED: 'destructive',
}
