import type { BaseEntity } from './common'

export const MESSAGE_STATUSES = ['unread', 'read', 'replied', 'archived'] as const
export type MessageStatus = (typeof MESSAGE_STATUSES)[number]

export const PROJECT_TYPE_OPTIONS = [
  'Website Development',
  'Landing Page',
  'Web Application',
  'E-commerce',
  'Full-Stack Project',
  'Website Redesign',
  'Consultation',
  'Other',
] as const

export const BUDGET_OPTIONS = [
  '< $1k',
  '$1k – $5k',
  '$5k – $10k',
  '$10k – $25k',
  '$25k+',
  'Not sure yet',
] as const

export interface ContactMessage extends BaseEntity {
  name: string
  email: string
  company: string
  website: string
  projectType: string
  budget: string
  message: string
  status: MessageStatus
}

/** Public submissions never set a status — it defaults to "unread". */
export type CreateMessageInput = Omit<
  ContactMessage,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & { status?: MessageStatus }
export type UpdateMessageInput = Partial<Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>>
