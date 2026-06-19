import { resolveAuthCookieName } from '@interviewos/config'
import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiEntityResponse, ApiNullableEntityResponse } from '../../common/swagger/swagger-helpers'
import {
  UpdateMeDto,
  UpsertUserLearningProfileDto,
  UserDto,
  UserLearningProfileResponseDto,
} from './dto/users.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@ApiCookieAuth(resolveAuthCookieName())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiEntityResponse(UserDto)
  findMe(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.usersService.findMe(currentUser)
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiBody({ type: UpdateMeDto })
  @ApiEntityResponse(UserDto)
  updateMe(@CurrentUser() currentUser: AuthenticatedUser, @Body() payload: UpdateMeDto) {
    return this.usersService.updateMe(currentUser, payload)
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get the current user learning profile' })
  @ApiNullableEntityResponse(UserLearningProfileResponseDto)
  getProfile(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.usersService.getProfile(currentUser)
  }

  @Post('me/profile')
  @ApiOperation({ summary: 'Create or replace the current user learning profile' })
  @ApiBody({ type: UpsertUserLearningProfileDto })
  @ApiEntityResponse(UserLearningProfileResponseDto, { status: 'created' })
  createProfile(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() payload: UpsertUserLearningProfileDto,
  ) {
    return this.usersService.upsertProfile(currentUser, payload)
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update the current user learning profile' })
  @ApiBody({ type: UpsertUserLearningProfileDto })
  @ApiEntityResponse(UserLearningProfileResponseDto)
  updateProfile(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() payload: UpsertUserLearningProfileDto,
  ) {
    return this.usersService.upsertProfile(currentUser, payload)
  }
}
