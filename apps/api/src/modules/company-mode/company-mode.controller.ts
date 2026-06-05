import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import { CompanyModeResponseDto } from './dto/company-mode.dto'
import { CompanyModeService } from './company-mode.service'

@ApiTags('company-mode')
@Controller(['company-modes', 'company-profiles'])
export class CompanyModeController {
  constructor(private readonly companyModeService: CompanyModeService) {}

  @Get()
  @ApiOperation({ summary: 'List active company interview modes' })
  @ApiArrayResponse(CompanyModeResponseDto)
  findAll() {
    return this.companyModeService.findAll()
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a company interview mode by slug' })
  @ApiParam({ name: 'slug', type: String })
  @ApiEntityResponse(CompanyModeResponseDto)
  findBySlug(@Param('slug') slug: string) {
    return this.companyModeService.findBySlug(slug)
  }
}
