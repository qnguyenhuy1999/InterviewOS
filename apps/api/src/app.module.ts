import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { AIModule } from './ai/ai.module'
import configuration from './config/configuration'
import { DatabaseModule } from './database/database.module'
import { apiEnvFilePath } from './env-file-path'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { AuthModule } from './modules/auth/auth.module'
import { CompanyModeModule } from './modules/company-mode/company-mode.module'
import { EnglishNotesModule } from './modules/english-notes/english-notes.module'
import { EvaluationModule } from './modules/evaluation/evaluation.module'
import { HealthModule } from './modules/health/health.module'
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
      envFilePath: apiEnvFilePath,
    }),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60_000, limit: 120 },
      { name: 'auth', ttl: 60_000, limit: 10 },
      { name: 'ai', ttl: 60_000, limit: 20 },
    ]),
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
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
