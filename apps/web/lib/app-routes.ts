import {
  BookOpenIcon,
  FileTextIcon,
  GraduationCapIcon,
  HomeIcon,
  LanguagesIcon,
  type LucideIcon,
  MapIcon,
  MessageSquareIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react'

export const APP_ROUTES = {
  dashboard: '/dashboard',
  onboarding: '/onboarding',
  notebook: '/notebook',
  notebookNew: '/notebook/new',
  notebookDetail: (noteId: string) => `/notebook/${noteId}`,
  notebookEdit: (noteId: string) => `/notebook/${noteId}/edit`,
  interview: '/interview',
  interviewStart: '/interview/start',
  interviewSession: (sessionId: string) => `/interview/session/${sessionId}`,
  interviewReview: (sessionId: string) => `/interview/session/${sessionId}/review`,
  review: '/review',
  englishNotes: '/english-notes',
  learningPath: '/learning-path',
  readiness: '/readiness',
  resume: '/resume',
  settings: '/settings',
} as const

type AppNavigationItem = {
  href: string
  icon: LucideIcon
  label: string
  title: string
}

export const APP_NAVIGATION: AppNavigationItem[] = [
  { href: APP_ROUTES.dashboard, icon: HomeIcon, label: 'Dashboard', title: 'Dashboard' },
  {
    href: APP_ROUTES.onboarding,
    icon: GraduationCapIcon,
    label: 'Onboarding',
    title: 'Onboarding',
  },
  { href: APP_ROUTES.notebook, icon: BookOpenIcon, label: 'Notebook', title: 'Notebook' },
  { href: APP_ROUTES.interview, icon: MessageSquareIcon, label: 'Interview', title: 'Interview' },
  { href: APP_ROUTES.review, icon: SparklesIcon, label: 'Review', title: 'Review' },
  {
    href: APP_ROUTES.englishNotes,
    icon: LanguagesIcon,
    label: 'English Notes',
    title: 'English Notes',
  },
  { href: APP_ROUTES.readiness, icon: SparklesIcon, label: 'Readiness', title: 'Readiness' },
  { href: APP_ROUTES.learningPath, icon: MapIcon, label: 'Learning Path', title: 'Learning Path' },
  { href: APP_ROUTES.resume, icon: FileTextIcon, label: 'Resume', title: 'Resume' },
  { href: APP_ROUTES.settings, icon: SettingsIcon, label: 'Settings', title: 'Settings' },
] as const

export function getAppRouteTitle(pathname: string): string {
  return (
    APP_NAVIGATION.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      ?.title ?? 'InterviewOS'
  )
}
