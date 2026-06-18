import { BrainCircuitIcon, MicIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react'
import type React from 'react'

export const ONBOARDING_PAGE_BENEFITS: Array<{
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}> = [
  {
    icon: BrainCircuitIcon,
    title: 'AI-powered gap analysis',
    description: 'We surface exactly which concepts to revisit before your next interview.',
  },
  {
    icon: MicIcon,
    title: 'Realistic interview practice',
    description: 'Simulate full interview sessions with live feedback on clarity and depth.',
  },
  {
    icon: SparklesIcon,
    title: 'Spaced repetition review',
    description: 'A smart review queue keeps key topics fresh at exactly the right moment.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Readiness score over time',
    description: "Track your trajectory so you know when you're genuinely interview-ready.",
  },
]
