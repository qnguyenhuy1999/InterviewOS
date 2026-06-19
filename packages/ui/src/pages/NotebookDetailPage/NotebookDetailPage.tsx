'use client'

import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { PageBody } from '../../../components/ui/page'
import { QuestionCard } from '../../molecules/QuestionCard/QuestionCard'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { NotebookDetailBody } from './components/NotebookDetailBody'
import { RelatedNoteRow } from './components/RelatedNoteRow'
import { notebookDetailFixture } from './NotebookDetailPage.fixtures'
import type { NotebookDetailPageProps } from './NotebookDetailPage.types'

function Root({
  data = notebookDetailFixture,
  loading,
  empty,
  error,
  backAction = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rounded-lg px-3 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeftIcon />
      Back to notebook
    </Button>
  ),
  renderHeaderActions,
  renderQuestionActions,
}: NotebookDetailPageProps) {
  return (
    <PageBody className="pb-10 md:pb-12">
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : empty ? (
        <EmptyBody />
      ) : (
        <NotebookDetailBody
          data={data}
          backAction={backAction}
          renderHeaderActions={renderHeaderActions}
          renderQuestionActions={renderQuestionActions}
        />
      )}
    </PageBody>
  )
}

const NotebookDetailPage = Object.assign(Root, {
  QuestionCard,
  RelatedNoteRow,
})

export default NotebookDetailPage
