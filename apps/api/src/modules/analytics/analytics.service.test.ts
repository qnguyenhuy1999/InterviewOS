import assert from 'node:assert/strict'
import test from 'node:test'

import { AnalyticsService } from './analytics.service'

test('AnalyticsService delegates dashboard progress to ReviewService', async () => {
  const progress = { interviewReadiness: 80 }
  const service = new AnalyticsService(
    {
      getDashboardProgress: async (currentUser: { id: string }) => ({
        ...progress,
        userId: currentUser.id,
      }),
    } as never,
    {} as never,
    {} as never,
  )

  assert.deepEqual(await service.getProgress({ id: 'user-1' }), { ...progress, userId: 'user-1' })
})

test('AnalyticsService resolves the user before creating interview analytics snapshots', async () => {
  let snapshotUserId: string | undefined
  const service = new AnalyticsService(
    {} as never,
    {
      createInterviewAnalyticsSnapshot: async (userId: string) => {
        snapshotUserId = userId
        return { userId, totalSessions: 3 }
      },
    } as never,
    {
      ensureUserById: async () => ({ id: 'resolved-user' }),
    } as never,
  )

  const snapshot = await service.getInterviewAnalytics({ id: 'request-user' })

  assert.equal(snapshotUserId, 'resolved-user')
  assert.deepEqual(snapshot, { userId: 'resolved-user', totalSessions: 3 })
})
