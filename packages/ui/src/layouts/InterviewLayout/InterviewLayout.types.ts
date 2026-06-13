import type * as React from 'react'

export type InterviewLayoutProps = {
  topBar: React.ReactNode
  leftPanel: React.ReactNode
  centerPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultLeftWidth?: number
  defaultRightWidth?: number
}
