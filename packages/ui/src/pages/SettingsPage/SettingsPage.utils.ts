import type { SettingsActionIntent } from '@interviewos/types'

export function getSettingsActionVariant(
  intent: SettingsActionIntent,
): 'default' | 'outline' | 'destructive' {
  if (intent === 'primary') return 'default'
  if (intent === 'destructive') return 'destructive'
  return 'outline'
}
