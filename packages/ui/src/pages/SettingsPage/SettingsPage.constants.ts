import type { SettingsSectionId } from '@interviewos/types'
import {
  BrainCircuitIcon,
  LanguagesIcon,
  MicIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import type React from 'react'

export const SECTION_ICONS: Record<
  SettingsSectionId,
  React.ComponentType<{ className?: string }>
> = {
  profile: UserIcon,
  learning_preferences: BrainCircuitIcon,
  english_level: LanguagesIcon,
  interview_preferences: MicIcon,
  ai_provider: SparklesIcon,
  account: ShieldIcon,
}
