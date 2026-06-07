import { AppClientLayout } from '@/components/layout/AppClientLayout'
import { requireSession } from '@/lib/server-auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()

  return <AppClientLayout currentUser={session.user}>{children}</AppClientLayout>
}
