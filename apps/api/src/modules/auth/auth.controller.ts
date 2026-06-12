import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type {
  AuthenticatedReply,
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { AuthThrottle } from '../../common/decorators/throttle.decorator'
import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import { AuthService } from './auth.service'
import {
  ActiveAuthSessionDto,
  AuthSessionResponseDto,
  AuthSuccessResponseDto,
  ConfirmEmailVerificationDto,
  ForgotPasswordResponseDto,
  LoginDto,
  RegisterDto,
  RequestPasswordResetDto,
  ResendEmailVerificationDto,
  ResetPasswordDto,
} from './dto/auth.dto'

@ApiTags('auth')
@ApiCookieAuth('interviewos_session')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @AuthThrottle()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiEntityResponse(AuthSessionResponseDto, { status: 'created' })
  async login(
    @Body() payload: LoginDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.login(payload, requestContext(request))
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Public()
  @AuthThrottle()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @ApiEntityResponse(AuthSessionResponseDto, { status: 'created' })
  async register(
    @Body() payload: RegisterDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.register(payload, requestContext(request))
    this.setSessionCookie(reply, result.sessionToken)
    return { user: result.user }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout the current session' })
  @ApiEntityResponse(AuthSuccessResponseDto, { status: 'created' })
  async logout(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.logoutCurrentSession(currentUser)
    this.clearSessionCookie(reply)
    return result
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Logout all active sessions' })
  @ApiEntityResponse(AuthSuccessResponseDto, { status: 'created' })
  async logoutAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res({ passthrough: true }) reply: AuthenticatedReply,
  ) {
    const result = await this.authService.logoutAllSessions(currentUser)
    this.clearSessionCookie(reply)
    return result
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated session user' })
  @ApiEntityResponse(AuthSessionResponseDto)
  me(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.getSessionUser(currentUser)
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List active sessions for the current user' })
  @ApiArrayResponse(ActiveAuthSessionDto)
  sessions(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.listSessions(currentUser)
  }

  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: 'Revoke a specific active session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiEntityResponse(AuthSuccessResponseDto)
  revokeSession(@CurrentUser() currentUser: AuthenticatedUser, @Param('sessionId') sessionId: string) {
    return this.authService.revokeSession(currentUser, sessionId)
  }

  @Public()
  @AuthThrottle()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiEntityResponse(ForgotPasswordResponseDto, { status: 'created' })
  requestPasswordReset(@Body() payload: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(payload)
  }

  @Public()
  @AuthThrottle()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with a valid reset token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiEntityResponse(AuthSuccessResponseDto, { status: 'created' })
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload)
  }

  @Public()
  @AuthThrottle()
  @Post('email-verification/resend')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiBody({ type: ResendEmailVerificationDto })
  @ApiEntityResponse(AuthSuccessResponseDto, { status: 'created' })
  resendEmailVerification(@Body() payload: ResendEmailVerificationDto) {
    return this.authService.resendEmailVerification(payload)
  }

  @Public()
  @Post('email-verification/confirm')
  @ApiOperation({ summary: 'Confirm email verification token' })
  @ApiBody({ type: ConfirmEmailVerificationDto })
  @ApiEntityResponse(AuthSuccessResponseDto, { status: 'created' })
  confirmEmailVerification(@Body() payload: ConfirmEmailVerificationDto) {
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
  return {
    userAgent: typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : null,
    ipAddress: request.ip ?? null,
  }
}
