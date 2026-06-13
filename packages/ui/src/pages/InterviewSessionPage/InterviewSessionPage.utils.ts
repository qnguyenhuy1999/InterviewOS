import {
  INTERVIEW_SESSION_PAGE_DEFAULT_REVIEW_LABEL,
  INTERVIEW_SESSION_PAGE_UNKNOWN_VALUE,
} from './InterviewSessionPage.constants'
import type {
  InterviewSessionPageProps,
  InterviewSessionPageSession,
  InterviewSessionPageState,
  InterviewSessionPageTurn,
} from './InterviewSessionPage.types'

export function formatInterviewSessionDateLabel(value: Date | string | null | undefined): string {
  if (!value) {
    return INTERVIEW_SESSION_PAGE_UNKNOWN_VALUE
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime())
    ? INTERVIEW_SESSION_PAGE_UNKNOWN_VALUE
    : date.toLocaleDateString()
}

export function formatInterviewSessionSignedValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`
}

export function isMultiTurnInterviewSession(session: InterviewSessionPageSession): boolean {
  return session.mode === 'MULTI_TURN' || session.mode === 'COMPANY'
}

export function getInterviewSessionCompletedTurns(
  session: InterviewSessionPageSession,
  turns: InterviewSessionPageTurn[],
): number {
  if (!isMultiTurnInterviewSession(session)) {
    return session.questions.some((question) => question.answer) ? 1 : 0
  }

  return turns.filter((turn) => turn.role === 'CANDIDATE').length
}

export function getInterviewSessionHeaderDescription(session: InterviewSessionPageSession): string {
  const modeLabel =
    session.mode === 'COMPANY' ? (session.companyMode?.name ?? 'Company mode') : session.type

  return `${modeLabel} · Started ${formatInterviewSessionDateLabel(session.createdAt)}`
}

export function getInterviewSessionReviewLabel(): string {
  return INTERVIEW_SESSION_PAGE_DEFAULT_REVIEW_LABEL
}

export function getInterviewSessionState(
  props: InterviewSessionPageProps,
): InterviewSessionPageState {
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
  }
}
