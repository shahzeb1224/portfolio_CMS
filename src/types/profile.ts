import type { ID, Timestamps, SocialLink } from './common'

/**
 * Hero content. Identity (name / title / avatar) intentionally lives on the
 * Profile so that editing your name in one place updates the hero, navbar,
 * footer and SEO everywhere — the non-negotiable "single source of truth"
 * requirement. The hero owns only its surrounding presentation.
 */
export interface Hero {
  greeting: string
  valueProposition: string
  availabilityText: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  /** Optional hero-specific image; falls back to Profile.avatar when empty. */
  imageOverride: string
  showGreeting: boolean
  showAvailability: boolean
  showSecondaryCta: boolean
  showSocials: boolean
}

/**
 * The Profile is a singleton (id === "profile"). It is the canonical source of
 * personal identity, contact details, headline statistics and social links.
 */
export interface Profile extends Timestamps {
  id: ID
  fullName: string
  professionalTitle: string
  tagline: string
  avatar: string
  email: string
  phone: string
  location: string
  shortBio: string
  longBio: string
  currentFocus: string
  available: boolean
  availabilityMessage: string
  yearsOfExperience: number
  projectsCompleted: number
  happyClients: number
  resumeUrl: string
  social: SocialLink[]
  hero: Hero
}

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>
