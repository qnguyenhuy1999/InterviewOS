import {
  INTERVIEW_REVIEW_PAGE_PENDING_PUBLISHED_MESSAGE,
  INTERVIEW_REVIEW_PAGE_PENDING_UNPUBLISHED_MESSAGE,
} from './InterviewReviewPage.constants'
import type {
  InterviewReviewPageProps,
  InterviewReviewPageState,
} from './InterviewReviewPage.types'

export function getInterviewReviewHeaderDescription(params: {
  type: string
  createdAt: Date | string
  endedAt?: Date | string | null
}): string {
  return `${params.type} · Started ${formatInterviewReviewDateLabel(params.createdAt)}${
    params.endedAt ? ` · Ended ${formatInterviewReviewDateLabel(params.endedAt)}` : ''
  }`
}

export function formatInterviewReviewDateLabel(value: Date | string | null | undefined): string {
  if (!value) {
    return '--'
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
}

export function formatInterviewReviewSignedValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`
}

export function getInterviewReviewPendingMessage(status: string): string {
  return status === 'COMPLETED'
    ? INTERVIEW_REVIEW_PAGE_PENDING_PUBLISHED_MESSAGE
    : INTERVIEW_REVIEW_PAGE_PENDING_UNPUBLISHED_MESSAGE
}

export function getInterviewReviewState(props: InterviewReviewPageProps): InterviewReviewPageState {
  if (props.state) {
    return props.state
  }

  if (props.loading) {
    return { kind: 'loading' }
  }

  if (props.error) {
    return { kind: 'error', message: props.error }
  }

  if (!props.session) {
    return { kind: 'empty' }
  }

  return {
    kind: 'ready',
    session: props.session,
    turns: props.turns ?? [],
    evaluation: props.evaluation,
  }
}
