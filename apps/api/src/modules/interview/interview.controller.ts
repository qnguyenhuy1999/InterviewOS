import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { InterviewService } from './interview.service'

@Controller('sessions')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  createSession(@Body() payload: Record<string, unknown>) {
    return this.interviewService.createSession(payload)
  }

  @Get()
  findSessions() {
    return this.interviewService.findSessions()
  }

  @Get(':sessionId')
  findSessionById(@Param('sessionId') sessionId: string) {
    return this.interviewService.findSessionById(sessionId)
  }

  @Patch(':sessionId')
  updateSession(
    @Param('sessionId') sessionId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.interviewService.updateSession(sessionId, payload)
  }

  @Delete(':sessionId')
  deleteSession(@Param('sessionId') sessionId: string) {
    return this.interviewService.deleteSession(sessionId)
  }
}
