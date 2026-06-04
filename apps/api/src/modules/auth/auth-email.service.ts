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

@Injectable()
export class AuthEmailService {
  private readonly provider: AuthEmailProvider

  constructor(private readonly configService: ConfigService) {
    const provider = this.configService.get<string>('email.provider', 'console')
    this.provider = provider === 'noop' ? new NoopAuthEmailProvider() : new ConsoleAuthEmailProvider()
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
    this.logger.log(`Email verification link for ${payload.email}: ${payload.link}`)
  }

  async sendPasswordResetEmail(payload: PasswordResetEmail) {
    this.logger.log(`Password reset link for ${payload.email}: ${payload.link}`)
  }
}

class NoopAuthEmailProvider implements AuthEmailProvider {
  async sendVerificationEmail(_payload: VerificationEmail) {}

  async sendPasswordResetEmail(_payload: PasswordResetEmail) {}
}
