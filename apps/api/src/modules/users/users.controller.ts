import { Body, Controller, Get, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findMe(@CurrentUser() currentUser: unknown) {
    return this.usersService.findMe(currentUser)
  }

  @Patch('me')
  updateMe(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.usersService.updateMe(currentUser, payload)
  }

  @Get('me/profile')
  getProfile(@CurrentUser() currentUser: unknown) {
    return this.usersService.getProfile(currentUser)
  }

  @Post('me/profile')
  createProfile(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.usersService.upsertProfile(currentUser, payload)
  }

  @Patch('me/profile')
  updateProfile(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.usersService.upsertProfile(currentUser, payload)
  }
}
