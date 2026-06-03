import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { NotebookModule } from '../notebook/notebook.module'
import { ReviewModule } from '../review/review.module'
import { UsersModule } from '../users/users.module'
import { InterviewController } from './interview.controller'
import { InterviewRepository } from './interview.repository'
import { InterviewService } from './interview.service'

@Module({
  imports: [AIModule, NotebookModule, UsersModule, ReviewModule],
  controllers: [InterviewController],
  providers: [InterviewService, InterviewRepository],
  exports: [InterviewService, InterviewRepository],
})
export class InterviewModule {}
