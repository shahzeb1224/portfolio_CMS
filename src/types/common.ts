/**
 * Shared primitives used across every entity.
 *
 * Every entity carries a stable string `id` and ISO-8601 timestamps. When the
 * Express + MongoDB backend arrives it maps `_id -> id` and the frontend keeps
 * using `id` unchanged, so no component needs to know about Mongo internals.
 */

export type ID = string
export type ISODateString = string

export interface Timestamps {
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface BaseEntity extends Timestamps {
  id: ID
}

/** Per-page / per-entity SEO metadata. */
export interface SeoMeta {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export const SOCIAL_PLATFORMS = [
  'github',
  'linkedin',
  'twitter',
  'instagram',
  'facebook',
  'youtube',
  'dribbble',
  'behance',
  'website',
] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export interface SocialLink {
  platform: SocialPlatform
  url: string
  enabled: boolean
}

/** Generic async resource states used by UI components. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

/** A field helper: makes the listed keys optional. */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
