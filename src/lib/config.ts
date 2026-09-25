/**
 * Public runtime configuration, sourced entirely from Vite env vars.
 * Nothing here is secret — these values ship in the client bundle. Private
 * credentials belong on the future Express backend only.
 */
export const config = {
  /** "mock" uses localStorage; "api" will use the Express REST backend. */
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'mock') as 'mock' | 'api',
  /** Base URL for the future REST API (empty while mock). */
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  /** Canonical site URL used for SEO/OG/canonical tags. */
  siteUrl:
    import.meta.env.VITE_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : ''),
} as const

export type AppConfig = typeof config
