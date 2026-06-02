import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: Record<string, unknown>) {
    return this.authService.login(payload)
  }

  @Post('register')
  register(@Body() payload: Record<string, unknown>) {
    return this.authService.register(payload)
  }
}
