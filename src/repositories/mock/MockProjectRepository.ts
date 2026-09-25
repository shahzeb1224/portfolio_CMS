import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types'
import { STORAGE_KEYS, storage, type StorageAdapter } from '@/lib/storage'
import { uniqueSlug } from '@/lib/slug'
import { deepClone } from '@/lib/clone'
import type { ProjectRepository } from '../types'
import { BaseMockRepository, nextSortOrder } from './base'

type Fields = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export class MockProjectRepository
  extends BaseMockRepository<Project, CreateProjectInput, UpdateProjectInput>
  implements ProjectRepository
{
  constructor(store: StorageAdapter = storage) {
    super(STORAGE_KEYS.projects, 'proj', 'Project', store)
  }

  protected prepareCreate(data: CreateProjectInput, items: Project[]): Fields {
    const slugs = items.map((p) => p.slug)
    const slug = uniqueSlug(data.slug || data.title, slugs)
    const sortOrder = data.sortOrder ?? nextSortOrder(items)
    return { ...data, slug, sortOrder } as Fields
  }

  protected prepareUpdate(data: UpdateProjectInput, existing: Project): Partial<Fields> {
    const patch: Partial<Fields> = { ...data } as Partial<Fields>
    if (data.slug !== undefined) {
      const others = this.read()
        .filter((p) => p.id !== existing.id)
        .map((p) => p.slug)
      patch.slug = uniqueSlug(data.slug || existing.title, others)
    }
    return patch
  }

  protected sort(items: Project[]): Project[] {
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const found = this.read().find((p) => p.slug === slug)
    return found ? deepClone(found) : null
  }
}
