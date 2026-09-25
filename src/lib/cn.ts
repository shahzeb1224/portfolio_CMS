/**
 * Tiny classNames joiner (no external dependency). Supports strings, arrays and
 * conditional objects: cn('a', cond && 'b', { c: isC }).
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | undefined | null>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []

  const walk = (value: ClassValue): void => {
    if (!value) return
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value))
      return
    }
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    if (typeof value === 'object') {
      for (const key in value) {
        if (value[key]) out.push(key)
      }
    }
  }

  inputs.forEach(walk)
  return out.join(' ')
}
