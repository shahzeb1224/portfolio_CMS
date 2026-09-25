import type {
  CrudRepository,
  SingletonRepository,
  SlugLookup,
} from '@/repositories/types'

/**
 * The service layer sits between the store/UI and the repositories. It exposes
 * intent-revealing methods and houses cross-cutting domain logic (ordering,
 * publish queries, slug lookups) so components and the future backend swap stay
 * clean.
 */
export class CrudService<T extends { id: string }, C, U> {
  constructor(protected readonly repo: CrudRepository<T, C, U>) {}

  list(): Promise<T[]> {
    return this.repo.getAll()
  }
  get(id: string): Promise<T | null> {
    return this.repo.getById(id)
  }
  create(data: C): Promise<T> {
    return this.repo.create(data)
  }
  update(id: string, data: U): Promise<T> {
    return this.repo.update(id, data)
  }
  remove(id: string): Promise<void> {
    return this.repo.delete(id)
  }
  /** Duplicate an entity by id, applying an optional transform. */
  async duplicate(id: string, transform?: (data: C) => C): Promise<T | null> {
    const existing = await this.repo.getById(id)
    if (!existing) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = existing as T & {
      createdAt: string
      updatedAt: string
    }
    const input = rest as unknown as C
    return this.repo.create(transform ? transform(input) : input)
  }
}

/** Adds sort-order aware reordering for orderable collections. */
export class OrderedCrudService<
  T extends { id: string; sortOrder: number },
  C,
  U,
> extends CrudService<T, C, U> {
  /** Persist a new order given the full list of ids in the desired sequence. */
  async reorder(orderedIds: string[]): Promise<T[]> {
    await Promise.all(
      orderedIds.map((id, index) => this.repo.update(id, { sortOrder: index } as unknown as U)),
    )
    return this.list()
  }
}

export class SlugCrudService<T extends { id: string; slug: string }, C, U> extends CrudService<
  T,
  C,
  U
> {
  constructor(protected readonly slugRepo: CrudRepository<T, C, U> & SlugLookup<T>) {
    super(slugRepo)
  }
  getBySlug(slug: string): Promise<T | null> {
    return this.slugRepo.getBySlug(slug)
  }
}

export class SingletonService<T, U> {
  constructor(private readonly repo: SingletonRepository<T, U>) {}
  get(): Promise<T> {
    return this.repo.get()
  }
  update(data: U): Promise<T> {
    return this.repo.update(data)
  }
}
