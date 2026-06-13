import {
  BarChartIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'
import type { AdminDashboardPageProps } from './AdminDashboardPage.types'

export const adminDashboardPageFixture: AdminDashboardPageProps = {
  navItems: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboardIcon, isActive: true },
    { label: 'Candidates', href: '/admin/candidates', icon: UsersIcon },
    { label: 'Interviews', href: '/admin/interviews', icon: CalendarIcon },
    { label: 'Reports', href: '/admin/reports', icon: BarChartIcon },
    { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ],
}
