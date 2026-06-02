import { Injectable, NotImplementedException } from '@nestjs/common'

import { AnalyticsRepository } from './analytics.repository'

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  getProgress(_currentUser: unknown) {
    void this.analyticsRepository
    throw new NotImplementedException()
  }
}
