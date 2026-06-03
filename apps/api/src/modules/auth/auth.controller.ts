import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type {
  AuthenticatedReply,
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() payload: Record<string, unknown>,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.login(payload, requestContext(request))
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Public()
  @Post('register')
  async register(
    @Body() payload: Record<string, unknown>,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.register(payload, requestContext(request))
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Post('logout')
  async logout(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.logoutCurrentSession(currentUser)
    this.clearSessionCookie(reply)
    return result
  }

  @Post('logout-all')
  async logoutAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.logoutAllSessions(currentUser)
    this.clearSessionCookie(reply)
    return result
  }

  @Get('me')
  me(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.getSessionUser(currentUser)
  }

  @Get('sessions')
  sessions(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.listSessions(currentUser)
  }

  @Delete('sessions/:sessionId')
  revokeSession(@CurrentUser() currentUser: AuthenticatedUser, @Param('sessionId') sessionId: string) {
    return this.authService.revokeSession(currentUser, sessionId)
  }

  @Public()
  @Post('forgot-password')
  requestPasswordReset(@Body() payload: Record<string, unknown>) {
    return this.authService.requestPasswordReset(payload)
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() payload: Record<string, unknown>) {
    return this.authService.resetPassword(payload)
  }

  @Public()
  @Post('email-verification/resend')
  resendEmailVerification(@Body() payload: Record<string, unknown>) {
    return this.authService.resendEmailVerification(payload)
  }

  @Public()
  @Post('email-verification/confirm')
  confirmEmailVerification(@Body() payload: Record<string, unknown>) {
    return this.authService.confirmEmailVerification(payload)
  }

  private setSessionCookie(reply: AuthenticatedReply, sessionToken: string) {
    reply.setCookie(this.cookieName(), sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      path: '/',
      maxAge: this.configService.get<number>('app.authSessionTtlDays', 7) * 24 * 60 * 60,
    })
  }

  private clearSessionCookie(reply: AuthenticatedReply) {
    reply.clearCookie(this.cookieName(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      path: '/',
    })
  }

  private cookieName() {
    return this.configService.get<string>('app.authCookieName', 'interviewos_session')
  }

  private isProduction() {
    return this.configService.get<string>('app.env') === 'production'
  }
}

function requestContext(request: AuthenticatedRequest) {
  const forwardedFor = request.headers['x-forwarded-for']
  const ipAddress =
    typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]?.trim()
      : request.ip

  return {
    userAgent: typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : null,
    ipAddress: ipAddress ?? null,
  }
}
