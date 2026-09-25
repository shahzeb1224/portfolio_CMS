import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types'
import { STORAGE_KEYS, storage, type StorageAdapter } from '@/lib/storage'
import { uniqueSlug } from '@/lib/slug'
import { estimateReadingTime } from '@/lib/format'
import { deepClone } from '@/lib/clone'
import type { BlogRepository } from '../types'
import { BaseMockRepository } from './base'

type Fields = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

export class MockBlogRepository
  extends BaseMockRepository<BlogPost, CreateBlogPostInput, UpdateBlogPostInput>
  implements BlogRepository
{
  constructor(store: StorageAdapter = storage) {
    super(STORAGE_KEYS.blog, 'post', 'Blog post', store)
  }

  protected prepareCreate(data: CreateBlogPostInput, items: BlogPost[]): Fields {
    const slug = uniqueSlug(data.slug || data.title, items.map((p) => p.slug))
    const readingTime = data.readingTime ?? estimateReadingTime(data.content)
    return { ...data, slug, readingTime } as Fields
  }

  protected prepareUpdate(data: UpdateBlogPostInput, existing: BlogPost): Partial<Fields> {
    const patch: Partial<Fields> = { ...data } as Partial<Fields>
    if (data.slug !== undefined) {
      const others = this.read()
        .filter((p) => p.id !== existing.id)
        .map((p) => p.slug)
      patch.slug = uniqueSlug(data.slug || existing.title, others)
    }
    if (data.content !== undefined && data.readingTime === undefined) {
      patch.readingTime = estimateReadingTime(data.content)
    }
    return patch
  }

  protected sort(items: BlogPost[]): BlogPost[] {
    return [...items].sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt
      const bDate = b.publishedAt || b.createdAt
      return bDate.localeCompare(aDate)
    })
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const found = this.read().find((p) => p.slug === slug)
    return found ? deepClone(found) : null
  }
}
