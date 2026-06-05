import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { MessageResponseDto, SuccessResponseDto } from '../../../common/dto/api-response.dto'

export class LoginDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string
}

export class RegisterDto extends LoginDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string
}

export class RequestPasswordResetDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string
}

export class ResetPasswordDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  token!: string

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string
}

export class ResendEmailVerificationDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string
}

export class ConfirmEmailVerificationDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  token!: string
}

export class AuthenticatedUserDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty({ format: 'email' })
  email!: string

  @ApiProperty({ type: String, nullable: true })
  name!: string | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  emailVerifiedAt!: Date | null
}

export class AuthSessionResponseDto {
  @ApiProperty({ type: () => AuthenticatedUserDto })
  user!: AuthenticatedUserDto
}

export class ActiveAuthSessionDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: String, nullable: true })
  userAgent!: string | null

  @ApiProperty({ type: String, nullable: true })
  ipAddress!: string | null

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt!: Date

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastSeenAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty()
  isCurrent!: boolean
}

export class ForgotPasswordResponseDto extends MessageResponseDto {}

export class AuthSuccessResponseDto extends SuccessResponseDto {}
