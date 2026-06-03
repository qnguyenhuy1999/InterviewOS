export interface AuthenticatedUser {
  id: string
  sessionId: string
  email: string
  name: string | null
  emailVerifiedAt: Date | null
}

export interface AuthSessionResponse {
  user: AuthenticatedUser
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name?: string
}

export interface ActiveAuthSession {
  id: string
  userAgent: string | null
  ipAddress: string | null
  expiresAt: Date
  lastSeenAt: Date | null
  createdAt: Date
  isCurrent: boolean
}

export interface RequestPasswordResetInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export interface ResendEmailVerificationInput {
  email: string
}

export interface ConfirmEmailVerificationInput {
  token: string
}
