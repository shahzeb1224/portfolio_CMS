import type { BaseEntity, SeoMeta } from './common'

export const PROJECT_CATEGORIES = [
  'Web App',
  'Landing Page',
  'E-commerce',
  'Dashboard',
  'Mobile',
  'API / Backend',
  'Design System',
  'Other',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export interface Project extends BaseEntity {
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail: string
  images: string[]
  technologies: string[]
  category: string
  features: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  githubUrl: string
  liveUrl: string
  client: string
  completedAt: string
  featured: boolean
  published: boolean
  sortOrder: number
  seo: SeoMeta
}

/** Slug is optional on create — the service derives it from the title. */
export type CreateProjectInput = Omit<
  Project,
  'id' | 'createdAt' | 'updatedAt' | 'slug' | 'sortOrder'
> & {
  slug?: string
  sortOrder?: number
}
export type UpdateProjectInput = Partial<CreateProjectInput>
