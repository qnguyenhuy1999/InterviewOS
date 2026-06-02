'use client'

import { usePathname } from 'next/navigation'

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

export function Header() {
  const pathname = usePathname()

  const title =
    Object.entries(routeTitles).find(([prefix]) =>
      pathname === prefix || pathname.startsWith(prefix + '/'),
    )?.[1] ?? 'InterviewOS'

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6 md:px-8">
      <h1 className="font-heading text-lg font-medium md:ml-0">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          U
        </div>
      </div>
    </header>
  )
}
