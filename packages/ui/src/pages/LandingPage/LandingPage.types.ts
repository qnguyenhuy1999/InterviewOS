import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'

export type LandingPageFeature = {
  icon: LucideIcon
  title: string
  description: string
}

export type LandingPageStat = {
  value: string
  label: string
}

export type LandingPageProps = {
  eyebrow?: string
  headline?: React.ReactNode
  description?: string
  signInHref?: string
  getStartedHref?: string
  features?: readonly LandingPageFeature[]
  stats?: readonly LandingPageStat[]
}
