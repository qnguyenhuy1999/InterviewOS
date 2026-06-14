import type * as React from 'react'

export type InterviewStartPageProps = {
  title?: string
  description?: string
  modeLabel: string
  children?: React.ReactNode
  backHref?: string
  errorMessage?: string
}
