import { BrainCircuitIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react'

import { StatCard } from '../../../../components/ui/page'
import { SECTION_ICONS } from '../SettingsPage.constants'
import type { SettingsPageProps, SettingsPageSection } from '../SettingsPage.types'

function SettingsHighlights({
  data,
  activeSection,
}: {
  data: NonNullable<SettingsPageProps['data']>
  activeSection: SettingsPageSection
}) {
  const activeSectionIndex = data.sections.findIndex((s) => s.id === activeSection.id) + 1
  const toggleCount = activeSection.fields.filter((f) => f.kind === 'toggle').length

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Workspace areas"
        value={data.sections.length}
        hint="Settings categories available right now."
        icon={ShieldCheckIcon}
      />
      <StatCard
        label="Current section"
        value={`${activeSectionIndex}/${data.sections.length}`}
        hint={activeSection.label}
        icon={SECTION_ICONS[activeSection.id]}
      />
      <StatCard
        label="Fields in view"
        value={activeSection.fields.length}
        hint="Inputs, toggles, and account actions in this section."
        icon={SparklesIcon}
      />
      <StatCard
        label="Quick toggles"
        value={toggleCount}
        hint={
          toggleCount > 0
            ? 'Behaviour defaults you can switch instantly.'
            : 'This section has no toggles.'
        }
        icon={BrainCircuitIcon}
      />
    </div>
  )
}

export { SettingsHighlights }
