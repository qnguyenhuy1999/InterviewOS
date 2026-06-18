import { Layers3Icon, NotebookPenIcon, SparklesIcon } from 'lucide-react'

export const NOTEBOOK_COMPOSER_PAGE_DEFAULT_TITLE = 'Create a note'
export const NOTEBOOK_COMPOSER_PAGE_DEFAULT_DESCRIPTION =
  'Start from rough notes, then decide whether this entry should inherit your onboarding defaults or deliberately override them.'

export const NOTEBOOK_COMPOSER_PAGE_GUIDES = [
  {
    icon: NotebookPenIcon,
    title: 'Capture the raw thought first',
    description: 'Focus on the idea, bug, or concept before polishing structure and terminology.',
  },
  {
    icon: Layers3Icon,
    title: 'Use defaults when they save time',
    description:
      'Role, level, and stack inherit from onboarding unless this note needs a custom lens.',
  },
  {
    icon: SparklesIcon,
    title: 'Shape it for future practice',
    description: 'Good notes become interview prompts, review cards, and faster revision later.',
  },
] as const
