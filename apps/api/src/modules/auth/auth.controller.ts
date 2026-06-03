import { Body, Controller, Get, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { AuthenticatedReply } from '../../common/auth/authenticated-request'
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
  async login(@Body() payload: Record<string, unknown>, @Res({ passthrough: true }) reply: AuthenticatedReply) {
    const result = await this.authService.login(payload)
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Public()
  @Post('register')
  async register(
    @Body() payload: Record<string, unknown>,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.register(payload)
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: AuthenticatedReply) {
    reply.clearCookie(this.cookieName(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      path: '/',
    })
    return { success: true }
  }

  @Get('me')
  me(@CurrentUser() currentUser: { sub: string; email: string; name: string | null }) {
    return this.authService.getSessionUser(currentUser)
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

  private cookieName() {
    return this.configService.get<string>('app.authCookieName', 'interviewos_session')
  }

  private isProduction() {
    return this.configService.get<string>('app.env') === 'production'
  }
}
