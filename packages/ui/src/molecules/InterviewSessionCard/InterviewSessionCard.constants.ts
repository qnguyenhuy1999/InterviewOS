import type { InterviewType } from '@interviewos/types'

export const typeVariant: Record<
  InterviewType,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  TECHNICAL: 'default',
  BEHAVIORAL: 'secondary',
  SYSTEM_DESIGN: 'outline',
  MIXED: 'destructive',
}
