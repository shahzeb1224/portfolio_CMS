import type { ID } from './common'

export interface AdminUser {
  id: ID
  name: string
  email: string
  avatar: string
  role: 'admin'
}

export interface Credentials {
  email: string
  password: string
}

/**
 * A mock session. The shape mirrors what a real JWT-based Express auth flow
 * would return so the AuthProvider can be swapped to hit `/api/auth` later
 * without touching consumers.
 */
export interface Session {
  user: AdminUser
  token: string
  expiresAt: string
}
