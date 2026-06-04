import { Controller, Get, Param } from '@nestjs/common'

import { CompanyModeService } from './company-mode.service'

@Controller(['company-modes', 'company-profiles'])
export class CompanyModeController {
  constructor(private readonly companyModeService: CompanyModeService) {}

  @Get()
  findAll() {
    return this.companyModeService.findAll()
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.companyModeService.findBySlug(slug)
  }
}
