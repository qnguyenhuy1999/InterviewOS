import type * as React from 'react'

export type SetupStepStatus = 'pending' | 'current' | 'completed'

export type SetupStep = {
  id: string
  label: string
  status: SetupStepStatus
}

export type SetupLayoutProps = {
  steps: SetupStep[]
  currentStep: string
  children: React.ReactNode
  footer?: React.ReactNode
}
