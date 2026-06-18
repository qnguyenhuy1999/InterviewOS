import { BriefcaseBusinessIcon, Clock3Icon, TargetIcon } from 'lucide-react'

export const INTERVIEW_START_PAGE_DEFAULT_TITLE = 'Start interview'
export const INTERVIEW_START_PAGE_DEFAULT_DESCRIPTION =
  'Use your onboarding defaults, optionally anchor the session to a note, and start with role and stack context that matches the job you are targeting.'

export const INTERVIEW_START_PAGE_CHECKLIST = [
  {
    icon: TargetIcon,
    title: 'Target the right role',
    description: 'Adjust role, level, and tech stack only when this session needs a different angle.',
  },
  {
    icon: BriefcaseBusinessIcon,
    title: 'Attach a note when useful',
    description: 'A note gives the interviewer a sharper domain or concept focus from the first turn.',
  },
  {
    icon: Clock3Icon,
    title: 'Set enough turns',
    description: 'Use shorter sessions for quick reps and longer ones when you want a fuller signal.',
  },
] as const
