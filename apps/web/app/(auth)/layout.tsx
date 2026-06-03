import { redirect } from 'next/navigation'

import { getOptionalSession } from '@/lib/server-auth'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getOptionalSession()

  if (session) {
    redirect('/dashboard')
  }

  return children
}
