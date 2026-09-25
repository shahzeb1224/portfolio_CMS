import { http } from './HttpClient'
import type { CrudRepository, SingletonRepository, SlugLookup } from '../types'

/**
 * Generic REST-backed repositories. These implement the exact same interfaces
 * as the mock repositories, so `repositories/index.ts` can hand the app either
 * one with zero changes to services or UI.
 *
 * Endpoint conventions (see the API-ready service layer in the spec):
 *   GET/POST         /:resource
 *   GET/PUT/DELETE   /:resource/:id
 *   GET              /:resource/slug/:slug
 */
export class ApiCrudRepository<T, C, U> implements CrudRepository<T, C, U> {
  constructor(protected readonly resource: string) {}

  getAll(): Promise<T[]> {
    return http.get<T[]>(`/${this.resource}`)
  }
  getById(id: string): Promise<T | null> {
    return http.get<T | null>(`/${this.resource}/${id}`)
  }
  create(data: C): Promise<T> {
    return http.post<T>(`/${this.resource}`, data)
  }
  update(id: string, data: U): Promise<T> {
    return http.put<T>(`/${this.resource}/${id}`, data)
  }
  delete(id: string): Promise<void> {
    return http.del<void>(`/${this.resource}/${id}`)
  }
}

export class ApiSlugCrudRepository<T, C, U>
  extends ApiCrudRepository<T, C, U>
  implements SlugLookup<T>
{
  getBySlug(slug: string): Promise<T | null> {
    return http.get<T | null>(`/${this.resource}/slug/${slug}`)
  }
}

export class ApiSingletonRepository<T, U> implements SingletonRepository<T, U> {
  constructor(private readonly resource: string) {}
  get(): Promise<T> {
    return http.get<T>(`/${this.resource}`)
  }
  update(data: U): Promise<T> {
    return http.put<T>(`/${this.resource}`, data)
  }
}
