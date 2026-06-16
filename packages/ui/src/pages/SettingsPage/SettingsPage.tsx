'use client'

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
import { EmptyState, PageBody, PageHeader, StatCard } from '../../../components/ui/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Switch } from '../../../components/ui/switch'
import { cn } from '../../../lib/utils'
import { FieldLabel } from '../../atoms/FieldLabel/FieldLabel'
import { Spinner } from '../../atoms/Spinner'
import { SettingsSectionNav } from '../../organisms/SettingsSectionNav/SettingsSectionNav'
import { settingsPageFixture } from './SettingsPage.fixtures'
import type { SettingsPageProps, SettingsPageSection } from './SettingsPage.types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_ICONS: Record<SettingsSectionId, React.ComponentType<{ className?: string }>> = {
  profile: UserIcon,
  learning_preferences: BrainCircuitIcon,
  english_level: LanguagesIcon,
  interview_preferences: MicIcon,
  ai_provider: SparklesIcon,
  account: ShieldIcon,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getActionVariant(intent: SettingsActionIntent): 'default' | 'outline' | 'destructive' {
  if (intent === 'primary') return 'default'
  if (intent === 'destructive') return 'destructive'
  return 'outline'
}

// ─── FieldControl ─────────────────────────────────────────────────────────────

function FieldControl({ field }: { field: SettingsFieldView }) {
  if (field.kind === 'input') {
    return (
      <Input
        value={field.value}
        onChange={() => {}}
        type={field.inputType}
        className="h-10 rounded-lg bg-card px-4 shadow-xs"
      />
    )
  }

  if (field.kind === 'select') {
    return (
      <Select value={field.value} onValueChange={() => {}}>
        <SelectTrigger className="h-10 w-full rounded-lg bg-card px-4 text-left shadow-xs">
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
    return <Switch checked={field.checked} onCheckedChange={() => {}} />
  }

  if (field.kind === 'value') {
    return (
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{field.value}</p>
    )
  }

  // kind === 'actions'
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {field.actions.map((action) => (
        <Button key={action.id} variant={getActionVariant(action.intent)} size="sm">
          {action.label}
        </Button>
      ))}
    </div>
  )
}

// ─── SectionFieldRow ──────────────────────────────────────────────────────────

function SectionFieldRow({ field }: { field: SettingsFieldView }) {
  const isToggle = field.kind === 'toggle'
  const isValue = field.kind === 'value'
  const isActions = field.kind === 'actions'

  return (
    <div
      className={cn(
        'grid gap-4 py-5 md:grid-cols-3 md:gap-6',
        (isValue || isActions) && 'md:items-center',
      )}
    >
      <FieldLabel label={field.label} description={field.description} />
      <div
        className={cn(
          'min-w-0',
          !isToggle && !isActions && 'md:col-span-2',
          isToggle && 'flex items-center',
          isActions && 'justify-self-start',
        )}
      >
        <FieldControl field={field} />
      </div>
    </div>
  )
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: SettingsPageSection }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="font-heading text-lg font-semibold">{section.title}</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-2">
        <div className="divide-y divide-border">
          {section.fields.map((field) => (
            <SectionFieldRow key={field.id} field={field} />
          ))}
        </div>

        {section.footerActions?.length ? (
          <>
            <Separator className="mt-2" />
            <div className="flex flex-wrap items-center justify-end gap-2.5 py-4">
              {section.footerActions.map((action) => (
                <Button
                  key={action.id}
                  variant={getActionVariant(action.intent)}
                  size="sm"
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

// ─── SettingsHighlights ───────────────────────────────────────────────────────

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

// ─── SectionContextPanel ──────────────────────────────────────────────────────
// Sidebar panel: section title/description + nav list.

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
      {/* Active section context */}
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

      {/* Section nav */}
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

// ─── SettingsBody ─────────────────────────────────────────────────────────────

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

// ─── LoadingBody ──────────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="space-y-5">
      {/* Stat card skeletons */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-4 xl:items-start">
        {/* Sidebar skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-lg" />
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Section card skeleton */}
        <Card className="min-h-96 items-center justify-center xl:col-span-3">
          <Spinner size="lg" />
        </Card>
      </div>
    </div>
  )
}

// ─── ErrorBody ────────────────────────────────────────────────────────────────

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load settings</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

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

      <PageBody>
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
      </PageBody>

      <Separator className="mt-8 opacity-0" />
    </>
  )
}

const SettingsPage = Object.assign(Root, {
  SectionCard,
  SectionNav: SettingsSectionNav,
})

export default SettingsPage
