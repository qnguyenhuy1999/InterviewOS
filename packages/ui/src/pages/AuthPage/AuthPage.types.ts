import type * as React from 'react'

export type AuthPageFeature = {
  title: string
  description: string
}

export type AuthPageHighlight = {
  label: string
  value: string
  detail: string
}

export type AuthPageProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
  brandLabel?: string
  reassurance?: string
  features?: AuthPageFeature[]
  highlights?: AuthPageHighlight[]
}
