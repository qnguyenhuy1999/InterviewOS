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
    <nav className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = iconMap[section.id]
        const isActive = section.id === activeSectionId

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange?.(section.id)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base transition-colors',
              isActive
                ? 'bg-primary font-medium text-muted'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span>{section.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export { SettingsSectionNav }
