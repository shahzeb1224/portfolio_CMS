import type { AccentKey, ThemeMode } from '@/types'

/** Accent palettes as RGB channel strings (match the CSS variable format). */
export const ACCENTS: Record<
  AccentKey,
  { label: string; base: string; hover: string; softDark: string; softLight: string; swatch: string }
> = {
  violet: {
    label: 'Violet',
    base: '139 92 246',
    hover: '124 58 237',
    softDark: '45 33 74',
    softLight: '237 233 254',
    swatch: '#8B5CF6',
  },
  blue: {
    label: 'Electric Blue',
    base: '59 130 246',
    hover: '37 99 235',
    softDark: '23 37 66',
    softLight: '219 234 254',
    swatch: '#3B82F6',
  },
  emerald: {
    label: 'Emerald',
    base: '16 185 129',
    hover: '5 150 105',
    softDark: '6 46 39',
    softLight: '209 250 229',
    swatch: '#10B981',
  },
  cyan: {
    label: 'Cyan',
    base: '34 211 238',
    hover: '6 182 212',
    softDark: '8 51 68',
    softLight: '207 250 254',
    swatch: '#22D3EE',
  },
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (mode === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
    root.classList.remove('light')
  }
  root.style.colorScheme = mode
}

export function applyAccent(key: AccentKey, mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  const accent = ACCENTS[key] ?? ACCENTS.violet
  const root = document.documentElement
  root.style.setProperty('--accent', accent.base)
  root.style.setProperty('--accent-hover', accent.hover)
  root.style.setProperty('--accent-soft', mode === 'light' ? accent.softLight : accent.softDark)
}
