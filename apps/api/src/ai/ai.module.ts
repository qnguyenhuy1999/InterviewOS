import {
  AIGateway as PackageAIGateway,
  type AIProvider,
  MockAIProvider,
  OpenAIProvider,
} from '@interviewos/ai'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AIGateway } from './ai.gateway'
import { AIAuditRepository } from './ai-audit.repository'
import { AIContextBuilder } from './ai-context.builder'
import { AIObservabilityController } from './ai-observability.controller'

@Module({
  controllers: [AIObservabilityController],
  providers: [
    {
      provide: PackageAIGateway,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const providerName = configService.get<'mock' | 'openai'>('ai.provider', 'mock')
        const provider: AIProvider =
          providerName === 'mock'
            ? new MockAIProvider()
            : new OpenAIProvider({
                apiKey:
                  configService.get<string>('openai.apiKey') ??
                  (() => {
                    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai.')
                  })(),
                baseUrl:
                  configService.get<string>('openai.gatewayBaseUrl') ??
                  (() => {
                    throw new Error('OPENAI_GATEWAY_BASE_URL is required when AI_PROVIDER=openai.')
                  })(),
                model: configService.get<string>('openai.model', 'gpt-5.4-mini'),
                organization: configService.get<string>('openai.organization'),
                project: configService.get<string>('openai.project'),
              })

        return new PackageAIGateway(provider)
      },
    },
    AIAuditRepository,
    AIContextBuilder,
    AIGateway,
  ],
  exports: [AIContextBuilder, AIGateway],
})
export class AIModule {}
