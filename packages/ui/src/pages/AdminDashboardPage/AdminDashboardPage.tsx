import ConsoleLayout from '../../layouts/ConsoleLayout'
import type { AdminDashboardPageProps } from './AdminDashboardPage.types'

export function AdminDashboardPage({ navItems }: AdminDashboardPageProps) {
  return (
    <ConsoleLayout title="Admin Dashboard" navigation={[{ label: 'Navigation', items: navItems }]}>
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Select an interview
      </div>
    </ConsoleLayout>
  )
}

export default AdminDashboardPage
