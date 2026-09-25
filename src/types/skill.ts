import type { BaseEntity } from './common'

export const SKILL_CATEGORIES = [
  'frontend',
  'backend',
  'database',
  'tools',
  'devops',
  'other',
] as const

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools',
  devops: 'DevOps',
  other: 'Other',
}

export interface Skill extends BaseEntity {
  name: string
  category: SkillCategory
  /** Lucide icon name (e.g. "Code2") or an image URL. */
  icon: string
  /** 0–100. */
  proficiency: number
  yearsOfExperience: number
  featured: boolean
  sortOrder: number
}

export type CreateSkillInput = Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'> & {
  sortOrder?: number
}
export type UpdateSkillInput = Partial<CreateSkillInput>
