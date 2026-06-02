import { Body, Controller, Post } from '@nestjs/common'

import { ResumeService } from './resume.service'

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('analyze')
  analyze(@Body() payload: Record<string, unknown>) {
    return this.resumeService.analyze(payload)
  }
}
