import { Controller, Get, Post, Req } from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiEntityResponse, ApiNullableEntityResponse } from '../../common/swagger/swagger-helpers'
import { ResumeAnalysisResponseDto } from './dto/resume.dto'
import { ResumeService } from './resume.service'

@ApiTags('resume')
@ApiCookieAuth('interviewos_session')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a resume file and analyze it against the onboarding target role' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiEntityResponse(ResumeAnalysisResponseDto, { status: 'created' })
  upload(@CurrentUser() currentUser: unknown, @Req() request: FastifyRequest) {
    return this.resumeService.uploadResume(currentUser, request)
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get the latest resume analysis for the current user' })
  @ApiNullableEntityResponse(ResumeAnalysisResponseDto)
  findLatest(@CurrentUser() currentUser: unknown) {
    return this.resumeService.findLatest(currentUser)
  }
}
