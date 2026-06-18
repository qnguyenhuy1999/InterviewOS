import type { SettingsSectionId } from '@interviewos/types'

import { EmptyState } from '../../../../components/ui/page'
import type { SettingsPageProps } from '../SettingsPage.types'
import { SectionCard } from './SectionCard'
import { SectionContextPanel } from './SectionContextPanel'
import { SettingsHighlights } from './SettingsHighlights'

function SettingsBody({
  data,
  activeSectionId,
  onSectionChange,
}: {
  data: NonNullable<SettingsPageProps['data']>
  activeSectionId: SettingsSectionId
  onSectionChange?: (sectionId: SettingsSectionId) => void
}) {
  const activeSection = data.sections.find((s) => s.id === activeSectionId) ?? data.sections[0]

  if (!activeSection) {
    return (
      <EmptyState
        className="min-h-80"
        title="No settings available"
        description="Connect a settings source to populate this page."
      />
    )
  }

  return (
    <div className="space-y-5">
      <SettingsHighlights data={data} activeSection={activeSection} />

      <div className="grid gap-5 xl:grid-cols-4 xl:items-start">
        <SectionContextPanel
          data={data}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <div className="xl:col-span-3">
          <SectionCard section={activeSection} />
        </div>
      </div>
    </div>
  )
}

export { SettingsBody }
