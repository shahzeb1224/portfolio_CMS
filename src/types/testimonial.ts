import type { BaseEntity, ID } from './common'

export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export interface Testimonial extends BaseEntity {
  clientName: string
  clientPhoto: string
  position: string
  company: string
  testimonial: string
  /** 1–5. */
  rating: number
  /** Optional related project id. */
  projectId: ID | null
  featured: boolean
  published: boolean
  sortOrder: number
  /** Optional review title (user-submitted reviews). */
  title?: string
  /** Review moderation status. */
  status?: ReviewStatus
  /** Optional related project or reference URL. */
  projectUrl?: string
  /** Optional screenshot URLs. */
  screenshots?: string[]
}

export type CreateTestimonialInput = Omit<
  Testimonial,
  'id' | 'createdAt' | 'updatedAt' | 'sortOrder'
> & { sortOrder?: number }
export type UpdateTestimonialInput = Partial<CreateTestimonialInput>

