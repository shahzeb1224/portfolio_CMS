import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyAccent, applyTheme } from '@/lib/theme'
import { storage } from '@/lib/storage'
import type { AccentKey, ThemeMode } from '@/types'
import { useData } from './DataProvider'

const THEME_KEY = 'ui_theme'

interface ThemeContextValue {
  mode: ThemeMode
  isDark: boolean
  accent: AccentKey
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Theme mode is a per-visitor preference (persisted locally); the brand accent
 * is a site-wide setting sourced from Admin → Settings → Appearance. Both are
 * applied to <html> via CSS variables so every component themes for free.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useData()
  const accent = settings.appearance.accent

  const [mode, setModeState] = useState<ThemeMode>(
    () => storage.get<ThemeMode>(THEME_KEY) ?? settings.appearance.defaultTheme,
  )

  useEffect(() => {
    applyTheme(mode)
    applyAccent(accent, mode)
  }, [mode, accent])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    storage.set(THEME_KEY, next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      accent,
      setMode,
      toggle: () => setMode(mode === 'dark' ? 'light' : 'dark'),
    }),
    [mode, accent, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
