import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import { generateId } from '@/lib/id'
import { UnauthorizedError } from '@/lib/errors'
import type { AdminUser, Credentials, Session } from '@/types'

/**
 * Demo-only credentials. This is intentionally NOT a real auth system — it
 * exists so the admin can be exercised end-to-end. The provider is shaped like
 * a real JWT flow (issues a Session with a token + expiry) so it can be swapped
 * for an Express `/api/auth` client without touching any consumer.
 */
export const DEMO_CREDENTIALS: Credentials = {
  email: 'admin@demo.dev',
  password: 'demo1234',
}

const DEMO_ADMIN: AdminUser = {
  id: 'admin',
  name: 'Portfolio Admin',
  email: DEMO_CREDENTIALS.email,
  avatar: 'https://i.pravatar.cc/120?img=12',
  role: 'admin',
}

const SESSION_TTL_DAYS = 7

interface AuthContextValue {
  status: 'idle' | 'loading'
  user: AdminUser | null
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isValidSession(session: Session | null): session is Session {
  return !!session && new Date(session.expiresAt).getTime() > Date.now()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = storage.get<Session>(STORAGE_KEYS.session)
    return isValidSession(stored) ? stored : null
  })
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  // Clean up an expired session on mount.
  useEffect(() => {
    const stored = storage.get<Session>(STORAGE_KEYS.session)
    if (stored && !isValidSession(stored)) storage.remove(STORAGE_KEYS.session)
  }, [])

  const login = useCallback(async (credentials: Credentials) => {
    setStatus('loading')
    try {
      // Simulate network latency so loading states are exercised.
      await new Promise((resolve) => setTimeout(resolve, 550))
      const ok =
        credentials.email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password
      if (!ok) throw new UnauthorizedError('Invalid email or password.')

      const expires = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000).toISOString()
      const next: Session = { user: DEMO_ADMIN, token: generateId('tok'), expiresAt: expires }
      storage.set(STORAGE_KEYS.session, next)
      setSession(next)
    } finally {
      setStatus('idle')
    }
  }, [])

  const logout = useCallback(() => {
    storage.remove(STORAGE_KEYS.session)
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      login,
      logout,
    }),
    [status, session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
