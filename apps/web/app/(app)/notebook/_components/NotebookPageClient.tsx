'use client'

import { NoteStatus, NoteType } from '@interviewos/types'
import type { NotebookPageProps, NotebookPageView } from '@interviewos/ui/pages/NotebookPage'
import NotebookPage from '@interviewos/ui/pages/NotebookPage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useDeferredValue, useEffect, useState } from 'react'

type NotebookPageClientProps = Pick<NotebookPageProps, 'state'> & {
  actions: {
    createNoteHref: string
    noteHrefBase: string
    retryHref?: string
  }
  initialSearchValue?: string
  initialSelectedTopic?: string | 'ALL'
  initialSelectedStatus?: string | null
  initialSelectedType?: string | null
  initialView?: NotebookPageView
}

const VALID_STATUS_VALUES = new Set<NotebookPageProps['selectedStatus']>([
  'ALL',
  ...Object.values(NoteStatus),
])
const VALID_TYPE_VALUES = new Set<NotebookPageProps['selectedType']>([
  'ALL',
  ...Object.values(NoteType),
])

export function NotebookPageClient({
  state,
  actions,
  initialSearchValue = '',
  initialSelectedTopic = 'ALL',
  initialSelectedStatus = 'ALL',
  initialSelectedType = 'ALL',
  initialView = 'grid',
}: NotebookPageClientProps) {
  return (
    <NotebookPageClientContent
      key={initialSearchValue}
      state={state}
      actions={actions}
      initialSearchValue={initialSearchValue}
      initialSelectedTopic={initialSelectedTopic}
      initialSelectedStatus={initialSelectedStatus}
      initialSelectedType={initialSelectedType}
      initialView={initialView}
    />
  )
}

function NotebookPageClientContent({
  state,
  actions,
  initialSearchValue = '',
  initialSelectedTopic = 'ALL',
  initialSelectedStatus = 'ALL',
  initialSelectedType = 'ALL',
  initialView = 'grid',
}: NotebookPageClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(initialSearchValue)
  const deferredSearchValue = useDeferredValue(searchValue)

  useEffect(() => {
    if (deferredSearchValue === initialSearchValue) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    setOptionalParam(nextParams, 'q', deferredSearchValue)
    const nextQuery = nextParams.toString()

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
    })
  }, [deferredSearchValue, initialSearchValue, pathname, router, searchParams])

  const selectedTopic = normalizeTopicValue(searchParams.get('topic')) ?? initialSelectedTopic
  const selectedStatus =
    normalizeStatusValue(searchParams.get('status')) ??
    normalizeStatusValue(initialSelectedStatus) ??
    'ALL'
  const selectedType =
    normalizeTypeValue(searchParams.get('type')) ?? normalizeTypeValue(initialSelectedType) ?? 'ALL'
  const view = normalizeViewValue(searchParams.get('view')) ?? initialView

  function replaceSearchParams(mutate: (params: URLSearchParams) => void) {
    const nextParams = new URLSearchParams(searchParams.toString())
    mutate(nextParams)
    const nextQuery = nextParams.toString()

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
    })
  }

  return (
    <NotebookPage
      state={state}
      actions={{
        createNoteHref: actions.createNoteHref,
        noteHref: (noteId) => `${actions.noteHrefBase}/${noteId}`,
        retryHref: actions.retryHref,
      }}
      searchValue={searchValue}
      selectedTopic={selectedTopic}
      selectedStatus={selectedStatus}
      selectedType={selectedType}
      view={view}
      onSearchValueChange={setSearchValue}
      onSelectedTopicChange={(value) => {
        replaceSearchParams((params) => {
          setOptionalParam(params, 'topic', value === 'ALL' ? null : value)
        })
      }}
      onSelectedStatusChange={(value) => {
        replaceSearchParams((params) => {
          setOptionalParam(params, 'status', value === 'ALL' ? null : value)
        })
      }}
      onSelectedTypeChange={(value) => {
        replaceSearchParams((params) => {
          setOptionalParam(params, 'type', value === 'ALL' ? null : value)
        })
      }}
      onViewChange={(value) => {
        replaceSearchParams((params) => {
          setOptionalParam(params, 'view', value === 'grid' ? null : value)
        })
      }}
      onClearFilters={() => {
        setSearchValue('')
        replaceSearchParams((params) => {
          params.delete('q')
          params.delete('topic')
          params.delete('status')
          params.delete('type')
          params.delete('view')
        })
      }}
    />
  )
}

function normalizeTopicValue(value: string | null) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeStatusValue(value: string | null): NotebookPageProps['selectedStatus'] | null {
  if (!value) {
    return null
  }

  return VALID_STATUS_VALUES.has(value as NotebookPageProps['selectedStatus'])
    ? (value as NotebookPageProps['selectedStatus'])
    : null
}

function normalizeTypeValue(value: string | null): NotebookPageProps['selectedType'] | null {
  if (!value) {
    return null
  }

  return VALID_TYPE_VALUES.has(value as NotebookPageProps['selectedType'])
    ? (value as NotebookPageProps['selectedType'])
    : null
}

function normalizeViewValue(value: string | null): NotebookPageView | null {
  if (value === 'grid' || value === 'list') {
    return value
  }

  return null
}

function setOptionalParam(params: URLSearchParams, key: string, value: string | null) {
  if (!value) {
    params.delete(key)
    return
  }

  params.set(key, value)
}
