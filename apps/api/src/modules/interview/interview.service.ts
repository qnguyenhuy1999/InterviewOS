import { Injectable, NotImplementedException } from '@nestjs/common'

import { InterviewRepository } from './interview.repository'

@Injectable()
export class InterviewService {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  createSession(_payload: Record<string, unknown>) {
    void this.interviewRepository
    throw new NotImplementedException()
  }

  findSessions() {
    void this.interviewRepository
    throw new NotImplementedException()
  }

  findSessionById(_sessionId: string) {
    void this.interviewRepository
    throw new NotImplementedException()
  }

  updateSession(_sessionId: string, _payload: Record<string, unknown>) {
    void this.interviewRepository
    throw new NotImplementedException()
  }

  deleteSession(_sessionId: string) {
    void this.interviewRepository
    throw new NotImplementedException()
  }
}
