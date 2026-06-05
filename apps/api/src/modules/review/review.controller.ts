import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import {
  LearningPathActionDto,
  LearningPathItemResponseDto,
  ReviewAttemptDto,
  ReviewQueueResponseDto,
  ReviewRatingDto,
  WeakConceptResponseDto,
  WeakConceptStatusDto,
} from './dto/review.dto'
import { ReviewService } from './review.service'

@ApiTags('review')
@ApiCookieAuth('interviewos_session')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('review')
  @ApiOperation({ summary: 'Get the prioritized review queue' })
  @ApiEntityResponse(ReviewQueueResponseDto)
  getReviewQueue(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.reviewService.getReviewQueue(currentUser)
  }

  @Post('review/:reviewItemId/rate')
  @ApiOperation({ summary: 'Rate a review item and schedule the next review' })
  @ApiParam({ name: 'reviewItemId', type: String })
  @ApiBody({ type: ReviewRatingDto })
  @ApiEntityResponse(ReviewAttemptDto, { status: 'created' })
  rateReviewItem(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('reviewItemId') reviewItemId: string,
    @Body() payload: ReviewRatingDto,
  ) {
    return this.reviewService.rateReviewItem(currentUser, reviewItemId, payload)
  }

  @Get('learning-path')
  @ApiOperation({ summary: 'Build the current learning path from review signals' })
  @ApiArrayResponse(LearningPathItemResponseDto)
  getLearningPath(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.reviewService.buildLearningPath(currentUser)
  }

  @Post('learning-path/:itemId/action')
  @ApiOperation({ summary: 'Update a learning path item status' })
  @ApiParam({ name: 'itemId', type: String })
  @ApiBody({ type: LearningPathActionDto })
  @ApiEntityResponse(LearningPathItemResponseDto, { status: 'created' })
  updateLearningPathItem(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('itemId') itemId: string,
    @Body() payload: LearningPathActionDto,
  ) {
    return this.reviewService.updateLearningPathItem(currentUser, itemId, payload.action)
  }

  @Get('weak-concepts')
  @ApiOperation({ summary: 'List weak concepts detected from practice sessions' })
  @ApiArrayResponse(WeakConceptResponseDto)
  listWeakConcepts(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.reviewService.listWeakConcepts(currentUser)
  }

  @Patch('weak-concepts/:weakConceptId/status')
  @ApiOperation({ summary: 'Update the status of a weak concept' })
  @ApiParam({ name: 'weakConceptId', type: String })
  @ApiBody({ type: WeakConceptStatusDto })
  @ApiEntityResponse(WeakConceptResponseDto)
  updateWeakConceptStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('weakConceptId') weakConceptId: string,
    @Body() payload: WeakConceptStatusDto,
  ) {
    return this.reviewService.updateWeakConceptStatus(currentUser, weakConceptId, payload)
  }
}
