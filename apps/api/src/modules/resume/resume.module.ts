import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { UsersModule } from '../users/users.module'
import { ResumeController } from './resume.controller'
import { ResumeRepository } from './resume.repository'
import { ResumeService } from './resume.service'

@Module({
  imports: [UsersModule, AIModule],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeRepository],
})
export class ResumeModule {}
