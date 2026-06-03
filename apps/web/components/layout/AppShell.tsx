import type { AuthenticatedUser } from '@interviewos/types'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell({
  children,
  currentUser,
}: {
  children: React.ReactNode
  currentUser: AuthenticatedUser
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header currentUser={currentUser} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
