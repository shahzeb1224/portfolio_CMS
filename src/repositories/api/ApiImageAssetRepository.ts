import type { ImageAssetRepository } from '../types'
import { config } from '@/lib/config'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import type { Session } from '@/types'

/**
 * Backend-ready Image Asset Repository for when VITE_DATA_SOURCE="api".
 */
export class ApiImageAssetRepository implements ImageAssetRepository {
  private authHeader(): Record<string, string> {
    const session = storage.get<Session>(STORAGE_KEYS.session)
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
  }

  async upload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${config.apiUrl}/assets/upload`, {
      method: 'POST',
      headers: {
        ...this.authHeader(),
      },
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`)
    }

    const data = (await res.json()) as { url?: string; reference?: string }
    return data.url || data.reference || ''
  }

  async resolve(reference: string): Promise<string> {
    if (!reference) return ''
    if (reference.startsWith('http://') || reference.startsWith('https://') || reference.startsWith('/')) {
      return reference
    }
    return `${config.apiUrl}/assets/${reference}`
  }

  async remove(reference: string): Promise<void> {
    if (!reference) return
    const id = reference.startsWith('asset://') ? reference.replace('asset://', '') : reference
    await fetch(`${config.apiUrl}/assets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...this.authHeader(),
      },
    })
  }

  async exists(reference: string): Promise<boolean> {
    if (!reference) return false
    try {
      const url = await this.resolve(reference)
      const res = await fetch(url, { method: 'HEAD' })
      return res.ok
    } catch {
      return false
    }
  }

  async listAllKeys(): Promise<string[]> {
    return []
  }
}
