import type { BaseEntity } from '@/types'
import { storage, type StorageAdapter } from '@/lib/storage'
import { generateId, nowISO } from '@/lib/id'
import { deepClone } from '@/lib/clone'
import { NotFoundError } from '@/lib/errors'
import type { CrudRepository, SingletonRepository } from '../types'

type EntityFields<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
type EntityPatch<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Generic localStorage-backed CRUD repository. Concrete repositories supply the
 * storage key, an id prefix, and a `prepareCreate` that maps the entity's
 * create-input to stored fields (deriving slugs, sort order, etc). The mock
 * repo plays the role the server will later play: it assigns id + timestamps.
 */
export abstract class BaseMockRepository<T extends BaseEntity, C, U>
  implements CrudRepository<T, C, U>
{
  protected constructor(
    protected readonly key: string,
    protected readonly idPrefix: string,
    protected readonly entityName: string,
    protected readonly store: StorageAdapter = storage,
  ) {}

  protected read(): T[] {
    return this.store.get<T[]>(this.key) ?? []
  }

  protected write(items: T[]): void {
    this.store.set(this.key, items)
  }

  /** Map a create-input to concrete stored fields (override per entity). */
  protected abstract prepareCreate(data: C, items: T[]): EntityFields<T>

  /** Transform an update-input into a patch (override to recompute derived fields). */
  protected prepareUpdate(data: U, _existing: T): EntityPatch<T> {
    return data as unknown as EntityPatch<T>
  }

  /** Default ordering; override for entity-specific sorting. */
  protected sort(items: T[]): T[] {
    return items
  }

  async getAll(): Promise<T[]> {
    return deepClone(this.sort(this.read()))
  }

  async getById(id: string): Promise<T | null> {
    const found = this.read().find((item) => item.id === id)
    return found ? deepClone(found) : null
  }

  async create(data: C): Promise<T> {
    const items = this.read()
    const fields = this.prepareCreate(data, items)
    const timestamp = nowISO()
    const entity = {
      ...fields,
      id: generateId(this.idPrefix),
      createdAt: timestamp,
      updatedAt: timestamp,
    } as T
    this.write([...items, entity])
    return deepClone(entity)
  }

  async update(id: string, data: U): Promise<T> {
    const items = this.read()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) throw new NotFoundError(this.entityName, id)
    const existing = items[index]
    const patch = this.prepareUpdate(data, existing)
    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: nowISO(),
    } as T
    items[index] = updated
    this.write(items)
    return deepClone(updated)
  }

  async delete(id: string): Promise<void> {
    const items = this.read()
    const next = items.filter((item) => item.id !== id)
    if (next.length === items.length) throw new NotFoundError(this.entityName, id)
    this.write(next)
  }
}

export function nextSortOrder(items: Array<{ sortOrder: number }>): number {
  if (items.length === 0) return 0
  return Math.max(...items.map((i) => i.sortOrder)) + 1
}

/**
 * CRUD repository for orderable entities whose create-input is the entity minus
 * system fields with an optional `sortOrder`. Auto-assigns sort order and sorts
 * ascending by it.
 */
export class OrderedMockRepository<
  T extends BaseEntity & { sortOrder: number },
  C extends { sortOrder?: number },
  U,
> extends BaseMockRepository<T, C, U> {
  constructor(key: string, idPrefix: string, entityName: string, store: StorageAdapter = storage) {
    super(key, idPrefix, entityName, store)
  }

  protected prepareCreate(data: C, items: T[]): Omit<T, 'id' | 'createdAt' | 'updatedAt'> {
    const sortOrder = data.sortOrder ?? nextSortOrder(items)
    return { ...(data as Record<string, unknown>), sortOrder } as unknown as Omit<
      T,
      'id' | 'createdAt' | 'updatedAt'
    >
  }

  protected sort(items: T[]): T[] {
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  }
}

/** localStorage-backed singleton (profile, settings). */
export class MockSingletonRepository<T extends { id: string; createdAt: string; updatedAt: string }, U>
  implements SingletonRepository<T, U>
{
  constructor(
    private readonly key: string,
    private readonly fallback: () => T,
    private readonly store: StorageAdapter = storage,
  ) {}

  async get(): Promise<T> {
    const value = this.store.get<T>(this.key)
    if (value) return deepClone(value)
    const seeded = this.fallback()
    this.store.set(this.key, seeded)
    return deepClone(seeded)
  }

  async update(data: U): Promise<T> {
    const current = await this.get()
    const updated = {
      ...current,
      ...(data as object),
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowISO(),
    } as T
    this.store.set(this.key, updated)
    return deepClone(updated)
  }
}
