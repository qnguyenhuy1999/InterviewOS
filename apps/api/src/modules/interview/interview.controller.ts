import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { InterviewService } from './interview.service'

@Controller('sessions')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  createSession(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.interviewService.createSession(currentUser, payload)
  }

  @Get()
  findSessions(@CurrentUser() currentUser: unknown) {
    return this.interviewService.findSessions(currentUser)
  }

  @Get(':sessionId')
  findSessionById(@CurrentUser() currentUser: unknown, @Param('sessionId') sessionId: string) {
    return this.interviewService.findSessionById(currentUser, sessionId)
  }

  @Patch(':sessionId')
  updateSession(
    @CurrentUser() currentUser: unknown,
    @Param('sessionId') sessionId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.interviewService.updateSession(currentUser, sessionId, payload)
  }

  @Delete(':sessionId')
  deleteSession(@CurrentUser() currentUser: unknown, @Param('sessionId') sessionId: string) {
    return this.interviewService.deleteSession(currentUser, sessionId)
  }

  @Post(':sessionId/answer')
  answerQuestion(
    @CurrentUser() currentUser: unknown,
    @Param('sessionId') sessionId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.interviewService.answerQuestion(currentUser, sessionId, payload)
  }
}
