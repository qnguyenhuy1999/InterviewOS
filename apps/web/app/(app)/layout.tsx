import { requireSession } from '@/lib/server-auth'

import { AppClientLayout } from './_components/AppClientLayout'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()

  return <AppClientLayout currentUser={session.user}>{children}</AppClientLayout>
}
