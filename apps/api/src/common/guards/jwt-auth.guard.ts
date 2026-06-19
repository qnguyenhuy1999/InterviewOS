import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

import { AuthService } from '../../modules/auth/auth.service'
import type { AuthenticatedRequest } from '../auth/authenticated-request'
import { ALLOW_UNVERIFIED_EMAIL } from '../decorators/allow-unverified-email.decorator'
import { IS_PUBLIC_ROUTE } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const cookieName = this.configService.get<string>('app.authCookieName', 'interviewos_session')
    const token = request.cookies?.[cookieName]

    if (!token) {
      throw new UnauthorizedException('Authentication required.')
    }

    request.user = await this.authService.authenticateSessionToken(token, {
      userAgent:
        typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : null,
      ipAddress: request.ip ?? null,
    })

    const allowUnverifiedEmail = this.reflector.getAllAndOverride<boolean>(ALLOW_UNVERIFIED_EMAIL, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!allowUnverifiedEmail && request.user.emailVerifiedAt === null) {
      throw new ForbiddenException('Email verification is required.')
    }

    return true
  }
}
