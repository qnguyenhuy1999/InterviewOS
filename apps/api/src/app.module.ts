import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'

import { AIModule } from './ai/ai.module'
import configuration from './config/configuration'
import { DatabaseModule } from './database/database.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { AuthModule } from './modules/auth/auth.module'
import { CompanyModeModule } from './modules/company-mode/company-mode.module'
import { EnglishNotesModule } from './modules/english-notes/english-notes.module'
import { EvaluationModule } from './modules/evaluation/evaluation.module'
import { InterviewModule } from './modules/interview/interview.module'
import { NotebookModule } from './modules/notebook/notebook.module'
import { ReadinessModule } from './modules/readiness/readiness.module'
import { RecommendationsModule } from './modules/recommendations/recommendations.module'
import { ResumeModule } from './modules/resume/resume.module'
import { ReviewModule } from './modules/review/review.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: path.resolve(process.cwd(), '../../.env'),
    }),
    DatabaseModule,
    AIModule,
    AuthModule,
    UsersModule,
    NotebookModule,
    InterviewModule,
    EvaluationModule,
    CompanyModeModule,
    ReadinessModule,
    EnglishNotesModule,
    ReviewModule,
    ResumeModule,
    RecommendationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
