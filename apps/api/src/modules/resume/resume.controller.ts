import { Controller, Get, Post, Req } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ResumeService } from './resume.service'

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  upload(@CurrentUser() currentUser: unknown, @Req() request: FastifyRequest) {
    return this.resumeService.uploadResume(currentUser, request)
  }

  @Get('latest')
  findLatest(@CurrentUser() currentUser: unknown) {
    return this.resumeService.findLatest(currentUser)
  }
}
