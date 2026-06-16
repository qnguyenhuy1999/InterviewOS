'use client'

import { API_ROUTES } from '@interviewos/config'
import type { AuthenticatedUser } from '@interviewos/types'
import type { ConsoleLayoutNavGroup } from '@interviewos/ui'
import { ConsoleLayout, TooltipProvider } from '@interviewos/ui'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

import { apiFetch } from '@/lib/api-client'
import { APP_NAVIGATION, APP_ROUTES, getAppRouteTitle } from '@/lib/app-routes'

export function AppClientLayout({
  currentUser,
  children,
}: {
  currentUser: AuthenticatedUser
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const title = getAppRouteTitle(pathname)

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      label: 'Navigation',
      items: APP_NAVIGATION.map((item) => ({
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
    await apiFetch(API_ROUTES.auth.logout, { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <TooltipProvider>
      <ConsoleLayout
        title={title}
        navigation={navigation}
        account={account}
        brand={{ name: 'InterviewOS', tagline: 'Interview preparation' }}
        LinkComponent={Link}
        settingsHref={APP_ROUTES.settings}
        onLogout={handleLogout}
      >
        {children}
      </ConsoleLayout>
    </TooltipProvider>
  )
}
