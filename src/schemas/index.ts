import { z } from 'zod'
import { SKILL_CATEGORIES } from '@/types/skill'
import { EMPLOYMENT_TYPES } from '@/types/experience'
import { POST_STATUSES } from '@/types/blog'
import { SOCIAL_PLATFORMS } from '@/types/common'
import { ACCENT_KEYS } from '@/types/settings'

/* ── Reusable primitives ──────────────────────────────────────── */
const required = (label: string) => z.string().trim().min(1, `${label} is required`)
const url = z.string().trim().url('Enter a valid URL')
const optionalUrl = z.union([z.literal(''), url])
const strList = z.array(z.string()).default([])

const isValidUrlOrAssetRef = (val: string): boolean => {
  const trimmed = val.trim()
  if (!trimmed) return true
  // Internal local asset reference
  if (/^asset:\/\/[a-zA-Z0-9_\-\.]+$/.test(trimmed)) return true
  // Relative root path (e.g. /favicon.svg)
  if (/^\/[a-zA-Z0-9_\-\./%]+$/.test(trimmed)) return true
  // Remote HTTP/HTTPS URL
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const imageRef = z
  .string()
  .trim()
  .refine(isValidUrlOrAssetRef, {
    message: 'Must be a valid image URL or uploaded asset',
  })

export const optionalImageRef = z.union([z.literal(''), imageRef])

export const imageList = z.array(imageRef).default([])

export const seoSchema = z.object({
  metaTitle: z.string().default(''),
  metaDescription: z.string().default(''),
  keywords: z.array(z.string()).default([]),
  ogImage: optionalImageRef.optional().default(''),
  canonicalUrl: z.string().default(''),
})

const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string().default(''),
  enabled: z.boolean().default(true),
})

/* ── Auth ─────────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: required('Email').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginValues = z.infer<typeof loginSchema>

/* ── Profile ──────────────────────────────────────────────────── */
export const heroSchema = z.object({
  greeting: z.string().default(''),
  valueProposition: z.string().default(''),
  availabilityText: z.string().default(''),
  primaryCtaLabel: z.string().default(''),
  primaryCtaHref: z.string().default(''),
  secondaryCtaLabel: z.string().default(''),
  secondaryCtaHref: z.string().default(''),
  imageOverride: optionalImageRef,
  showGreeting: z.boolean().default(true),
  showAvailability: z.boolean().default(true),
  showSecondaryCta: z.boolean().default(true),
  showSocials: z.boolean().default(true),
})

export const profileSchema = z.object({
  fullName: required('Full name'),
  professionalTitle: required('Professional title'),
  tagline: z.string().default(''),
  avatar: optionalImageRef,
  email: required('Email').email('Enter a valid email'),
  phone: z.string().default(''),
  location: z.string().default(''),
  shortBio: required('Short bio'),
  longBio: z.string().default(''),
  currentFocus: z.string().default(''),
  available: z.boolean().default(true),
  availabilityMessage: z.string().default(''),
  yearsOfExperience: z.coerce.number().min(0).max(80),
  projectsCompleted: z.coerce.number().min(0),
  happyClients: z.coerce.number().min(0),
  resumeUrl: z.string().default(''),
  social: z.array(socialLinkSchema).default([]),
  hero: heroSchema,
})
export type ProfileValues = z.infer<typeof profileSchema>

/* ── Settings ─────────────────────────────────────────────────── */
export const settingsSchema = z.object({
  siteName: required('Site name'),
  siteDescription: z.string().default(''),
  logoText: z.string().default(''),
  logoImageUrl: optionalImageRef,
  faviconUrl: optionalImageRef,
  seo: seoSchema,
  appearance: z.object({
    defaultTheme: z.enum(['dark', 'light']),
    accent: z.enum(ACCENT_KEYS),
    animationsEnabled: z.boolean(),
  }),
})
export type SettingsValues = z.infer<typeof settingsSchema>

/* ── Skill ────────────────────────────────────────────────────── */
export const skillSchema = z.object({
  name: required('Name'),
  category: z.enum(SKILL_CATEGORIES),
  icon: required('Icon'),
  proficiency: z.coerce.number().min(0).max(100),
  yearsOfExperience: z.coerce.number().min(0).max(50),
  featured: z.boolean().default(false),
})
export type SkillValues = z.infer<typeof skillSchema>

