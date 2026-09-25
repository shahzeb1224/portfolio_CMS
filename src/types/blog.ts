import type { BaseEntity, SeoMeta } from './common'

export const POST_STATUSES = ['draft', 'published'] as const
export type PostStatus = (typeof POST_STATUSES)[number]

export interface BlogPost extends BaseEntity {
  title: string
  slug: string
  excerpt: string
  /** Markdown content. */
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  /** Empty until published. */
  publishedAt: string
  /** Minutes; derived from content length when omitted. */
  readingTime: number
  status: PostStatus
  featured: boolean
  seo: SeoMeta
}

export type CreateBlogPostInput = Omit<
  BlogPost,
  'id' | 'createdAt' | 'updatedAt' | 'slug' | 'readingTime'
> & {
  slug?: string
  readingTime?: number
}
export type UpdateBlogPostInput = Partial<CreateBlogPostInput>
