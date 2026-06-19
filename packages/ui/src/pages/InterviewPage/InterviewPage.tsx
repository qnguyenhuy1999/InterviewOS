'use client'

import { MicIcon, PlayIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ReadyBody } from './components/ReadyBody'
import { SessionRow } from './components/SessionRow'
import { SessionsTable } from './components/SessionsTable'
import { TopicFilter } from './components/TopicFilter'
import {
  INTERVIEW_PAGE_ALL_TOPICS_VALUE,
} from './InterviewPage.constants'
import type { InterviewPageProps } from './InterviewPage.types'

function Root({
  state,
  actions,
  selectedTopic = INTERVIEW_PAGE_ALL_TOPICS_VALUE,
  onTopicChange,
}: InterviewPageProps) {
  return (
    <>
      <PageHeader
        title="Interview sessions"
        description="Run a focused practice round and review your feedback afterwards."
        actions={
          <>
            <Button asChild variant="outline" size="lg">
              <a href={actions.startInterviewHref}>
                <MicIcon />
                New interview
              </a>
            </Button>
            <Button asChild size="lg">
              <a href={actions.quickStartHref}>
                <PlayIcon />
                Start quick interview
              </a>
            </Button>
          </>
        }
      />
      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={actions.retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody actions={actions} />
        ) : (
          <ReadyBody
            state={state}
            actions={actions}
            selectedTopic={selectedTopic}
            onTopicChange={onTopicChange}
          />
        )}
      </PageBody>
    </>
  )
}

const InterviewPage = Object.assign(Root, {
  SessionRow,
  SessionsTable,
  TopicFilter,
})

export default InterviewPage
