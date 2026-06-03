'use client'

import type { AuthenticatedUser } from '@interviewos/types'
import { usePathname } from 'next/navigation'

import { LogoutButton } from '../session/LogoutButton'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/onboarding': 'Onboarding',
  '/notebook': 'Notebook',
  '/interview': 'Interview',
  '/english-notes': 'English Notes',
  '/learning-path': 'Learning Path',
  '/resume': 'Resume',
  '/settings': 'Settings',
}

export function Header({ currentUser }: { currentUser: AuthenticatedUser }) {
  const pathname = usePathname()

  const title =
    Object.entries(routeTitles).find(
      ([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'),
    )?.[1] ?? 'InterviewOS'

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6 md:px-8">
      <h1 className="font-heading text-lg font-medium md:ml-0">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{currentUser.name ?? currentUser.email}</p>
          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {(currentUser.name ?? currentUser.email).slice(0, 1).toUpperCase()}
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
