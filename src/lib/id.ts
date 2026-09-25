/**
 * Stable id generation. Uses crypto.randomUUID when available with a safe
 * fallback. These ids are the frontend's canonical identifiers; a future
 * backend maps Mongo's `_id -> id` and the frontend keeps using `id`.
 */
export function generateId(prefix?: string): string {
  let uuid: string
  const cryptoObj = globalThis.crypto as Crypto | undefined
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    uuid = cryptoObj.randomUUID()
  } else {
    uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16)
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  return prefix ? `${prefix}_${uuid}` : uuid
}

export function nowISO(): string {
  return new Date().toISOString()
}
