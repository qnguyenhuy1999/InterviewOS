import { BookOpenIcon, LayoutGridIcon, ListIcon, PlusIcon, SearchIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { EmptyState, PageHeader } from '../../../components/ui/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { DifficultyBadge, StatusDot } from '../../../components/ui/status'
import { cn } from '../../../lib/utils'
import ConsoleLayout from '../../layouts/ConsoleLayout'
import { NOTEBOOK_STATUS_OPTIONS, NOTEBOOK_TYPE_OPTIONS } from './NotebookPage.constants'
import { notebookFixture } from './NotebookPage.fixtures'
import type {
  NotebookPageFilterValue,
  NotebookPageNote,
  NotebookPageProps,
  NotebookPageView,
} from './NotebookPage.types'
import {
  getDifficultyTone,
  getEnumLabel,
  getNotebookNavigation,
  getNotebookSummary,
  getNotebookTopicOptions,
  getRelativeUpdatedAtLabel,
  getStatusDot,
  getVisibleNotebookNotes,
  isSelectedFilter,
} from './NotebookPage.utils'

function FilterSelect<T extends string>({
  value,
  options,
  placeholder,
  getLabel = getEnumLabel,
}: {
  value: NotebookPageFilterValue<T> | string | undefined
  options: readonly NotebookPageFilterValue<T>[]
  placeholder: string
  getLabel?: (value: T) => string
}) {
  return (
    <Select value={value ?? 'ALL'}>
      <SelectTrigger className="w-full min-w-40 bg-card md:w-44">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option === 'ALL' ? placeholder : getLabel(option as T)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function NotebookCard({ note, view }: { note: NotebookPageNote; view: NotebookPageView }) {
  const topicLabel = note.topic?.trim() || getEnumLabel(note.type)

  return (
    <Card
      className={cn(
        'gap-0 border border-border/80 py-0 transition-colors hover:border-primary/25',
        view === 'list' && 'md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center',
      )}
    >
      <CardHeader className="gap-3 border-b py-4 md:border-b-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {topicLabel}
            </p>
            <CardTitle className="mt-2 text-lg font-semibold tracking-tight">
              {note.title}
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {getNotebookSummary(note)}
            </p>
          </div>
          <DifficultyBadge difficulty={getDifficultyTone(note.difficulty)} className="shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <StatusDot status={getStatusDot(note.status)} />
          <span>{getEnumLabel(note.status)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{note.questionCount} Q</span>
          <span>{getRelativeUpdatedAtLabel(note.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterBar({
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  topicOptions,
  view,
}: {
  searchValue?: string
  selectedTopic?: string | 'ALL'
  selectedStatus?: NotebookPageFilterValue<import('@interviewos/types').NoteStatus>
  selectedType?: NotebookPageFilterValue<import('@interviewos/types').NoteType>
  topicOptions: readonly string[]
  view: NotebookPageView
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="grid gap-3 md:flex md:flex-1 md:flex-wrap">
        <label className="relative block md:min-w-80 md:flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue ?? ''}
            readOnly
            placeholder="Search notes..."
            className="h-10 rounded-xl bg-card pl-9"
          />
        </label>
        <FilterSelect
          value={selectedTopic}
          options={topicOptions}
          placeholder="All topics"
          getLabel={(value) => value}
        />
        <FilterSelect
          value={selectedStatus}
          options={NOTEBOOK_STATUS_OPTIONS}
          placeholder="All statuses"
        />
        <FilterSelect
          value={selectedType}
          options={NOTEBOOK_TYPE_OPTIONS}
          placeholder="All types"
        />
      </div>

      <div className="inline-flex items-center self-end rounded-xl border border-border bg-card p-1">
        <Button
          variant={view === 'grid' ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="rounded-lg"
          aria-pressed={view === 'grid'}
        >
          <LayoutGridIcon />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={view === 'list' ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="rounded-lg"
          aria-pressed={view === 'list'}
        >
          <ListIcon />
          <span className="sr-only">List view</span>
        </Button>
      </div>
    </div>
  )
}

function NotebookBody({
  notes,
  empty,
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  view = 'grid',
}: NotebookPageProps) {
  const sourceNotes = notes ?? notebookFixture.notes
  const visibleNotes = getVisibleNotebookNotes({
    notes: sourceNotes,
    empty,
    searchValue,
    selectedTopic,
    selectedStatus,
    selectedType,
  })
  const topicOptions = getNotebookTopicOptions(sourceNotes)

  if (empty) {
    return (
      <EmptyState
        className="min-h-96"
        icon={BookOpenIcon}
        title="No notes yet"
        description="Create your first note to start building your interview knowledge base."
        action={
          <Button>
            <PlusIcon />
            Create note
          </Button>
        }
      />
    )
  }

  if (visibleNotes.length === 0) {
    return (
      <div className="space-y-6">
        <FilterBar
          searchValue={searchValue}
          selectedTopic={selectedTopic}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          topicOptions={topicOptions}
          view={view}
        />
        <EmptyState
          className="min-h-80"
          title="No notes match these filters"
          description="Try a broader search, switch the topic, or clear the status filter."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={searchValue}
        selectedTopic={selectedTopic}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        topicOptions={topicOptions}
        view={view}
      />
      <div
        className={cn(
          'grid gap-4',
          view === 'grid' ? 'xl:grid-cols-3 md:grid-cols-2' : 'grid-cols-1',
        )}
      >
        {visibleNotes.map((note) => (
          <NotebookCard key={note.id} note={note} view={view} />
        ))}
      </div>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:flex md:flex-wrap">
        <div className="h-10 rounded-xl border border-border bg-card md:min-w-80 md:flex-1" />
        <div className="h-10 rounded-xl border border-border bg-card md:w-44" />
        <div className="h-10 rounded-xl border border-border bg-card md:w-44" />
        <div className="h-10 rounded-xl border border-border bg-card md:w-44" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="gap-0 border border-border/80 py-0">
            <CardHeader className="border-b py-4">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="mt-3 h-5 w-3/4 rounded bg-muted" />
              <div className="mt-3 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
            </CardHeader>
            <CardContent className="flex items-center justify-between py-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load notebook</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root(props: NotebookPageProps) {
  const activeNotes = props.notes ?? notebookFixture.notes
  const readyCount = activeNotes.filter((note) =>
    isSelectedFilter(props.selectedStatus, 'ALL')
      ? note.status === 'INTERVIEW_READY'
      : note.status === props.selectedStatus,
  ).length

  return (
    <ConsoleLayout
      title="Notebook"
      navigation={getNotebookNavigation()}
      headerActions={
        <Button className="hidden rounded-xl px-4 md:inline-flex">
          <PlusIcon />
          New note
        </Button>
      }
    >
      <div className="space-y-6">
        <PageHeader
          title="Notebook"
          description="Your technical notes, organized by topic. Generate interview questions from any note."
          actions={
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                {readyCount} ready for practice
              </div>
              <Button className="rounded-xl md:hidden">
                <PlusIcon />
                New note
              </Button>
            </div>
          }
        />

        {props.error ? (
          <ErrorBody message={props.error} />
        ) : props.loading ? (
          <LoadingBody />
        ) : (
          <NotebookBody {...props} />
        )}
      </div>
    </ConsoleLayout>
  )
}

const NotebookPage = Object.assign(Root, {
  FilterBar,
  NotebookCard,
})

export default NotebookPage
