import type * as React from 'react'

export type ReviewLayoutProps = {
  topBar: React.ReactNode
  videoPanel: React.ReactNode
  transcriptPanel: React.ReactNode
  sidePanel: React.ReactNode
  defaultTranscriptWidth?: number
}
