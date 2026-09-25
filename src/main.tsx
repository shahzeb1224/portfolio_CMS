import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { seedDatabase } from '@/data/seed'
import { storage, STORAGE_KEYS } from '@/lib/storage'
import { applyTheme, applyAccent } from '@/lib/theme'
import type { SiteSettings, ThemeMode } from '@/types'

// 1. Seed the mock database before any repository reads from it.
seedDatabase()

// 2. Apply persisted theme mode + brand accent before first paint (no flash).
const settings = storage.get<SiteSettings>(STORAGE_KEYS.settings)
const storedMode = storage.get<ThemeMode>('ui_theme')
const mode: ThemeMode = storedMode ?? settings?.appearance.defaultTheme ?? 'dark'
applyTheme(mode)
applyAccent(settings?.appearance.accent ?? 'violet', mode)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
