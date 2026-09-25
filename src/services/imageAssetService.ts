import { repositories } from '@/repositories'
import type { ImageAssetRepository } from '@/repositories/types'

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

export class ImageAssetService {
  constructor(private readonly repo: ImageAssetRepository) {}

  /**
   * Validate file format, size, and image decode capability.
   */
  async validateFile(file: File): Promise<ImageValidationResult> {
    if (!file) {
      return { valid: false, error: 'No file provided.' }
    }

    // Check MIME type or extension
    const mime = file.type.toLowerCase()
    const name = file.name.toLowerCase()
    const hasValidExt = /\.(jpe?g|png|webp|gif)$/i.test(name)
    const hasValidMime = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mime)

    if (!hasValidMime && !hasValidExt) {
      return {
        valid: false,
        error: 'Unsupported image format. Please select a JPEG, PNG, WebP, or GIF image.',
      }
    }

    // Check size limit (5 MB)
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: 'Image must be 5 MB or smaller.',
      }
    }

    // Decode validation: verify file actually decodes as a valid image
    try {
      if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
        const bitmap = await createImageBitmap(file)
        bitmap.close()
      } else if (typeof window !== 'undefined') {
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          const url = URL.createObjectURL(file)
          img.onload = () => {
            URL.revokeObjectURL(url)
            resolve()
          }
          img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Corrupt or undecodable image'))
          }
          img.src = url
        })
      }
    } catch {
      return {
        valid: false,
        error: 'The selected file is not a valid or readable image.',
      }
    }

    return { valid: true }
  }

  /**
   * Validates and uploads a file, returning its persistent asset reference.
   */
  async upload(file: File): Promise<string> {
    const check = await this.validateFile(file)
    if (!check.valid) {
      throw new Error(check.error || 'Invalid image')
    }
    return this.repo.upload(file)
  }

  /**
   * Resolves an asset reference or standard URL to a displayable URL.
   */
  async resolve(reference: string): Promise<string> {
    if (!reference) return ''
    return this.repo.resolve(reference)
  }

  /**
   * Removes an asset reference.
   */
  async remove(reference: string): Promise<void> {
    if (!reference) return
    return this.repo.remove(reference)
  }

  /**
   * Checks if an asset reference exists.
   */
  async exists(reference: string): Promise<boolean> {
    if (!reference) return false
    return this.repo.exists(reference)
  }

  /**
   * Safely delete orphaned local image assets that are no longer referenced by any entity.
   */
  async cleanupOrphaned(referencedAssetRefs: Iterable<string>): Promise<void> {
    try {
      const activeIds = new Set<string>()
      for (const ref of referencedAssetRefs) {
        if (ref && ref.startsWith('asset://')) {
          activeIds.add(ref.replace('asset://', ''))
        }
      }

      const allKeys = await this.repo.listAllKeys()
      for (const key of allKeys) {
        if (!activeIds.has(key)) {
          await this.repo.remove(`asset://${key}`)
        }
      }
    } catch (err) {
      console.error('[ImageAssetService] cleanupOrphaned error:', err)
    }
  }
}

export const imageAssetService = new ImageAssetService(repositories.assets)
