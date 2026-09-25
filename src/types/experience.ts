import type { BaseEntity } from './common'

export const EMPLOYMENT_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
] as const

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

export interface Experience extends BaseEntity {
  company: string
  position: string
  location: string
  employmentType: EmploymentType
  /** ISO date (YYYY-MM-DD or full ISO). */
  startDate: string
  /** Empty when `current` is true. */
  endDate: string
  current: boolean
  description: string
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  companyUrl: string
  sortOrder: number
}

export type CreateExperienceInput = Omit<
  Experience,
  'id' | 'createdAt' | 'updatedAt' | 'sortOrder'
> & { sortOrder?: number }
export type UpdateExperienceInput = Partial<CreateExperienceInput>
