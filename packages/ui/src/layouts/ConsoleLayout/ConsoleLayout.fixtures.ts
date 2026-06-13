import {
  BookOpenIcon,
  FileTextIcon,
  GaugeIcon,
  LanguagesIcon,
  MicIcon,
  RouteIcon,
  SettingsIcon,
  UserCircleIcon,
  VideoIcon,
  WavesLadderIcon,
} from 'lucide-react'

import type {
  ConsoleLayoutAccount,
  ConsoleLayoutBrand,
  ConsoleLayoutNavGroup,
} from './ConsoleLayout.types'
import { getDisplayInitials } from './ConsoleLayout.utils'

export const consoleLayoutBrandFixture: ConsoleLayoutBrand = {
  name: 'InterviewOS',
  tagline: 'MVP preview',
}

export const consoleLayoutNavigationFixture: ConsoleLayoutNavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '#dashboard', icon: GaugeIcon, isActive: true },
      { label: 'Notebook', href: '#notebook', icon: BookOpenIcon },
      { label: 'Interviews', href: '#interviews', icon: MicIcon },
      { label: 'Review', href: '#review', icon: WavesLadderIcon },
      { label: 'English', href: '#english', icon: LanguagesIcon },
      { label: 'Readiness', href: '#readiness', icon: GaugeIcon },
      { label: 'Learning Path', href: '#learning-path', icon: RouteIcon },
      { label: 'Resume', href: '#resume', icon: FileTextIcon },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '#profile', icon: UserCircleIcon },
      { label: 'Sessions', href: '#sessions', icon: VideoIcon },
      { label: 'Settings', href: '#settings', icon: SettingsIcon },
    ],
  },
]

export const consoleLayoutAccountFixture: ConsoleLayoutAccount = {
  name: 'Diego Almeida',
  email: 'diego@interviewos.dev',
  initials: getDisplayInitials('Diego Almeida'),
}
