import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

type VerificationEmail = {
  email: string
  link: string
}

type PasswordResetEmail = {
  email: string
  link: string
}

interface AuthEmailProvider {
  sendVerificationEmail(payload: VerificationEmail): Promise<void>
  sendPasswordResetEmail(payload: PasswordResetEmail): Promise<void>
}

export function formatVerificationConsoleMessage(payload: VerificationEmail) {
  return `Verification email requested for ${payload.email}: ${payload.link}`
}

export function formatPasswordResetConsoleMessage(payload: PasswordResetEmail) {
  return `Password reset email requested for ${payload.email}: ${payload.link}`
}

@Injectable()
export class AuthEmailService {
  private readonly provider: AuthEmailProvider

  constructor(private readonly configService: ConfigService) {
    const provider = this.configService.get<string>('email.provider', 'console')
    const env = this.configService.get<string>('app.env', 'development')

    if (provider === 'console' && env === 'production') {
      throw new Error('Console email provider is not allowed in production.')
    }

    this.provider =
      provider === 'noop' ? new NoopAuthEmailProvider() : new ConsoleAuthEmailProvider()
  }

  sendVerificationEmail(payload: VerificationEmail) {
    return this.provider.sendVerificationEmail(payload)
  }

  sendPasswordResetEmail(payload: PasswordResetEmail) {
    return this.provider.sendPasswordResetEmail(payload)
  }
}

class ConsoleAuthEmailProvider implements AuthEmailProvider {
  private readonly logger = new Logger(ConsoleAuthEmailProvider.name)

  async sendVerificationEmail(payload: VerificationEmail) {
    this.logger.log(formatVerificationConsoleMessage(payload))
  }

  async sendPasswordResetEmail(payload: PasswordResetEmail) {
    this.logger.log(formatPasswordResetConsoleMessage(payload))
  }
}

class NoopAuthEmailProvider implements AuthEmailProvider {
  async sendVerificationEmail(_payload: VerificationEmail) {}

  async sendPasswordResetEmail(_payload: PasswordResetEmail) {}
}
