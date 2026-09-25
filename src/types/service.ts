import type { BaseEntity } from './common'

export interface Service extends BaseEntity {
  title: string
  description: string
  /** Lucide icon name. */
  icon: string
  features: string[]
  startingPrice: string
  deliveryTime: string
  featured: boolean
  published: boolean
  sortOrder: number
}

export type CreateServiceInput = Omit<
  Service,
  'id' | 'createdAt' | 'updatedAt' | 'sortOrder'
> & { sortOrder?: number }
export type UpdateServiceInput = Partial<CreateServiceInput>
