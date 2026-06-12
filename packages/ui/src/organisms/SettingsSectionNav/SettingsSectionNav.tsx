import type { SettingsSectionId, SettingsSectionView } from '@interviewos/types'
import type * as React from 'react'

import { cn } from '../../../lib/utils'

type SettingsSectionNavProps = {
  sections: SettingsSectionView[]
  activeSectionId: SettingsSectionId
  iconMap: Record<SettingsSectionId, React.ComponentType<{ className?: string }>>
  onSectionChange?: (sectionId: SettingsSectionId) => void
}

function SettingsSectionNav({
  sections,
  activeSectionId,
  iconMap,
  onSectionChange,
}: SettingsSectionNavProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      {sections.map((section) => {
        const Icon = iconMap[section.id]
        const isActive = section.id === activeSectionId

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange?.(section.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
              isActive
                ? 'bg-primary font-medium text-muted'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{section.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export { SettingsSectionNav }
