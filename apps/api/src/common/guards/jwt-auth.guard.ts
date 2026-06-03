import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'

import type { AuthenticatedRequest, AuthenticatedUser } from '../auth/authenticated-request'
import { IS_PUBLIC_ROUTE } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
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

    try {
      const payload = this.jwtService.verify<AuthenticatedUser>(token, {
        secret: this.configService.get<string>('app.jwtSecret'),
      })
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException('Session is invalid or expired.')
    }
  }
}
