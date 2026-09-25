import type { ImageAssetRepository } from '../types'
import {
  saveStoredAsset,
  getStoredAsset,
  deleteStoredAsset,
  hasStoredAsset,
  getAllStoredAssetIds,
} from '@/lib/indexedDb'
import { generateId, nowISO } from '@/lib/id'

export class IndexedDbImageAssetRepository implements ImageAssetRepository {
  private objectUrlCache = new Map<string, string>()

  async upload(file: File): Promise<string> {
    const assetId = generateId('img')
    await saveStoredAsset({
      id: assetId,
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file,
      createdAt: nowISO(),
    })
    return `asset://${assetId}`
  }

  async resolve(reference: string): Promise<string> {
    if (!reference) return ''
    if (!reference.startsWith('asset://')) {
      return reference
    }

    const id = reference.replace('asset://', '')

    // If we already have an active object URL for this asset in this session, reuse it
    const cached = this.objectUrlCache.get(id)
    if (cached) {
      return cached
    }

    const asset = await getStoredAsset(id)
    if (!asset) {
      console.warn(`[ImageAsset] Stored asset not found in IndexedDB: ${id}`)
      return ''
    }

    const objectUrl = URL.createObjectURL(asset.blob)
    this.objectUrlCache.set(id, objectUrl)
    return objectUrl
  }

  async remove(reference: string): Promise<void> {
    if (!reference || !reference.startsWith('asset://')) return
    const id = reference.replace('asset://', '')
    const cached = this.objectUrlCache.get(id)
    if (cached) {
      URL.revokeObjectURL(cached)
      this.objectUrlCache.delete(id)
    }
    await deleteStoredAsset(id)
  }

  async exists(reference: string): Promise<boolean> {
    if (!reference) return false
    if (!reference.startsWith('asset://')) return true
    const id = reference.replace('asset://', '')
    return hasStoredAsset(id)
  }

  async listAllKeys(): Promise<string[]> {
    return getAllStoredAssetIds()
  }
}
