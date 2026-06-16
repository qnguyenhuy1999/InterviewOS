import type { NoteStatus, NoteType } from '@interviewos/types'
import { LayoutGridIcon, ListIcon, SearchIcon, XIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { NOTEBOOK_STATUS_OPTIONS, NOTEBOOK_TYPE_OPTIONS } from '../NotebookPage.constants'
import type {
  NotebookPageFilterValue,
  NotebookPageProps,
  NotebookPageSort,
  NotebookPageView,
} from '../NotebookPage.types'
import { getEnumLabel } from '../NotebookPage.utils'
import { FilterSelect } from './FilterSelect'
import { NotebookSortSelect } from './NotebookSortSelect'

export function FilterBar({
  searchValue,
  selectedTopic,
  selectedStatus,
  selectedType,
  selectedSort,
  topicOptions,
  view,
  onSearchValueChange,
  onSelectedTopicChange,
  onSelectedStatusChange,
  onSelectedTypeChange,
  onSelectedSortChange,
  onViewChange,
  onClearFilters,
}: {
  searchValue?: string
  selectedTopic?: string | 'ALL'
  selectedStatus?: NotebookPageFilterValue<NoteStatus>
  selectedType?: NotebookPageFilterValue<NoteType>
  selectedSort?: NotebookPageSort
  topicOptions: readonly string[]
  view: NotebookPageView
  onSearchValueChange?: NotebookPageProps['onSearchValueChange']
  onSelectedTopicChange?: NotebookPageProps['onSelectedTopicChange']
  onSelectedStatusChange?: NotebookPageProps['onSelectedStatusChange']
  onSelectedTypeChange?: NotebookPageProps['onSelectedTypeChange']
  onSelectedSortChange?: NotebookPageProps['onSelectedSortChange']
  onViewChange?: NotebookPageProps['onViewChange']
  onClearFilters?: NotebookPageProps['onClearFilters']
}) {
  const hasActiveFilters =
    (searchValue?.trim().length ?? 0) > 0 ||
    (selectedTopic ?? 'ALL') !== 'ALL' ||
    (selectedStatus ?? 'ALL') !== 'ALL' ||
    (selectedType ?? 'ALL') !== 'ALL' ||
    (selectedSort ?? 'updated-desc') !== 'updated-desc'

  const hasSearchValue = (searchValue?.trim().length ?? 0) > 0

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <label className="relative block md:min-w-72 md:flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchValue ?? ''}
            onChange={(e) => onSearchValueChange?.(e.target.value)}
            placeholder="Search notes…"
            className="h-10 rounded-xl border-border/60 bg-card px-9 transition-colors"
          />
          {hasSearchValue && (
            <Button
              variant="ghost"
              type="button"
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => onSearchValueChange?.('')}
            >
              <XIcon className="size-3.5" />
            </Button>
          )}
        </label>

        <FilterSelect
          value={selectedTopic}
          options={topicOptions}
          placeholder="All topics"
          getLabel={(v) => v}
          onValueChange={(v) => onSelectedTopicChange?.(v)}
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
        <NotebookSortSelect value={selectedSort} onValueChange={onSelectedSortChange} />

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="inline-flex shrink-0 items-center self-end rounded-xl border border-border/60 bg-card p-1 md:self-auto">
        <Button
          variant={view === 'grid' ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="rounded-lg"
          aria-pressed={view === 'grid'}
          aria-label="Grid view"
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
          aria-label="List view"
          onClick={() => onViewChange?.('list')}
        >
          <ListIcon />
          <span className="sr-only">List view</span>
        </Button>
      </div>
    </div>
  )
}
