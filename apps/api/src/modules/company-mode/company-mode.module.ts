import { Module } from '@nestjs/common'

import { CompanyModeController } from './company-mode.controller'
import { CompanyModeRepository } from './company-mode.repository'
import { CompanyModeService } from './company-mode.service'

@Module({
  controllers: [CompanyModeController],
  providers: [CompanyModeService, CompanyModeRepository],
  exports: [CompanyModeService],
})
export class CompanyModeModule {}
