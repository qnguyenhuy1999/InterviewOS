import type { SettingsActionIntent, SettingsFieldView, SettingsSectionId } from '@interviewos/types'
import {
  BrainCircuitIcon,
  LanguagesIcon,
  MicIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import type * as React from 'react'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { EmptyState } from '../../../components/ui/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { Switch } from '../../../components/ui/switch'
import { cn } from '../../../lib/utils'
import ConsoleLayout from '../../layouts/ConsoleLayout'
import { consoleLayoutNavigationFixture } from '../../layouts/ConsoleLayout/ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup } from '../../layouts/ConsoleLayout/ConsoleLayout.types'
import { settingsPageFixture } from './SettingsPage.fixtures'
import type { SettingsPageProps, SettingsPageSection } from './SettingsPage.types'

const settingsNavigationFixture: ConsoleLayoutNavGroup[] = consoleLayoutNavigationFixture.map(
  (group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.label === 'Settings',
    })),
  }),
)

const settingsSectionIcons: Record<
  SettingsSectionId,
  React.ComponentType<{ className?: string }>
> = {
  profile: UserIcon,
  learning_preferences: BrainCircuitIcon,
  english_level: LanguagesIcon,
  interview_preferences: MicIcon,
  ai_provider: SparklesIcon,
  account: ShieldIcon,
}

function getActionVariant(intent: SettingsActionIntent): 'default' | 'outline' | 'destructive' {
  if (intent === 'primary') {
    return 'default'
  }

  if (intent === 'destructive') {
    return 'destructive'
  }

  return 'outline'
}

function SectionNav({
  sections,
  activeSectionId,
  onSectionChange,
}: {
  sections: SettingsPageSection[]
  activeSectionId: SettingsSectionId
  onSectionChange?: (sectionId: SettingsSectionId) => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = settingsSectionIcons[section.id]
        const isActive = section.id === activeSectionId

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange?.(section.id)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base transition-colors',
              isActive
                ? 'bg-accent font-medium text-foreground'
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

function FieldLabel({ label, description }: { label: string; description?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-base font-medium text-foreground">{label}</p>
      {description ? <p className="max-w-xs text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}

function FieldControl({ field }: { field: SettingsFieldView }) {
  if (field.kind === 'input') {
    return (
      <Input
        value={field.value}
        onChange={() => {}}
        type={field.inputType}
        className="h-11 rounded-xl bg-card px-4 text-base shadow-xs"
      />
    )
  }

  if (field.kind === 'select') {
    return (
      <Select value={field.value} onValueChange={() => {}}>
        <SelectTrigger className="h-11 w-full rounded-xl bg-card px-4 text-left text-base shadow-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (field.kind === 'toggle') {
    return <Switch checked={field.checked} onCheckedChange={() => {}} className="mt-1" />
  }

  if (field.kind === 'value') {
    return <p className="text-xl font-medium text-foreground">{field.value}</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {field.actions.map((action) => (
        <Button key={action.id} variant={getActionVariant(action.intent)} size="lg">
          {action.label}
        </Button>
      ))}
    </div>
  )
}

function SectionFieldRow({ field }: { field: SettingsFieldView }) {
  const isToggle = field.kind === 'toggle'
  const isValue = field.kind === 'value'
  const isActions = field.kind === 'actions'

  return (
    <div
      className={cn(
        'grid gap-4 py-5 md:grid-cols-[240px_minmax(0,1fr)] md:gap-6',
        isToggle && 'md:grid-cols-[240px_auto]',
        (isValue || isActions) && 'md:items-center',
      )}
    >
      <FieldLabel label={field.label} description={field.description} />
      <div
        className={cn(
          'min-w-0',
          isToggle && 'flex items-start',
          isActions && 'justify-self-start',
        )}
      >
        <FieldControl field={field} />
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: SettingsPageSection }) {
  return (
    <Card className="gap-0 rounded-2xl py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{section.description}</p>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="divide-y">
          {section.fields.map((field) => (
            <SectionFieldRow key={field.id} field={field} />
          ))}
        </div>
        {section.footerActions?.length ? (
          <>
            <Separator />
            <div className="flex flex-wrap items-center justify-end gap-3 pt-5 pb-2">
              {section.footerActions.map((action) => (
                <Button
                  key={action.id}
                  variant={getActionVariant(action.intent)}
                  size="lg"
                  className={cn(action.intent === 'secondary' && 'border-transparent shadow-none')}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function SettingsBody({
  data,
  activeSectionId,
  onSectionChange,
}: {
  data: NonNullable<SettingsPageProps['data']>
  activeSectionId: SettingsSectionId
  onSectionChange?: (sectionId: SettingsSectionId) => void
}) {
  const activeSection =
    data.sections.find((section) => section.id === activeSectionId) ?? data.sections[0]

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
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
      <SectionNav
        sections={data.sections}
        activeSectionId={activeSection.id}
        onSectionChange={onSectionChange}
      />
      <SectionCard section={activeSection} />
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
      <Card className="min-h-96 items-center justify-center rounded-2xl">
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load settings</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root({
  data = settingsPageFixture,
  activeSectionId = 'profile',
  loading,
  empty,
  error,
  onSectionChange,
}: SettingsPageProps) {
  return (
    <ConsoleLayout title={data.title} navigation={settingsNavigationFixture}>
      <div className="mb-6 border-b pb-6">
        <h2 className="font-heading text-4xl font-semibold tracking-tight">{data.title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{data.subtitle}</p>
      </div>
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : empty || data.sections.length === 0 ? (
        <EmptyState
          className="min-h-80"
          title="No settings available"
          description="Add settings sections to start configuring your workspace."
        />
      ) : (
        <SettingsBody
          data={data}
          activeSectionId={activeSectionId}
          onSectionChange={onSectionChange}
        />
      )}
      <Separator className="mt-8 opacity-0" />
    </ConsoleLayout>
  )
}

const SettingsPage = Object.assign(Root, {
  SectionCard,
  SectionNav,
})

export default SettingsPage
