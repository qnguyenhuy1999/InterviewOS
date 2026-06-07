'use client'

import type { AuthenticatedUser } from '@interviewos/types'
import type { ConsoleLayoutNavGroup } from '@interviewos/ui'
import { ConsoleLayout, LogoutButton } from '@interviewos/ui'
import {
  BookOpenIcon,
  FileTextIcon,
  GraduationCapIcon,
  HomeIcon,
  LanguagesIcon,
  MapIcon,
  MessageSquareIcon,
  SettingsIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

import { apiFetch } from '@/lib/api-client'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { label: 'Onboarding', href: '/onboarding', icon: GraduationCapIcon },
  { label: 'Notebook', href: '/notebook', icon: BookOpenIcon },
  { label: 'Interview', href: '/interview', icon: MessageSquareIcon },
  { label: 'English Notes', href: '/english-notes', icon: LanguagesIcon },
  { label: 'Learning Path', href: '/learning-path', icon: MapIcon },
  { label: 'Resume', href: '/resume', icon: FileTextIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
] as const

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/onboarding': 'Onboarding',
  '/notebook': 'Notebook',
  '/interview': 'Interview',
  '/english-notes': 'English Notes',
  '/learning-path': 'Learning Path',
  '/resume': 'Resume',
  '/settings': 'Settings',
}

export function AppClientLayout({
  currentUser,
  children,
}: {
  currentUser: AuthenticatedUser
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const title =
    Object.entries(ROUTE_TITLES).find(
      ([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'),
    )?.[1] ?? 'InterviewOS'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      label: 'Navigation',
      items: NAV_ITEMS.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        isActive: pathname === item.href || pathname.startsWith(item.href + '/'),
      })),
    },
  ]

  const account = {
    name: currentUser.name ?? currentUser.email,
    email: currentUser.email,
    initials: (currentUser.name ?? currentUser.email).slice(0, 2).toUpperCase(),
  }

  async function handleLogout() {
    await apiFetch('/auth/logout', { method: 'POST' })
  }

  function handleLogoutSuccess() {
    router.push('/login')
    router.refresh()
  }

  return (
    <ConsoleLayout
      title={title}
      navigation={navigation}
      account={account}
      brand={{ name: 'InterviewOS', tagline: 'Interview preparation' }}
      LinkComponent={Link}
      headerActions={<LogoutButton onLogout={handleLogout} onSuccess={handleLogoutSuccess} />}
    >
      {children}
    </ConsoleLayout>
  )
}
