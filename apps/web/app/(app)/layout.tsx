import { AppShell } from '@/components/layout/AppShell'
import { requireSession } from '@/lib/server-auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()

  return <AppShell currentUser={session.user}>{children}</AppShell>
}
