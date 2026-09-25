const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** e.g. "Aug 2026" */
export function formatMonthYear(value: string | Date): string {
  const d = toDate(value)
  if (!d) return ''
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

/** e.g. "August 12, 2026" */
export function formatLongDate(value: string | Date): string {
  const d = toDate(value)
  if (!d) return ''
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** e.g. "Aug 2023 — Present" */
export function formatDateRange(start: string, end: string, current: boolean): string {
  const s = formatMonthYear(start)
  const e = current ? 'Present' : formatMonthYear(end)
  if (!s && !e) return ''
  return `${s} — ${e}`
}

/** Relative time such as "3 days ago". */
export function timeAgo(value: string | Date): string {
  const d = toDate(value)
  if (!d) return ''
  const seconds = Math.round((Date.now() - d.getTime()) / 1000)
  const abs = Math.abs(seconds)
  const table: [number, string][] = [
    [60, 'second'],
    [3600, 'minute'],
    [86400, 'hour'],
    [604800, 'day'],
    [2629800, 'week'],
    [31557600, 'month'],
    [Infinity, 'year'],
  ]
  const divisors = [1, 60, 3600, 86400, 604800, 2629800, 31557600]
  for (let i = 0; i < table.length; i += 1) {
    if (abs < table[i][0]) {
      const val = Math.max(1, Math.floor(abs / divisors[i]))
      const unit = table[i][1]
      if (i === 0) return 'just now'
      return `${val} ${unit}${val !== 1 ? 's' : ''} ago`
    }
  }
  return ''
}

/** Estimate reading time in minutes from markdown/plain text. */
export function estimateReadingTime(text: string, wpm = 220): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wpm))
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

/** Compact number formatting, e.g. 1200 -> "1.2k". */
export function compactNumber(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}
