import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import {
  CreateInterviewSessionDto,
  InterviewEvaluationDto,
  InterviewSessionResponseDto,
  InterviewTurnDto,
  StartMultiTurnSessionDto,
  SubmitInterviewAnswerDto,
  SubmitTurnDto,
  SubmitTurnResponseDto,
} from './dto/interview.dto'
import { InterviewService } from './interview.service'
import { InterviewTurnService } from './interview-turn.service'

@ApiTags('interview')
@ApiCookieAuth('interviewos_session')
@Controller('sessions')
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly interviewTurnService: InterviewTurnService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a single-question interview session from a generated note question',
  })
  @ApiBody({ type: CreateInterviewSessionDto })
  @ApiEntityResponse(InterviewSessionResponseDto, { status: 'created' })
  createSession(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() payload: CreateInterviewSessionDto,
  ) {
    return this.interviewService.createSession(currentUser, payload)
  }

  @Get()
  @ApiOperation({ summary: 'List interview sessions for the current user' })
  @ApiArrayResponse(InterviewSessionResponseDto)
  findSessions(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.interviewService.findSessions(currentUser)
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get an interview session by id' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiEntityResponse(InterviewSessionResponseDto)
  findSessionById(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
  ) {
    return this.interviewService.findSessionById(currentUser, sessionId)
  }

  @Patch(':sessionId')
  @ApiOperation({ summary: 'Submit or replace the answer for a single-question interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBody({ type: SubmitInterviewAnswerDto })
  @ApiEntityResponse(InterviewSessionResponseDto)
  updateSession(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() payload: SubmitInterviewAnswerDto,
  ) {
    return this.interviewService.updateSession(currentUser, sessionId, payload)
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Delete an interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiEntityResponse(InterviewSessionResponseDto)
  deleteSession(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
  ) {
    return this.interviewService.deleteSession(currentUser, sessionId)
  }

  @Post(':sessionId/answer')
  @ApiOperation({ summary: 'Answer the generated question in a single-question interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBody({ type: SubmitInterviewAnswerDto })
  @ApiEntityResponse(InterviewSessionResponseDto, { status: 'created' })
  answerQuestion(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() payload: SubmitInterviewAnswerDto,
  ) {
    return this.interviewService.answerQuestion(currentUser, sessionId, payload)
  }

  @Post('multi-turn')
  @ApiOperation({ summary: 'Start a resumable multi-turn interview session' })
  @ApiBody({ type: StartMultiTurnSessionDto })
  @ApiEntityResponse(InterviewSessionResponseDto, { status: 'created' })
  startMultiTurnSession(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() payload: StartMultiTurnSessionDto,
  ) {
    return this.interviewTurnService.startMultiTurnSession(currentUser, payload)
  }

  @Post(':sessionId/turns')
  @ApiOperation({ summary: 'Submit one candidate turn in a multi-turn interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBody({ type: SubmitTurnDto })
  @ApiEntityResponse(SubmitTurnResponseDto, { status: 'created' })
  submitTurn(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() payload: SubmitTurnDto,
  ) {
    return this.interviewTurnService.submitTurn(currentUser, sessionId, payload)
  }

  @Get(':sessionId/turns')
  @ApiOperation({ summary: 'Get all turns for a multi-turn interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiArrayResponse(InterviewTurnDto)
  getTurns(@CurrentUser() currentUser: AuthenticatedUser, @Param('sessionId') sessionId: string) {
    return this.interviewTurnService.getTurns(currentUser, sessionId)
  }

  @Post(':sessionId/end')
  @ApiOperation({
    summary: 'End a multi-turn interview session and trigger summary/evaluation work',
  })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiEntityResponse(InterviewSessionResponseDto, { status: 'created' })
  endSession(@CurrentUser() currentUser: AuthenticatedUser, @Param('sessionId') sessionId: string) {
    return this.interviewTurnService.endSession(currentUser, sessionId)
  }

  @Get(':sessionId/evaluation')
  @ApiOperation({ summary: 'Get the evaluation for an interview session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiEntityResponse(InterviewEvaluationDto)
  getEvaluation(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
  ) {
    return this.interviewTurnService.getEvaluation(currentUser, sessionId)
  }
}
