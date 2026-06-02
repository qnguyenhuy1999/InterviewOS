import { Injectable, NotImplementedException } from '@nestjs/common'

import { ResumeRepository } from './resume.repository'

@Injectable()
export class ResumeService {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  analyze(_payload: Record<string, unknown>) {
    void this.resumeRepository
    throw new NotImplementedException()
  }
}
