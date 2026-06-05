import { LearningPathItemStatus } from '@interviewos/types'

export const LEARNING_PATH_STATUS_GROUPS = [
  {
    key: 'active',
    label: 'Active work',
    statuses: [LearningPathItemStatus.PENDING, LearningPathItemStatus.IN_PROGRESS],
  },
  {
    key: 'completed',
    label: 'Completed',
    statuses: [LearningPathItemStatus.COMPLETED],
  },
  {
    key: 'paused',
    label: 'Paused or skipped',
    statuses: [LearningPathItemStatus.SNOOZED, LearningPathItemStatus.SKIPPED],
  },
] as const
