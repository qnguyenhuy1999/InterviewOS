import { Body, Controller, Get, Patch } from '@nestjs/common'

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
  updateMe(
    @CurrentUser() currentUser: unknown,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.usersService.updateMe(currentUser, payload)
  }
}