/* ── Project ──────────────────────────────────────────────────── */
export const projectSchema = z.object({
  title: required('Title'),
  slug: z.string().default(''),
  shortDescription: required('Short description'),
  description: z.string().default(''),
  thumbnail: optionalImageRef,
  images: imageList,
  technologies: strList,
  category: required('Category'),
  features: strList,
  challenges: strList,
  solutions: strList,
  results: strList,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  client: z.string().default(''),
  completedAt: z.string().default(''),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  seo: seoSchema,
})
export type ProjectValues = z.infer<typeof projectSchema>

/* ── Experience ───────────────────────────────────────────────── */
export const experienceSchema = z
  .object({
    company: required('Company'),
    position: required('Position'),
    location: z.string().default(''),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    startDate: required('Start date'),
    endDate: z.string().default(''),
    current: z.boolean().default(false),
    description: z.string().default(''),
    responsibilities: strList,
    achievements: strList,
    technologies: strList,
    companyUrl: optionalUrl,
  })
  .refine((v) => v.current || v.endDate.trim().length > 0, {
    message: 'End date is required unless this is your current role',
    path: ['endDate'],
  })
export type ExperienceValues = z.infer<typeof experienceSchema>

/* ── Education ────────────────────────────────────────────────── */
export const educationSchema = z.object({
  institution: required('Institution'),
  degree: required('Degree'),
  field: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  current: z.boolean().default(false),
  description: z.string().default(''),
  institutionUrl: optionalUrl,
})
export type EducationValues = z.infer<typeof educationSchema>

/* ── Certification ────────────────────────────────────────────── */
export const certificationSchema = z.object({
  name: required('Name'),
  issuer: required('Issuer'),
  issueDate: z.string().default(''),
  credentialId: z.string().default(''),
  credentialUrl: optionalUrl,
  image: optionalImageRef,
})
export type CertificationValues = z.infer<typeof certificationSchema>

/* ── Service ──────────────────────────────────────────────────── */
export const serviceSchema = z.object({
  title: required('Title'),
  description: required('Description'),
  icon: required('Icon'),
  features: strList,
  startingPrice: z.string().default(''),
  deliveryTime: z.string().default(''),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})
export type ServiceValues = z.infer<typeof serviceSchema>

export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const

/* ── Public review submission ────────────────────────────────── */
export const publicReviewSchema = z.object({
  title: required('Review title')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be 100 characters or fewer'),
  description: required('Review description')
    .min(10, 'Review description must be at least 10 characters')
    .max(2000, 'Review description must be 2000 characters or fewer'),
  projectUrl: optionalUrl,
  screenshotUrl: optionalImageRef,
})
export type PublicReviewValues = z.infer<typeof publicReviewSchema>

/* ── Testimonial ──────────────────────────────────────────────── */
export const testimonialSchema = z.object({
  clientName: required('Client name'),
  clientPhoto: optionalImageRef,
  position: z.string().default(''),
  company: z.string().default(''),
  testimonial: required('Testimonial'),
  rating: z.coerce.number().min(1).max(5),
  projectId: z.string().nullable().default(null),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  title: z.string().default(''),
  status: z.enum(REVIEW_STATUSES).default('approved'),
  projectUrl: optionalUrl,
  screenshots: imageList,
})
export type TestimonialValues = z.infer<typeof testimonialSchema>

/* ── Blog ─────────────────────────────────────────────────────── */
export const blogSchema = z.object({
  title: required('Title'),
  slug: z.string().default(''),
  excerpt: required('Excerpt'),
  content: required('Content'),
  featuredImage: optionalImageRef,
  category: z.string().default(''),
  tags: strList,
  author: z.string().default(''),
  publishedAt: z.string().default(''),
  status: z.enum(POST_STATUSES),
  featured: z.boolean().default(false),
  seo: seoSchema,
})
export type BlogValues = z.infer<typeof blogSchema>

/* ── Contact message (public) ─────────────────────────────────── */
export const messageSchema = z.object({
  name: required('Name'),
  email: required('Email').email('Enter a valid email'),
  company: z.string().default(''),
  website: z.string().default(''),
  projectType: z.string().default(''),
  budget: z.string().default(''),
  message: required('Message').min(10, 'Please share a little more detail'),
})
export type MessageValues = z.infer<typeof messageSchema>
