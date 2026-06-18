'use client'

import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { EnglishNoteRow } from './components/EnglishNoteRow'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ReadyBody } from './components/ReadyBody'
import type { EnglishNotesPageProps } from './EnglishNotesPage.types'

function Root({ state, actions, renderNoteActions }: EnglishNotesPageProps) {
  return (
    <>
      <PageHeader
        title="English notes"
        description="Track spoken-English corrections, study by topic, and close repeated communication gaps."
        actions={
          <Button asChild variant="outline" size="lg">
            <a href={actions.reviewLatestHref}>Review latest</a>
          </Button>
        }
      />

      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={actions.retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody startPracticeHref={actions.startPracticeHref} />
        ) : (
          <ReadyBody state={state} renderNoteActions={renderNoteActions} />
        )}
      </PageBody>
    </>
  )
}

const EnglishNotesPage = Object.assign(Root, { EnglishNoteRow })
export default EnglishNotesPage
