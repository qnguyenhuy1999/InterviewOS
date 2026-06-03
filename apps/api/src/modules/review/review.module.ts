import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'
import { ReviewController } from './review.controller'
import { ReviewRepository } from './review.repository'
import { ReviewService } from './review.service'

@Module({
  imports: [UsersModule],
  controllers: [ReviewController],
  providers: [ReviewRepository, ReviewService],
  exports: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
