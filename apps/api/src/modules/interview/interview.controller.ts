import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { InterviewService } from './interview.service'
import { InterviewTurnService } from './interview-turn.service'

@Controller('sessions')
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly interviewTurnService: InterviewTurnService,
  ) {}

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

  @Post('multi-turn')
  startMultiTurnSession(
    @CurrentUser() currentUser: unknown,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.interviewTurnService.startMultiTurnSession(currentUser, payload)
  }

  @Post(':sessionId/turns')
  submitTurn(
    @CurrentUser() currentUser: unknown,
    @Param('sessionId') sessionId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.interviewTurnService.submitTurn(currentUser, sessionId, payload)
  }

  @Get(':sessionId/turns')
  getTurns(@CurrentUser() currentUser: unknown, @Param('sessionId') sessionId: string) {
    return this.interviewTurnService.getTurns(currentUser, sessionId)
  }

  @Post(':sessionId/end')
  endSession(@CurrentUser() currentUser: unknown, @Param('sessionId') sessionId: string) {
    return this.interviewTurnService.endSession(currentUser, sessionId)
  }

  @Get(':sessionId/evaluation')
  getEvaluation(@CurrentUser() currentUser: unknown, @Param('sessionId') sessionId: string) {
    return this.interviewTurnService.getEvaluation(currentUser, sessionId)
  }
}
