import {
  CheckCircle2Icon,
  SparklesIcon,
  TargetIcon,
} from 'lucide-react'

export const AUTH_PAGE_FEATURES = [
  {
    icon: TargetIcon,
    title: 'Focused prep loops',
    description:
      'Practice sessions, weak concepts, and review prompts stay connected so nothing falls through the cracks.',
  },
  {
    icon: SparklesIcon,
    title: 'Resume-grounded coaching',
    description:
      "Guidance adapts to the role, level, and stack you're targeting — not a one-size template.",
  },
  {
    icon: CheckCircle2Icon,
    title: 'Measurable readiness',
    description:
      "Signals that show whether you're actually improving between sessions, not just grinding.",
  },
] as const

export const AUTH_PAGE_STATS = [
  {
    value: '24/7',
    label: 'Adaptive plan',
    detail: 'Your queue updates after every interview, note, and review decision.',
  },
  {
    value: '4x',
    label: 'Signal types',
    detail: 'Practice, readiness, review, and resume context — one system.',
  },
] as const
