import { NoteStatus } from '@interviewos/types'
import { BookOpenIcon, LayoutGridIcon, ListIcon, PlusIcon, SearchIcon } from 'lucide-react'

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
import { DifficultyBadge, StatusDot } from '../../../components/ui/status'
import { cn } from '../../../lib/utils'
import { NOTEBOOK_STATUS_OPTIONS, NOTEBOOK_TYPE_OPTIONS } from './NotebookPage.constants'
import type {
  NotebookPageFilterValue,
  NotebookPageNote,
  NotebookPageProps,
  NotebookPageView,
} from './NotebookPage.types'
import {
  getDifficultyTone,
  getEnumLabel,
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
  getLabel,
  onValueChange,
}: {
  value: NotebookPageFilterValue<T> | string | undefined
  options: readonly NotebookPageFilterValue<T>[]
  placeholder: string
  getLabel: (value: T) => string
  onValueChange?: (value: NotebookPageFilterValue<T>) => void
}) {
  return (
    <Select
      value={value ?? 'ALL'}
      onValueChange={(next) => onValueChange?.(next as NotebookPageFilterValue<T>)}
    >
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

function NotebookCard({
  note,
  view,
  noteHref,
}: {
  note: NotebookPageNote
  view: NotebookPageView
  noteHref: string
}) {
  const topicLabel = note.topic?.trim() || getEnumLabel(note.type)

  return (
    <Card
      className={cn(
        'gap-0 border border-border/80 bg-[linear-gradient(180deg,white_0%,color-mix(in_oklch,var(--muted),white_58%)_100%)] py-0 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_60px_-40px_color-mix(in_oklch,var(--primary),transparent_45%)]',
        view === 'list' && 'md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center',
      )}
    >
      <CardHeader className="gap-3 border-b py-4 md:border-b-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{topicLabel}</p>
            <CardTitle className="mt-2 text-lg font-semibold tracking-tight">
              <a href={noteHref} className="hover:underline">
                {note.title}
              </a>
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

function NotebookHighlights({ notes }: { notes: NotebookPageNote[] }) {
  const readyCount = notes.filter((note) => note.status === NoteStatus.INTERVIEW_READY).length
  const draftCount = notes.filter((note) => note.status === NoteStatus.DRAFT).length
  const uniqueTopicCount = new Set(
    notes.map((note) => note.topic?.trim() || getEnumLabel(note.type)),
  ).size
  const totalQuestions = notes.reduce((total, note) => total + note.questionCount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Notes captured"
        value={notes.length}
        hint="Technical, behavioral, and system-design note entries."
        icon={BookOpenIcon}
      />
      <StatCard
        label="Ready to practice"
        value={readyCount}
        hint="Notes already shaped for interview drills."
        icon={LayoutGridIcon}
      />
      <StatCard
        label="Topics covered"
        value={uniqueTopicCount}
        hint="Distinct areas represented in your notebook."
        icon={ListIcon}
      />
      <StatCard
        label="Draft backlog"
        value={draftCount}
        hint={`${totalQuestions} generated questions already attached across the notebook.`}
        icon={PlusIcon}
      />
    </div>
  )
}

function FilterBar({
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  topicOptions,
  view,
  onSearchValueChange,
  onSelectedTopicChange,
  onSelectedStatusChange,
  onSelectedTypeChange,
  onViewChange,
  onClearFilters,
}: {
  searchValue?: string
  selectedTopic?: string | 'ALL'
  selectedStatus?: NotebookPageFilterValue<import('@interviewos/types').NoteStatus>
  selectedType?: NotebookPageFilterValue<import('@interviewos/types').NoteType>
  topicOptions: readonly string[]
  view: NotebookPageView
  onSearchValueChange?: NotebookPageProps['onSearchValueChange']
  onSelectedTopicChange?: NotebookPageProps['onSelectedTopicChange']
  onSelectedStatusChange?: NotebookPageProps['onSelectedStatusChange']
  onSelectedTypeChange?: NotebookPageProps['onSelectedTypeChange']
  onViewChange?: NotebookPageProps['onViewChange']
  onClearFilters?: NotebookPageProps['onClearFilters']
}) {
  const needsPracticeActive = selectedStatus === NoteStatus.NEEDS_PRACTICE
  const hasActiveFilters =
    (searchValue?.trim().length ?? 0) > 0 ||
    (selectedTopic ?? 'ALL') !== 'ALL' ||
    (selectedStatus ?? 'ALL') !== 'ALL' ||
    (selectedType ?? 'ALL') !== 'ALL'

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="grid gap-3 md:flex md:flex-1 md:flex-wrap">
        <label className="relative block md:min-w-80 md:flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue ?? ''}
            onChange={(event) => onSearchValueChange?.(event.target.value)}
            placeholder="Search notes..."
            className="h-10 rounded-xl bg-card pl-9"
          />
        </label>
        <FilterSelect
          value={selectedTopic}
          options={topicOptions}
          placeholder="All topics"
          getLabel={(value) => value}
          onValueChange={(value) => onSelectedTopicChange?.(value)}
        />
        <FilterSelect
          value={selectedStatus}
          options={NOTEBOOK_STATUS_OPTIONS}
          placeholder="All statuses"
          getLabel={getEnumLabel}
          onValueChange={onSelectedStatusChange}
        />
        <FilterSelect
          value={selectedType}
          options={NOTEBOOK_TYPE_OPTIONS}
          placeholder="All types"
          getLabel={getEnumLabel}
          onValueChange={onSelectedTypeChange}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={needsPracticeActive ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              onSelectedStatusChange?.(needsPracticeActive ? 'ALL' : NoteStatus.NEEDS_PRACTICE)
            }
          >
            Needs practice
          </Button>
          {hasActiveFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      <div className="inline-flex items-center self-end rounded-xl border border-border bg-card p-1">
        <Button
          variant={view === 'grid' ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="rounded-lg"
          aria-pressed={view === 'grid'}
          onClick={() => onViewChange?.('grid')}
        >
          <LayoutGridIcon />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={view === 'list' ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="rounded-lg"
          aria-pressed={view === 'list'}
          onClick={() => onViewChange?.('list')}
        >
          <ListIcon />
          <span className="sr-only">List view</span>
        </Button>
      </div>
    </div>
  )
}

function NotebookBody({
  state,
  actions,
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  view = 'grid',
  onSearchValueChange,
  onSelectedTopicChange,
  onSelectedStatusChange,
  onSelectedTypeChange,
  onViewChange,
  onClearFilters,
}: Pick<
  NotebookPageProps,
  | 'actions'
  | 'searchValue'
  | 'selectedTopic'
  | 'selectedStatus'
  | 'selectedType'
  | 'view'
  | 'onSearchValueChange'
  | 'onSelectedTopicChange'
  | 'onSelectedStatusChange'
  | 'onSelectedTypeChange'
  | 'onViewChange'
  | 'onClearFilters'
> & {
  state:
    | Extract<NotebookPageProps['state'], { kind: 'ready' }>
    | Extract<NotebookPageProps['state'], { kind: 'empty' }>
}) {
  const sourceNotes: NotebookPageNote[] = state.kind === 'ready' ? state.notes : []
  const visibleNotes: NotebookPageNote[] = getVisibleNotebookNotes({
    notes: sourceNotes,
    empty: state.kind === 'empty',
    searchValue,
    selectedTopic,
    selectedStatus,
    selectedType,
  })
  const topicOptions = getNotebookTopicOptions(sourceNotes)

  if (state.kind === 'empty') {
    return (
      <EmptyState
        className="min-h-96"
        icon={BookOpenIcon}
        title="No notes yet"
        description="Create your first note to start building your interview knowledge base."
        action={
          <Button asChild>
            <a href={actions.createNoteHref}>
              <PlusIcon />
              Create note
            </a>
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
          onSearchValueChange={onSearchValueChange}
          onSelectedTopicChange={onSelectedTopicChange}
          onSelectedStatusChange={onSelectedStatusChange}
          onSelectedTypeChange={onSelectedTypeChange}
          onViewChange={onViewChange}
          onClearFilters={onClearFilters}
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
      <NotebookHighlights notes={sourceNotes} />

      <FilterBar
        searchValue={searchValue}
        selectedTopic={selectedTopic}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        topicOptions={topicOptions}
        view={view}
        onSearchValueChange={onSearchValueChange}
        onSelectedTopicChange={onSelectedTopicChange}
        onSelectedStatusChange={onSelectedStatusChange}
        onSelectedTypeChange={onSelectedTypeChange}
        onViewChange={onViewChange}
        onClearFilters={onClearFilters}
      />
      <div
        className={cn(
          'grid gap-4',
          view === 'grid' ? 'xl:grid-cols-3 md:grid-cols-2' : 'grid-cols-1',
        )}
      >
        {visibleNotes.map((note) => (
          <NotebookCard
            key={note.id}
            note={note}
            view={view}
            noteHref={actions.noteHref(note.id)}
          />
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

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load notebook</span>}
      description={message}
      action={
        retryHref ? (
          <Button asChild variant="destructive">
            <a href={retryHref}>Retry</a>
          </Button>
        ) : undefined
      }
    />
  )
}

function Root(props: NotebookPageProps) {
  const activeNotes = props.state.kind === 'ready' ? props.state.notes : []
  const readyCount =
    props.state.kind === 'ready'
      ? activeNotes.filter((note) =>
          isSelectedFilter(props.selectedStatus, 'ALL')
            ? note.status === 'INTERVIEW_READY'
            : note.status === props.selectedStatus,
        ).length
      : 0

  return (
    <>
      <PageHeader
        title="Notebook"
        description="Your technical notes, organized by topic. Generate interview questions from any note."
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden px-3 py-1 text-xs text-muted-foreground md:inline-flex">
              {readyCount} ready for practice
            </div>
            <Button asChild className="rounded-xl md:hidden">
              <a href={props.actions.createNoteHref}>
                <PlusIcon />
                New note
              </a>
            </Button>
          </div>
        }
      />

      <PageBody>
        {props.state.kind === 'error' ? (
          <ErrorBody message={props.state.message} retryHref={props.actions.retryHref} />
        ) : props.state.kind === 'loading' ? (
          <LoadingBody />
        ) : (
          <NotebookBody
            state={props.state}
            actions={props.actions}
            searchValue={props.searchValue}
            selectedTopic={props.selectedTopic}
            selectedStatus={props.selectedStatus}
            selectedType={props.selectedType}
            view={props.view}
            onSearchValueChange={props.onSearchValueChange}
            onSelectedTopicChange={props.onSelectedTopicChange}
            onSelectedStatusChange={props.onSelectedStatusChange}
            onSelectedTypeChange={props.onSelectedTypeChange}
            onViewChange={props.onViewChange}
            onClearFilters={props.onClearFilters}
          />
        )}
      </PageBody>
    </>
  )
}

const NotebookPage = Object.assign(Root, {
  FilterBar,
  NotebookCard,
})

export default NotebookPage
