/**
 * IndexedDB storage adapter for binary image assets.
 * Keeps binary blobs out of localStorage to prevent quota exhaustion.
 */

const DB_NAME = 'portfolio_assets_db'
const DB_VERSION = 1
const STORE_NAME = 'assets'

export interface StoredAsset {
  id: string
  name: string
  type: string
  size: number
  blob: Blob
  createdAt: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not available in this environment'))
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'))
  })
}

export async function getStoredAsset(id: string): Promise<StoredAsset | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(id)
      req.onsuccess = () => resolve((req.result as StoredAsset) || null)
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('[IndexedDB] getStoredAsset failed:', err)
    return null
  }
}

export async function saveStoredAsset(asset: StoredAsset): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(asset)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function deleteStoredAsset(id: string): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('[IndexedDB] deleteStoredAsset failed:', err)
  }
}

export async function hasStoredAsset(id: string): Promise<boolean> {
  const asset = await getStoredAsset(id)
  return !!asset
}

export async function getAllStoredAssetIds(): Promise<string[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAllKeys()
      req.onsuccess = () => resolve((req.result as string[]) || [])
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('[IndexedDB] getAllStoredAssetIds failed:', err)
    return []
  }
}
