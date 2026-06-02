import { AIGateway as PackageAIGateway } from '@interviewos/ai'
import type { AnalyzeResumeInput, AnalyzeResumeResult } from '@interviewos/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AIGateway {
  constructor(private readonly gateway: PackageAIGateway) {}

  analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    return this.gateway.analyzeResume(input)
  }
}
