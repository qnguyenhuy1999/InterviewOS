import { BookOpenIcon, PlusIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'
import { cn } from '../../../../lib/utils'
import type { NotebookPageNote, NotebookPageProps } from '../NotebookPage.types'
import {
  getNotebookTopicOptions,
  getVisibleNotebookNotes,
  sortNotebookNotes,
} from '../NotebookPage.utils'
import { FilterBar } from './FilterBar'
import { NotebookCard } from './NotebookCard'
import { NotebookHighlights } from './NotebookHighlights'

export function NotebookBody({
  state,
  actions,
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  selectedSort,
  view = 'grid',
  onSearchValueChange,
  onSelectedTopicChange,
  onSelectedStatusChange,
  onSelectedTypeChange,
  onSelectedSortChange,
  onViewChange,
  onClearFilters,
}: Pick<
  NotebookPageProps,
  | 'actions'
  | 'searchValue'
  | 'selectedTopic'
  | 'selectedStatus'
  | 'selectedType'
  | 'selectedSort'
  | 'view'
  | 'onSearchValueChange'
  | 'onSelectedTopicChange'
  | 'onSelectedStatusChange'
  | 'onSelectedTypeChange'
  | 'onSelectedSortChange'
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
  const sortedNotes =
    state.kind === 'ready' ? sortNotebookNotes(visibleNotes, selectedSort ?? 'updated-desc') : []
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

  const filterBar = (
    <FilterBar
      searchValue={searchValue}
      selectedTopic={selectedTopic}
      selectedStatus={selectedStatus}
      selectedType={selectedType}
      selectedSort={selectedSort}
      topicOptions={topicOptions}
      view={view}
      onSearchValueChange={onSearchValueChange}
      onSelectedTopicChange={onSelectedTopicChange}
      onSelectedStatusChange={onSelectedStatusChange}
      onSelectedTypeChange={onSelectedTypeChange}
      onSelectedSortChange={onSelectedSortChange}
      onViewChange={onViewChange}
      onClearFilters={onClearFilters}
    />
  )

  if (visibleNotes.length === 0) {
    return (
      <div className="space-y-6">
        {filterBar}
        <EmptyState
          className="min-h-80"
          title="No notes match these filters"
          description="Try a broader search, switch the topic, or clear the status filter."
          action={
            <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NotebookHighlights notes={sourceNotes} />
      {filterBar}

      {visibleNotes.length !== sourceNotes.length && (
        <p className="text-xs text-muted-foreground">
          Showing {visibleNotes.length} of {sourceNotes.length} notes
        </p>
      )}

      <div
        className={cn(
          'grid gap-4',
          view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
        )}
      >
        {sortedNotes.map((note) => (
          <NotebookCard
            key={note.id}
            note={note}
            view={view}
            noteHref={actions.noteHref(note.id)}
            noteEditHref={actions.noteEditHref?.(note.id)}
          />
        ))}
      </div>
    </div>
  )
}
