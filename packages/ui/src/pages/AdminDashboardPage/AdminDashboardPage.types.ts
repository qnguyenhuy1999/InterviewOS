import type { LucideIcon } from 'lucide-react'

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export interface AdminDashboardPageProps {
  navItems: AdminNavItem[]
}
