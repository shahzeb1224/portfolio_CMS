import type { BaseEntity } from './common'

export interface Certification extends BaseEntity {
  name: string
  issuer: string
  issueDate: string
  credentialId: string
  credentialUrl: string
  image: string
  sortOrder: number
}

export type CreateCertificationInput = Omit<
  Certification,
  'id' | 'createdAt' | 'updatedAt' | 'sortOrder'
> & { sortOrder?: number }
export type UpdateCertificationInput = Partial<CreateCertificationInput>
