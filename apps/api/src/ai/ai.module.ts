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
                    throw new Error(
                      'OPENAI_GATEWAY_BASE_URL is required when AI_PROVIDER=openai.',
                    )
                  })(),
                model: configService.get<string>('openai.model', 'gpt-5.4-mini'),
                organization: configService.get<string>('openai.organization'),
                project: configService.get<string>('openai.project'),
              })

        return new PackageAIGateway(provider)
      },
    },
    AIGateway,
  ],
  exports: [AIGateway],
})
export class AIModule {}
