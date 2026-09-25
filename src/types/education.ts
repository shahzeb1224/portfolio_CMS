import type { BaseEntity } from './common'

export interface Education extends BaseEntity {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  institutionUrl: string
  sortOrder: number
}

export type CreateEducationInput = Omit<
  Education,
  'id' | 'createdAt' | 'updatedAt' | 'sortOrder'
> & { sortOrder?: number }
export type UpdateEducationInput = Partial<CreateEducationInput>
