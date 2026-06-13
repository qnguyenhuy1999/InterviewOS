import assert from 'node:assert/strict'
import test from 'node:test'

import { APP_NAVIGATION, APP_ROUTES, getAppRouteTitle } from './app-routes'

test('APP_ROUTES builds stable app paths with ids', () => {
  assert.equal(APP_ROUTES.notebookDetail('note-1'), '/notebook/note-1')
  assert.equal(APP_ROUTES.notebookEdit('note-1'), '/notebook/note-1/edit')
  assert.equal(APP_ROUTES.interviewSession('session-1'), '/interview/session/session-1')
  assert.equal(APP_ROUTES.interviewReview('session-1'), '/interview/session/session-1/review')
})

test('getAppRouteTitle resolves exact and nested navigation titles', () => {
  assert.equal(getAppRouteTitle('/dashboard'), 'Dashboard')
  assert.equal(getAppRouteTitle('/notebook/note-1/edit'), 'Notebook')
  assert.equal(getAppRouteTitle('/interview/session/session-1/review'), 'Interview')
  assert.equal(getAppRouteTitle('/unknown'), 'InterviewOS')
})

test('APP_NAVIGATION exposes every primary route once', () => {
  assert.deepEqual(
    APP_NAVIGATION.map((item) => item.href),
    [
      '/dashboard',
      '/onboarding',
      '/notebook',
      '/interview',
      '/review',
      '/english-notes',
      '/readiness',
      '/learning-path',
      '/resume',
      '/settings',
    ],
  )
})
