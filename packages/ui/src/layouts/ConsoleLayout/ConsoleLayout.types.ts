import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'

export type ConsoleLayoutBrand = {
  name: string
  tagline: string
}

export type ConsoleLayoutAccount = {
  name: string
  email: string
  initials: string
}

export type ConsoleLayoutNavItem = {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export type ConsoleLayoutNavGroup = {
  label: string
  items: ConsoleLayoutNavItem[]
}

export type ConsoleLayoutProps = {
  title: React.ReactNode
  children: React.ReactNode
  brand?: ConsoleLayoutBrand
  account?: ConsoleLayoutAccount
  navigation?: ConsoleLayoutNavGroup[]
  searchPlaceholder?: string
  headerActions?: React.ReactNode
}
