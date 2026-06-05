import { consoleLayoutNavigationFixture } from '../../layouts/ConsoleLayout/ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup } from '../../layouts/ConsoleLayout/ConsoleLayout.types'

export function getProfileNavigation(): ConsoleLayoutNavGroup[] {
  return consoleLayoutNavigationFixture.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.label === 'Profile',
    })),
  }))
}

export function getProfileVerifiedBadgeClassName(isVerified: boolean) {
  return isVerified
    ? 'border-primary/20 bg-primary/5 text-primary'
    : 'border-border text-muted-foreground'
}

export function getProfileAcceptedFileLabel(fileTypes: string[], maxFileSizeMb: number) {
  return `${fileTypes.join(' or ')}, up to ${maxFileSizeMb}MB`
}
