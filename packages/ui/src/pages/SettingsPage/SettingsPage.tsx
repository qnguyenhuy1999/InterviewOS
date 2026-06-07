import type { SettingsActionIntent, SettingsFieldView, SettingsSectionId } from '@interviewos/types'
import {
  BrainCircuitIcon,
  LanguagesIcon,
  MicIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import type * as React from 'react'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { EmptyState, PageHeader, StatCard } from '../../../components/ui/page'
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
import { FieldLabel } from '../../atoms/FieldLabel/FieldLabel'
import { SettingsSectionNav } from '../../organisms/SettingsSectionNav/SettingsSectionNav'
import { settingsPageFixture } from './SettingsPage.fixtures'
import type { SettingsPageProps, SettingsPageSection } from './SettingsPage.types'

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

function SettingsHighlights({
  data,
  activeSection,
}: {
  data: NonNullable<SettingsPageProps['data']>
  activeSection: SettingsPageSection
}) {
  const activeSectionIndex = data.sections.findIndex((section) => section.id === activeSection.id) + 1
  const toggleCount = activeSection.fields.filter((field) => field.kind === 'toggle').length

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
        icon={settingsSectionIcons[activeSection.id]}
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
        hint={toggleCount > 0 ? 'Behavior defaults you can switch instantly.' : 'This section is mostly static values.'}
        icon={BrainCircuitIcon}
      />
    </div>
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
    <div className="space-y-6">
      <SettingsHighlights data={data} activeSection={activeSection} />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <div className="space-y-4 xl:sticky xl:top-24">
          <div className="rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary),white_92%)_0%,white_100%)] p-5 shadow-[0_20px_60px_-38px_color-mix(in_oklch,var(--primary),transparent_40%)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
              Active section
            </p>
            <p className="mt-3 font-heading text-2xl font-semibold tracking-tight">
              {activeSection.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {activeSection.description}
            </p>
          </div>
          <div className="rounded-3xl border border-border/80 bg-card p-3 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.32)]">
            <SettingsSectionNav
              sections={data.sections}
              activeSectionId={activeSection.id}
              iconMap={settingsSectionIcons}
              onSectionChange={onSectionChange}
            />
          </div>
        </div>

        <SectionCard section={activeSection} />
      </div>
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
    <>
      <PageHeader title={data.title} description={data.subtitle} />
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
    </>
  )
}

const SettingsPage = Object.assign(Root, {
  SectionCard,
  SectionNav: SettingsSectionNav,
})

export default SettingsPage
