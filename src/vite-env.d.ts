/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (localStorage) or "api" (future Express backend). */
  readonly VITE_DATA_SOURCE?: 'mock' | 'api'
  /** Base URL for the future REST API. */
  readonly VITE_API_URL?: string
  /** Public canonical site URL used for SEO tags. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
