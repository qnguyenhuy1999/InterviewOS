'use client'

import type { SettingsSectionId } from '@interviewos/types'
import type { SettingsPageProps } from '@interviewos/ui'
import { SettingsPage } from '@interviewos/ui'
import { useState } from 'react'

export function SettingsContainer({
  data,
  retryHref,
}: Pick<SettingsPageProps, 'data' | 'retryHref'>) {
  const [activeSectionId, setActiveSectionId] = useState<SettingsSectionId>('profile')

  return (
    <SettingsPage
      data={data}
      retryHref={retryHref}
      activeSectionId={activeSectionId}
      onSectionChange={setActiveSectionId}
    />
  )
}
