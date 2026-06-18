'use client'

import type { SettingsSectionId } from '@interviewos/types'
import type { SettingsPageProps } from '@interviewos/ui'
import { SettingsPage } from '@interviewos/ui'
import { useState } from 'react'

export function SettingsContainer({ data }: Pick<SettingsPageProps, 'data'>) {
  const [activeSectionId, setActiveSectionId] = useState<SettingsSectionId>('profile')

  return (
    <SettingsPage
      data={data}
      activeSectionId={activeSectionId}
      onSectionChange={setActiveSectionId}
    />
  )
}
