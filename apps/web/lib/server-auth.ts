import 'server-only'

import type { AuthSessionResponse } from '@interviewos/types'
import { redirect } from 'next/navigation'

import { serverApiClient } from './server-api-client'

export async function requireSession() {
  try {
    return await serverApiClient<AuthSessionResponse>('/auth/me')
  } catch {
    redirect('/login')
  }
}

export async function getOptionalSession() {
  try {
    return await serverApiClient<AuthSessionResponse>('/auth/me')
  } catch {
    return null
  }
}
