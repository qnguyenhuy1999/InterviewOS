import { Injectable } from '@nestjs/common'

import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import { AnalyticsRepository } from './analytics.repository'

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  getProgress(currentUser: unknown) {
    return this.reviewService.getDashboardProgress(currentUser)
  }

  async getInterviewAnalytics(currentUser: unknown) {
    const userId = (await this.usersRepository.ensureUserById((currentUser as { id?: string } | undefined)?.id)).id
    return this.analyticsRepository.createInterviewAnalyticsSnapshot(userId)
  }
}
