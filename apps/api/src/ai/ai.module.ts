import {
  AIGateway as PackageAIGateway,
  type AIProvider,
  MockAIProvider,
  OpenAIProvider,
} from '@interviewos/ai'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AIGateway } from './ai.gateway'

@Module({
  providers: [
    {
      provide: PackageAIGateway,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const providerName = configService.get<'mock' | 'openai'>('ai.provider', 'mock')
        const provider: AIProvider =
          providerName === 'mock' ? new MockAIProvider() : new OpenAIProvider()

        return new PackageAIGateway(provider)
      },
    },
    AIGateway,
  ],
  exports: [AIGateway],
})
export class AIModule {}
