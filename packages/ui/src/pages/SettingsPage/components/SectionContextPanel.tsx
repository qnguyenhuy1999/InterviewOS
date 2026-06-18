import type { SettingsSectionId } from '@interviewos/types'

import { SettingsSectionNav } from '../../../organisms/SettingsSectionNav/SettingsSectionNav'
import { SECTION_ICONS } from '../SettingsPage.constants'
import type { SettingsPageProps, SettingsPageSection } from '../SettingsPage.types'

function SectionContextPanel({
  data,
  activeSection,
  onSectionChange,
}: {
  data: NonNullable<SettingsPageProps['data']>
  activeSection: SettingsPageSection
  onSectionChange?: (id: SettingsSectionId) => void
}) {
  const Icon = SECTION_ICONS[activeSection.id]

  return (
    <div className="space-y-3 xl:sticky xl:top-24">
      <div className="rounded-lg border border-primary/20 bg-accent-soft p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Active section
          </p>
        </div>
        <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {activeSection.title}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeSection.description}</p>
      </div>

      <div className="rounded-lg border border-border/80 bg-card p-2">
        <SettingsSectionNav
          sections={data.sections}
          activeSectionId={activeSection.id}
          iconMap={SECTION_ICONS}
          onSectionChange={onSectionChange}
        />
      </div>
    </div>
  )
}

export { SectionContextPanel }
