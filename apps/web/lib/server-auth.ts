import 'server-only'

import { API_ROUTES } from '@interviewos/config'
import type { AuthSessionResponse } from '@interviewos/types'
import { redirect } from 'next/navigation'

import { serverApiClient } from './server-api-client'

export async function requireSession() {
  try {
    return await serverApiClient<AuthSessionResponse>(API_ROUTES.auth.me)
  } catch {
    redirect('/login')
  }
}

export async function getOptionalSession() {
  try {
    return await serverApiClient<AuthSessionResponse>(API_ROUTES.auth.me)
  } catch {
    return null
  }
}
