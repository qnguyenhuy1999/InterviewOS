import { Injectable, NotFoundException } from '@nestjs/common'

import { CompanyModeRepository } from './company-mode.repository'

@Injectable()
export class CompanyModeService {
  constructor(private readonly companyModeRepository: CompanyModeRepository) {}

  findAll() {
    return this.companyModeRepository.findAll()
  }

  async findBySlug(slug: string) {
    const mode = await this.companyModeRepository.findBySlug(slug)
    if (!mode) throw new NotFoundException(`Company mode "${slug}" not found.`)
    return mode
  }
}
