import type { ID, Timestamps, SeoMeta } from './common'

export const ACCENT_KEYS = ['violet', 'blue', 'emerald', 'cyan'] as const
export type AccentKey = (typeof ACCENT_KEYS)[number]

export type ThemeMode = 'dark' | 'light'

export interface AppearanceSettings {
  defaultTheme: ThemeMode
  accent: AccentKey
  animationsEnabled: boolean
}

/**
 * Site-wide settings singleton (id === "settings"). Contact details and social
 * links deliberately live on the Profile to keep a single source of truth;
 * settings owns branding, SEO defaults and appearance.
 */
export interface SiteSettings extends Timestamps {
  id: ID
  siteName: string
  siteDescription: string
  logoText: string
  logoImageUrl: string
  faviconUrl: string
  seo: SeoMeta
  appearance: AppearanceSettings
}

export type UpdateSettingsInput = Partial<Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>>
