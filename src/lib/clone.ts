/**
 * Deep clone used at the repository boundary so callers can never mutate the
 * stored objects by reference — mirrors how a real API would hand back fresh
 * copies on every request.
 */
export function deepClone<T>(value: T): T {
  const sc = (globalThis as { structuredClone?: <U>(v: U) => U }).structuredClone
  if (typeof sc === 'function') {
    try {
      return sc(value)
    } catch {
      /* fall through to JSON */
    }
  }
  return JSON.parse(JSON.stringify(value)) as T
}
