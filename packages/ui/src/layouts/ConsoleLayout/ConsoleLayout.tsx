'use client'

import {
  BellIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
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
    <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:rounded-md">
        <SparklesIcon className="size-4" />
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate font-heading text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{tagline}</p>
      </div>
    </div>
  )
}

function NavigationGroup({
  groups,
  LinkComponent,
}: {
  groups: ConsoleLayoutNavGroup[]
  LinkComponent?: ConsoleLayoutProps['LinkComponent']
}) {
  const LinkEl = (LinkComponent ?? 'a') as React.ElementType

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
                  <LinkEl href={item.href}>
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </LinkEl>
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
    <div className="relative w-full max-w-xl">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="h-9 rounded-lg pl-9 pr-12 text-sm" placeholder={placeholder} />
      <div className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 sm:block">
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
  LinkComponent,
  profileHref = '#profile',
  settingsHref = '#settings',
  onLogout,
}: ConsoleLayoutProps) {
  const LinkEl = (LinkComponent ?? 'a') as React.ElementType

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
          <SidebarHeader>
            <BrandBlock name={brand.name} tagline={brand.tagline} />
          </SidebarHeader>
          <SidebarContent>
            <NavigationGroup groups={navigation} LinkComponent={LinkComponent} />
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
              <Avatar size="sm">
                <AvatarFallback>{account.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">{account.name}</p>
                <p className="truncate text-xs text-muted-foreground">{account.email}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-h-screen bg-transparent">
          <header className="sticky top-0 z-20 border-b bg-background">
            <div className="flex h-12 items-center gap-2 px-4">
              <SidebarTrigger />
              <div
                data-orientation="vertical"
                role="none"
                className="shrink-0 bg-border w-px h-5"
              />
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-semibold">{title}</h1>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-64">
                  <HeaderSearch placeholder={searchPlaceholder} />
                </div>
                {headerActions}
                <Button variant="ghost" size="icon-sm" className="rounded-lg">
                  <BellIcon className="size-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-lg p-0">
                      <Avatar size="sm">
                        <AvatarFallback>{account.initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col gap-0.5">
                      <span className="font-medium">{account.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {account.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LinkEl href={profileHref} className="flex items-center gap-2">
                        <UserIcon className="size-4" />
                        Profile
                      </LinkEl>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <LinkEl href={settingsHref} className="flex items-center gap-2">
                        <SettingsIcon className="size-4" />
                        Settings
                      </LinkEl>
                    </DropdownMenuItem>
                    {onLogout && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={onLogout}
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                          <LogOutIcon className="size-4" />
                          Log out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className={cn('mx-auto w-full max-w-384')}>{children}</div>
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
