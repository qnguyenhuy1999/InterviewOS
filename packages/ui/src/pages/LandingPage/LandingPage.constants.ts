import { BrainCircuitIcon, SparklesIcon, TargetIcon } from 'lucide-react'

export const LANDING_PAGE_FEATURES = [
  {
    icon: TargetIcon,
    title: 'Signal-aware practice',
    description:
      'Sessions connect to your actual weak spots — not a canned list someone else wrote.',
  },
  {
    icon: SparklesIcon,
    title: 'Resume-grounded coaching',
    description: 'Prep adapts to the exact role, level, and stack you are targeting.',
  },
  {
    icon: BrainCircuitIcon,
    title: 'Measurable readiness',
    description: 'Know whether you are improving between sessions, not just grinding questions.',
  },
] as const

export const LANDING_PAGE_STATS = [
  { value: '12k+', label: 'Engineers prepped' },
  { value: '4.9', label: 'Average rating' },
  { value: '3x', label: 'Offer rate improvement' },
] as const
