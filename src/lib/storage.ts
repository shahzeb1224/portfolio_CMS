/**
 * Storage abstraction. UI and repositories never touch `localStorage`
 * directly — they go through this adapter. Swapping the persistence engine
 * (e.g. to IndexedDB) means implementing this one interface.
 */
export interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  has(key: string): boolean
  keys(): string[]
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly namespace: string) {}

  private full(key: string): string {
    return `${this.namespace}:${key}`
  }

  private get storageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage
    } catch {
      return false
    }
  }

  get<T>(key: string): T | null {
    if (!this.storageAvailable) return null
    try {
      const raw = window.localStorage.getItem(this.full(key))
      return raw === null ? null : (JSON.parse(raw) as T)
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storageAvailable) return
    try {
      window.localStorage.setItem(this.full(key), JSON.stringify(value))
    } catch (err) {
      // Quota / serialization errors surface here.
      console.error(`[storage] failed to persist "${key}"`, err)
    }
  }

  remove(key: string): void {
    if (!this.storageAvailable) return
    window.localStorage.removeItem(this.full(key))
  }

  has(key: string): boolean {
    if (!this.storageAvailable) return false
    return window.localStorage.getItem(this.full(key)) !== null
  }

  keys(): string[] {
    if (!this.storageAvailable) return []
    const prefix = `${this.namespace}:`
    const result: string[] = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(prefix)) result.push(k.slice(prefix.length))
    }
    return result
  }
}

/** Shared app storage instance + the collection keys used by repositories. */
export const storage = new LocalStorageAdapter('portfolio_cms')

export const STORAGE_KEYS = {
  version: '__version',
  profile: 'profile',
  settings: 'settings',
  skills: 'skills',
  projects: 'projects',
  experience: 'experience',
  education: 'education',
  certifications: 'certifications',
  services: 'services',
  testimonials: 'testimonials',
  blog: 'blog',
  messages: 'messages',
  session: 'session',
} as const

/** Bump when the seed shape changes to trigger a reseed of untouched data. */
export const DATA_VERSION = 1
