import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { EvaluationModule } from '../evaluation/evaluation.module'
import { NotebookModule } from '../notebook/notebook.module'
import { ReadinessModule } from '../readiness/readiness.module'
import { ReviewModule } from '../review/review.module'
import { UsersModule } from '../users/users.module'
import { InterviewController } from './interview.controller'
import { InterviewRepository } from './interview.repository'
import { InterviewService } from './interview.service'
import { InterviewTurnService } from './interview-turn.service'

@Module({
  imports: [AIModule, NotebookModule, UsersModule, ReviewModule, EvaluationModule, ReadinessModule],
  controllers: [InterviewController],
  providers: [InterviewService, InterviewTurnService, InterviewRepository],
  exports: [InterviewService, InterviewTurnService, InterviewRepository],
})
export class InterviewModule {}
