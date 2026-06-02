import { Injectable, NotImplementedException } from '@nestjs/common'

import { RecommendationsRepository } from './recommendations.repository'

@Injectable()
export class RecommendationsService {
  constructor(private readonly recommendationsRepository: RecommendationsRepository) {}

  getRecommendations(_currentUser: unknown) {
    void this.recommendationsRepository
    throw new NotImplementedException()
  }
}
