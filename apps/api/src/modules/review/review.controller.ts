import { learningPathActionSchema } from '@interviewos/validators'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ReviewService } from './review.service'

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('review')
  getReviewQueue(@CurrentUser() currentUser: unknown) {
    return this.reviewService.getReviewQueue(currentUser)
  }

  @Post('review/:reviewItemId/rate')
  rateReviewItem(
    @CurrentUser() currentUser: unknown,
    @Param('reviewItemId') reviewItemId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.reviewService.rateReviewItem(currentUser, reviewItemId, payload)
  }

  @Get('learning-path')
  getLearningPath(@CurrentUser() currentUser: unknown) {
    return this.reviewService.buildLearningPath(currentUser)
  }

  @Post('learning-path/:itemId/action')
  updateLearningPathItem(
    @CurrentUser() currentUser: unknown,
    @Param('itemId') itemId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    const input = learningPathActionSchema.parse(payload)
    return this.reviewService.updateLearningPathItem(currentUser, itemId, input.action)
  }

  @Get('weak-concepts')
  listWeakConcepts(@CurrentUser() currentUser: unknown) {
    return this.reviewService.listWeakConcepts(currentUser)
  }

  @Patch('weak-concepts/:weakConceptId/status')
  updateWeakConceptStatus(
    @CurrentUser() currentUser: unknown,
    @Param('weakConceptId') weakConceptId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.reviewService.updateWeakConceptStatus(currentUser, weakConceptId, payload)
  }
}
