import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class CompanyModeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.companyMode.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  }

  findBySlug(slug: string) {
    return this.prisma.companyMode.findUnique({ where: { slug, isActive: true } })
  }
}
