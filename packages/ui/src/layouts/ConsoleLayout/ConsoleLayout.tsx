import { BellIcon, SearchIcon, SparklesIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Kbd } from '../../../components/ui/kbd'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '../../../components/ui/sidebar'
import { cn } from '../../../lib/utils'
import { CONSOLE_LAYOUT_SEARCH_SHORTCUT } from './ConsoleLayout.constants'
import {
  consoleLayoutAccountFixture,
  consoleLayoutBrandFixture,
  consoleLayoutNavigationFixture,
} from './ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup, ConsoleLayoutProps } from './ConsoleLayout.types'

function BrandBlock({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <SparklesIcon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-heading text-base font-semibold">{name}</p>
        <p className="truncate text-sm text-muted-foreground">{tagline}</p>
      </div>
    </div>
  )
}

function NavigationGroup({ groups }: { groups: ConsoleLayoutNavGroup[] }) {
  return groups.map((group) => (
    <SidebarGroup key={group.label}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.label} size="lg">
                  <a href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))
}

function HeaderSearch({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="h-10 rounded-xl pl-9 pr-14" placeholder={placeholder} />
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
        <Kbd>{`Ctrl ${CONSOLE_LAYOUT_SEARCH_SHORTCUT}`}</Kbd>
      </div>
    </div>
  )
}

function Root({
  title,
  children,
  brand = consoleLayoutBrandFixture,
  navigation = consoleLayoutNavigationFixture,
  account = consoleLayoutAccountFixture,
  searchPlaceholder = 'Search or jump to...',
  headerActions,
}: ConsoleLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
          <SidebarHeader>
            <BrandBlock name={brand.name} tagline={brand.tagline} />
          </SidebarHeader>
          <SidebarContent>
            <NavigationGroup groups={navigation} />
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <Avatar size="sm">
                <AvatarFallback>{account.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">{account.name}</p>
                <p className="truncate text-sm text-muted-foreground">{account.email}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-h-screen bg-background">
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex min-h-18 items-center gap-3 px-4 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger />
                <div className="hidden h-6 w-px bg-border md:block" />
                <h1 className="truncate font-heading text-xl font-semibold">{title}</h1>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <HeaderSearch placeholder={searchPlaceholder} />
                {headerActions}
                <Button variant="ghost" size="icon-sm" className="rounded-full">
                  <BellIcon />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Avatar>
                  <AvatarFallback>{account.initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className={cn('px-4 py-6 md:px-8 md:py-8')}>{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

const ConsoleLayout = Object.assign(Root, {
  BrandBlock,
  HeaderSearch,
  NavigationGroup,
})

export default ConsoleLayout
