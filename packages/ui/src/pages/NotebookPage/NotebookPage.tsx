import { NoteStatus } from '@interviewos/types'
import { PlusIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { ErrorBody, FilterBar, LoadingBody, NotebookBody, NotebookCard } from './components'
import type { NotebookPageProps } from './NotebookPage.types'
import { getEnumLabel, isSelectedFilter } from './NotebookPage.utils'

function Root(props: NotebookPageProps) {
  const activeNotes = props.state.kind === 'ready' ? props.state.notes : []

  const { readyCountLabel } = (() => {
    if (props.state.kind !== 'ready') return { readyCountLabel: null }

    const readyCount = activeNotes.filter((n) => n.status === NoteStatus.INTERVIEW_READY).length

    if (isSelectedFilter(props.selectedStatus, 'ALL')) {
      return { readyCountLabel: `${readyCount} ready for practice` }
    }

    const filteredCount = activeNotes.filter((n) => n.status === props.selectedStatus).length
    const statusLabel = getEnumLabel(props.selectedStatus as NoteStatus)
    return { readyCountLabel: `${filteredCount} ${statusLabel.toLowerCase()}` }
  })()

  return (
    <>
      <PageHeader
        title="Notebook"
        description="Your technical notes, organised by topic. Generate interview questions from any note."
        actions={
          <div className="flex items-center gap-3">
            {readyCountLabel && (
              <div className="hidden px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                {readyCountLabel}
              </div>
            )}
            <Button asChild>
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
          <LoadingBody view={props.view} />
        ) : (
          <NotebookBody
            state={props.state}
            actions={props.actions}
            searchValue={props.searchValue}
            selectedTopic={props.selectedTopic}
            selectedStatus={props.selectedStatus}
            selectedType={props.selectedType}
            selectedSort={props.selectedSort}
            view={props.view}
            onSearchValueChange={props.onSearchValueChange}
            onSelectedTopicChange={props.onSelectedTopicChange}
            onSelectedStatusChange={props.onSelectedStatusChange}
            onSelectedTypeChange={props.onSelectedTypeChange}
            onSelectedSortChange={props.onSelectedSortChange}
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
