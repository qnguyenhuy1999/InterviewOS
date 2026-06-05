import { Injectable } from '@nestjs/common'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import { AnalyticsRepository } from './analytics.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  getProgress(currentUser: CurrentUserRef) {
    return this.reviewService.getDashboardProgress(currentUser)
  }

  async getInterviewAnalytics(currentUser: CurrentUserRef) {
    const userId = (await this.usersRepository.ensureUserById(currentUser.id)).id
    return this.analyticsRepository.createInterviewAnalyticsSnapshot(userId)
  }
}
