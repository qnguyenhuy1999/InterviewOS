export interface AuthenticatedUser {
  id: string
  email: string
  name: string | null
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
