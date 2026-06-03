import { Injectable } from '@nestjs/common'

import { ReviewService } from '../review/review.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly reviewService: ReviewService) {}

  getProgress(currentUser: unknown) {
    return this.reviewService.getDashboardProgress(currentUser)
  }
}
