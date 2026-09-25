import { config } from '@/lib/config'
import { AppError } from '@/lib/errors'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import type { Session } from '@/types'

/**
 * Thin fetch wrapper for the future Express REST API. It is fully implemented
 * and type-safe today; it simply isn't wired up until VITE_DATA_SOURCE="api".
 * This is what makes the Mock -> Api swap a configuration change, not a rewrite.
 */
export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private authHeader(): Record<string, string> {
    const session = storage.get<Session>(STORAGE_KEYS.session)
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let res: Response
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...this.authHeader(),
          ...(init.headers ?? {}),
        },
      })
    } catch {
      throw new AppError('network', 'Network error — could not reach the server.')
    }

    if (res.status === 204) return undefined as T

    let body: unknown = null
    const text = await res.text()
    if (text) {
      try {
        body = JSON.parse(text)
      } catch {
        body = text
      }
    }

    if (!res.ok) {
      const message =
        (body as { message?: string } | null)?.message ?? `Request failed (${res.status})`
      const kind =
        res.status === 401
          ? 'unauthorized'
          : res.status === 403
            ? 'forbidden'
            : res.status === 404
              ? 'not_found'
              : res.status === 409
                ? 'conflict'
                : res.status === 422
                  ? 'validation'
                  : 'unknown'
      throw new AppError(kind, message, (body as { fieldErrors?: Record<string, string> } | null)?.fieldErrors)
    }

    return body as T
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }
  post<T>(path: string, data: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(data) })
  }
  put<T>(path: string, data: unknown) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(data) })
  }
  del<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const http = new HttpClient(config.apiUrl)
